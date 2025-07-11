// @ts-nocheck
"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";

// 사용자 프로필 조회
export async function getUserProfile() {
  try {
    const session = await getSession();
    if (!session.id) return null;

    return await db.user.findUnique({
      where: { id: session.id },
      include: {
        _count: {
          select: {
            products: true,
            posts: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Database error in getUserProfile:", error);
    return null;
  }
}

// 최근 상품 조회
export async function getRecentProducts(limit: number = 9) {
  try {
    const products = await db.product.findMany({
      // 모든 상품 조회 (판매 완료 포함)
      take: limit,
      orderBy: { created_at: "desc" },
      // select: { ... } 제거 → 모든 필드 가져오기
    });

    // 대표 이미지 처리
    return products.map((product) => {
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
  } catch (error) {
    console.error("Database error in getRecentProducts:", error);
    return [];
  }
}

// 최근 게시물 조회
export async function getRecentPosts(limit: number = 5) {
  try {
    const posts = await db.post.findMany({
      take: limit,
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        created_at: true,
        views: true,
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
    });
    return posts;
  } catch (error) {
    console.error("Database error in getRecentPosts:", error);
    return [];
  }
}

// 상품 목록 조회 (페이지네이션)
export async function getProductsWithPagination(
  page: number = 0,
  take: number = 1
) {
  try {
    const products = await db.product.findMany({
      select: {
        title: true,
        price: true,
        created_at: true,
        photo: true,
        photos: true,
        representativePhotoIndex: true,
        id: true,
        sold: true,
        user: {
          select: {
            username: true,
          },
        },
      },
      skip: page * take,
      take,
      orderBy: {
        created_at: "desc",
      },
    });

    // 대표 이미지 처리
    return (products as any[]).map((product) => {
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
  } catch (error) {
    console.error("Database error in getProductsWithPagination:", error);
    return [];
  }
}

// 상품 검색
export async function searchProducts(query: string, limit: number = 30) {
  try {
    if (!query) return [];

    const products = await db.product.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
        ],
      },
      select: {
        id: true,
        title: true,
        price: true,
        description: true,
        photo: true,
        photos: true,
        representativePhotoIndex: true,
        created_at: true,
        sold: true,
      },
      orderBy: { created_at: "desc" },
      take: limit,
    });

    // 대표 이미지 처리
    return products.map((product) => {
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
  } catch (error) {
    console.error("Database error in searchProducts:", error);
    return [];
  }
}

// 이벤트 목록 조회
export async function getEvents() {
  try {
    const events = await db.event.findMany({
      orderBy: { created_at: "desc" },
    });
    return events;
  } catch (error) {
    console.error("Database error in getEvents:", error);
    return [];
  }
}

// 특정 이벤트 조회
export async function getEventById(id: number) {
  try {
    return await db.event.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Database error in getEventById:", error);
    return null;
  }
}

// 특정 상품 조회
export async function getProductById(id: number) {
  try {
    return await db.product.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        price: true,
        description: true,
        photo: true,
        created_at: true,
        sold: true,
        user: {
          select: {
            username: true,
            avater: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Database error in getProductById:", error);
    return null;
  }
}

// 특정 포스트 조회
export async function getPostById(id: number) {
  try {
    return await db.post.findUnique({
      where: { id },
      include: {
        user: true,
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("Database error in getPostById:", error);
    return null;
  }
}

// 라이브 스트림 조회
export async function getStreamById(id: number) {
  try {
    return await db.liveStream.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Database error in getStreamById:", error);
    return null;
  }
}
