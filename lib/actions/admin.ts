"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

// 현재 사용자가 관리자인지 확인
export async function isAdmin(): Promise<boolean> {
  try {
    const session = await getSession();
    if (!session.id) return false;

    const user = await db.user.findUnique({
      where: { id: session.id },
      select: { role: true },
    });

    return user?.role === Role.ADMIN;
  } catch (error) {
    console.error("관리자 권한 확인 오류:", error);
    return false;
  }
}

// 현재 사용자 정보 조회 (권한 포함)
export async function getCurrentUser() {
  try {
    const session = await getSession();
    if (!session.id) return null;

    return await db.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        created_at: true,
      },
    });
  } catch (error) {
    console.error("현재 사용자 정보 조회 오류:", error);
    return null;
  }
}

// 관리자 권한 확인 미들웨어
export async function requireAdmin() {
  const adminCheck = await isAdmin();
  if (!adminCheck) {
    throw new Error("관리자 권한이 필요합니다.");
  }
}

// 사용자를 관리자로 승격
export async function promoteToAdmin(userId: number) {
  await requireAdmin();

  try {
    await db.user.update({
      where: { id: userId },
      data: { role: Role.ADMIN },
    });
    return { success: true, message: "사용자가 관리자로 승격되었습니다." };
  } catch (error) {
    console.error("관리자 승격 오류:", error);
    return { success: false, message: "관리자 승격에 실패했습니다." };
  }
}

// 관리자 권한 제거
export async function removeAdminRole(userId: number) {
  await requireAdmin();

  try {
    await db.user.update({
      where: { id: userId },
      data: { role: Role.USER },
    });

    return { success: true, message: "관리자 권한이 제거되었습니다." };
  } catch (error) {
    console.error("관리자 권한 제거 오류:", error);
    return { success: false, message: "권한 제거에 실패했습니다." };
  }
}

