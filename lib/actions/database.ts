// @ts-nocheck
"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { unstable_cache as nextCache } from "next/cache";

// 홈페이지 데이터를 한번에 가져오는 최적화된 함수
export async function getHomePageData() {
  try {
    // 병렬로 모든 데이터 가져오기
    const [products, events, posts] = await Promise.all([
      getRecentProducts(9),
      getEvents(),
      getRecentPosts(5),
    ]);

    return {
      products,
      events,
      posts,
    };
  } catch (error) {
    console.error("Database error in getHomePageData:", error);
    return {
      products: [],
      events: [],
      posts: [],
    };
  }
}

// 캐시된 홈페이지 데이터 - 5분 캐시
export const getCachedHomePageData = nextCache(
  getHomePageData,
  ["home-page-data"],
  {
    revalidate: 300, // 5분
    tags: ["home-data"],
  }
);

// 사용자 프로필 조회 (캐싱 추가)
export async function getUserProfile() {
  try {
    const session = await getSession();
    if (!session.id) return null;

    return await db.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        username: true,
        email: true,
        avater: true,
        created_at: true,
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

// 캐시된 사용자 프로필
export const getCachedUserProfile = nextCache(
  getUserProfile,
  ["user-profile"],
  {
    revalidate: 3600, // 1시간
    tags: ["user-profile"],
  }
);

// 최근 상품 조회 (select 최적화)
export async function getRecentProducts(limit: number = 9) {
  try {
    const products = await db.product.findMany({
      take: limit,
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        title: true,
        price: true,
        photo: true,
        photos: true,
        representativePhotoIndex: true,
        sold: true,
        created_at: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    // 대표 이미지 처리 최적화
    return products.map((product) => ({
      ...product,
      photo: getRepresentativePhoto(product),
    }));
  } catch (error) {
    console.error("Database error in getRecentProducts:", error);
    return [];
  }
}

// 최근 게시물 조회 (select 최적화)
export async function getRecentPosts(limit: number = 5) {
  try {
    const posts = await db.post.findMany({
      take: limit,
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        title: true,
        created_at: true,
        user: {
          select: {
            username: true,
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

// 대표 이미지 선택 로직을 서버에서 처리
function getRepresentativePhoto(product: any): string {
  // photos 배열이 있고 길이가 0보다 클 때
  if (Array.isArray(product.photos) && product.photos.length > 0) {
    const index =
      typeof product.representativePhotoIndex === "number"
        ? Math.max(
            0,
            Math.min(
              product.representativePhotoIndex,
              product.photos.length - 1
            )
          ) // 범위 체크
        : 0;
    const selectedPhoto = product.photos[index];
    if (selectedPhoto && selectedPhoto.trim() !== "") {
      return selectedPhoto;
    }
    // 첫 번째 유효한 이미지 찾기
    for (const photo of product.photos) {
      if (photo && photo.trim() !== "") {
        return photo;
      }
    }
  }

  // photo 필드가 있고 유효할 때
  if (product.photo && product.photo.trim() !== "") {
    return product.photo;
  }

  // 기본 이미지 반환
  return "/기본사용자.jpg";
}

// 상품 목록 조회 (페이지네이션) - 최적화
export async function getProductsWithPagination(
  page: number = 0,
  take: number = 20 // 기본값을 50에서 20으로 줄임
) {
  try {
    const products = await db.product.findMany({
      select: {
        id: true,
        title: true,
        price: true,
        created_at: true,
        photo: true,
        photos: true,
        representativePhotoIndex: true,
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

    return products.map((product) => ({
      ...product,
      photo: getRepresentativePhoto(product),
    }));
  } catch (error) {
    console.error("Database error in getProductsWithPagination:", error);
    return [];
  }
}

// 캐시된 상품 목록
export const getCachedProductsWithPagination = nextCache(
  getProductsWithPagination,
  ["products-pagination"],
  {
    revalidate: 300, // 5분
    tags: ["products"],
  }
);

// 상품 검색 (최적화)
export async function searchProducts(query: string, limit: number = 30) {
  try {
    if (!query || query.trim().length < 2) return [];

    const products = await db.product.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        title: true,
        price: true,
        photo: true,
        photos: true,
        representativePhotoIndex: true,
        created_at: true,
        sold: true,
      },
      orderBy: { created_at: "desc" },
      take: limit,
    });

    return products.map((product) => ({
      ...product,
      photo: getRepresentativePhoto(product),
    }));
  } catch (error) {
    console.error("Database error in searchProducts:", error);
    return [];
  }
}

// 이벤트 목록 조회 (캐싱 추가)
export async function getEvents() {
  try {
    const now = new Date();
    console.log("현재 시간:", now);

    // 먼저 모든 이벤트를 확인
    const allEvents = await db.event.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        link: true,
        isActive: true,
        start_date: true,
        end_date: true,
        created_at: true,
      },
      orderBy: { created_at: "desc" },
    });

    console.log("전체 이벤트:", allEvents.length, allEvents);

    // 조건을 완화하여 조회 (일시적으로 isActive만 체크)
    const events = await db.event.findMany({
      where: {
        isActive: true, // 활성 상태인 이벤트만
        // end_date 조건을 일시적으로 제거하여 모든 활성 이벤트 확인
      },
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
        link: true,
        created_at: true,
      },
      orderBy: { created_at: "desc" },
      take: 10, // 제한 추가
    });

    console.log("활성 이벤트:", events.length, events);

    return events;
  } catch (error) {
    console.error("Database error in getEvents:", error);
    return [];
  }
}

// 캐시된 이벤트 목록
export const getCachedEvents = nextCache(getEvents, ["events"], {
  revalidate: 3600, // 1시간
  tags: ["events"],
});

// 특정 이벤트 조회 (캐싱 추가)
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

// 캐시된 이벤트 상세
export const getCachedEventById = nextCache(getEventById, ["event-detail"], {
  revalidate: 3600, // 1시간
  tags: ["event-detail"],
});

// 특정 상품 조회 (최적화)
export async function getProductById(id: number) {
  try {
    return await db.product.findUnique({
      where: { id },
      include: {
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

// 캐시된 상품 상세
export const getCachedProductById = nextCache(
  getProductById,
  ["product-detail"],
  {
    revalidate: 300, // 5분
    tags: ["product-detail"],
  }
);

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