// 관리자 계정 생성
export async function createAdminAccount(formData: {
  username: string;
  email: string;
  password: string;
}) {
  await requireAdmin();

  try {
    // 중복 확인
    const existingUser = await db.user.findFirst({
      where: {
        OR: [{ username: formData.username }, { email: formData.email }],
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: "이미 존재하는 사용자명 또는 이메일입니다.",
      };
    }

    // bcrypt를 사용하여 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(formData.password, 12);

    const newAdmin = await db.user.create({
      data: {
        username: formData.username,
        email: formData.email,
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });

    return {
      success: true,
      message: "관리자 계정이 생성되었습니다.",
      user: {
        id: newAdmin.id,
        username: newAdmin.username,
        email: newAdmin.email,
      },
    };
  } catch (error) {
    console.error("관리자 계정 생성 오류:", error);
    return { success: false, message: "계정 생성에 실패했습니다." };
  }
}

// 사용자 삭제
export async function deleteUser(userId: number) {
  await requireAdmin();

  try {
    // 관리자는 삭제할 수 없도록 보호
    const targetUser = await db.user.findUnique({
      where: { id: userId },
      select: { role: true, username: true },
    });

    if (!targetUser) {
      return { success: false, message: "사용자를 찾을 수 없습니다." };
    }

    if (targetUser.role === Role.ADMIN) {
      return { success: false, message: "관리자 계정은 삭제할 수 없습니다." };
    }

    await db.user.delete({
      where: { id: userId },
    });

    return {
      success: true,
      message: `사용자 ${targetUser.username}이(가) 삭제되었습니다.`,
    };
  } catch (error) {
    console.error("사용자 삭제 오류:", error);
    return { success: false, message: "사용자 삭제에 실패했습니다." };
  }
}

// 관리자용 대시보드 통계 조회
export async function getAdminStats() {
  await requireAdmin();

  try {
    const [userCount, productCount, postCount, eventCount] = await Promise.all([
      db.user.count(),
      db.product.count(),
      db.post.count(),
      db.event.count(),
    ]);

    const recentUsers = await db.user.findMany({
      take: 5,
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        username: true,
        email: true,
        created_at: true,
      },
    });

    const recentProducts = await db.product.findMany({
      take: 5,
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        title: true,
        price: true,
        created_at: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    return {
      stats: {
        userCount,
        productCount,
        postCount,
        eventCount,
      },
      recentUsers,
      recentProducts,
    };
  } catch (error) {
    console.error("관리자 통계 조회 오류:", error);
    throw new Error("통계 조회에 실패했습니다.");
  }
}

// 관리자용 사용자 목록 조회
export async function getAdminUsers(page: number = 0, take: number = 10) {
  await requireAdmin();

  try {
    const users = await db.user.findMany({
      skip: page * take,
      take,
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        created_at: true,
        _count: {
          select: {
            products: true,
            posts: true,
          },
        },
      },
    });

    const totalUsers = await db.user.count();

    return {
      users,
      totalUsers,
      hasMore: (page + 1) * take < totalUsers,
    };
  } catch (error) {
    console.error("관리자 사용자 목록 조회 오류:", error);
    throw new Error("사용자 목록 조회에 실패했습니다.");
  }
}

// 관리자용 상품 목록 조회
export async function getAdminProducts(page: number = 0, take: number = 10) {
  await requireAdmin();

  try {
    const products = await db.product.findMany({
      skip: page * take,
      take,
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        title: true,
        price: true,
        description: true,
        photo: true,
        photos: true,
        representativePhotoIndex: true,
        sold: true,
        created_at: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    const totalProducts = await db.product.count();

    // 대표 이미지 처리
    const processedProducts = products.map((product) => {
      let representativePhoto = product.photo; // 기본값

      if (Array.isArray(product.photos) && product.photos.length > 0) {
        const index =
          typeof product.representativePhotoIndex === "number"
            ? product.representativePhotoIndex
            : 0;
        representativePhoto = product.photos[index] || product.photos[0];
      }

      return {
        ...product,
        photo: representativePhoto, // 대표 이미지로 덮어쓰기
      };
    });

    return {
      products: processedProducts,
      totalProducts,
      hasMore: (page + 1) * take < totalProducts,
    };
  } catch (error) {
    console.error("관리자 상품 목록 조회 오류:", error);
    throw new Error("상품 목록 조회에 실패했습니다.");
  }
}

// 관리자용 게시글 목록 조회
export async function getAdminPosts(page: number = 0, take: number = 10) {
  await requireAdmin();

  try {
    const posts = await db.post.findMany({
      skip: page * take,
      take,
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        views: true,
        isNotice: true,
        created_at: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    const totalPosts = await db.post.count();

    return {
      posts,
      totalPosts,
      hasMore: (page + 1) * take < totalPosts,
    };
  } catch (error) {
    console.error("관리자 게시글 목록 조회 오류:", error);
    throw new Error("게시글 목록 조회에 실패했습니다.");
  }
}

// 관리자용 이벤트 목록 조회
export async function getAdminEvents(page: number = 0, take: number = 10) {
  await requireAdmin();

  try {
    const events = await db.event.findMany({
      skip: page * take,
      take,
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        link: true,
        start_date: true,
        end_date: true,
        isActive: true,
        created_at: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });

    const totalEvents = await db.event.count();

    return {
      events,
      totalEvents,
      hasMore: (page + 1) * take < totalEvents,
    };
  } catch (error) {
    console.error("관리자 이벤트 목록 조회 오류:", error);
    throw new Error("이벤트 목록 조회에 실패했습니다.");
  }
}

// 이벤트 활성화/비활성화 토글
export async function toggleEventActive(eventId: number) {
  await requireAdmin();

  try {
    const event = await db.event.findUnique({
      where: { id: eventId },
      select: { isActive: true },
    });

    if (!event) {
      return { success: false, message: "이벤트를 찾을 수 없습니다." };
    }

    await db.event.update({
      where: { id: eventId },
      data: { isActive: !event.isActive },
    });

    return {
      success: true,
      message: event.isActive
        ? "이벤트가 비활성화되었습니다."
        : "이벤트가 활성화되었습니다.",
    };
  } catch (error) {
    console.error("이벤트 상태 변경 오류:", error);
    return { success: false, message: "이벤트 상태 변경에 실패했습니다." };
  }
}

// 공지사항 생성
export async function createNotice(formData: {
  title: string;
  description: string;
}) {
  try {
    const session = await getSession();
    if (!session.id) {
      throw new Error("로그인이 필요합니다.");
    }

    const adminCheck = await isAdmin();
    if (!adminCheck) {
      throw new Error("관리자 권한이 필요합니다.");
    }

    const notice = await db.post.create({
      data: {
        title: formData.title,
        description: formData.description,
        isNotice: true,
        userId: session.id,
      },
    });

    return { success: true, message: "공지사항이 등록되었습니다.", notice };
  } catch (error) {
    console.error("공지사항 생성 오류:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "공지사항 등록에 실패했습니다.",
    };
  }
}

// 게시글을 공지사항으로 토글
export async function toggleNoticeStatus(postId: number) {
  try {
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      throw new Error("관리자 권한이 필요합니다.");
    }

    const post = await db.post.findUnique({
      where: { id: postId },
      select: { isNotice: true },
    });

    if (!post) {
      throw new Error("게시글을 찾을 수 없습니다.");
    }

    const updatedPost = await db.post.update({
      where: { id: postId },
      data: { isNotice: !post.isNotice },
    });

    return {
      success: true,
      message: post.isNotice
        ? "공지사항이 해제되었습니다."
        : "공지사항으로 설정되었습니다.",
      isNotice: updatedPost.isNotice,
    };
  } catch (error) {
    console.error("공지사항 상태 변경 오류:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "상태 변경에 실패했습니다.",
    };
  }
}

// 공지사항 목록 조회
export async function getNotices() {
  try {
    const notices = await db.post.findMany({
      where: { isNotice: true },
      select: {
        id: true,
        title: true,
        description: true,
        views: true,
        created_at: true,
        user: {
          select: {
            username: true,
          },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    });

    return notices;
  } catch (error) {
    console.error("공지사항 목록 조회 오류:", error);
    return [];
  }
}
