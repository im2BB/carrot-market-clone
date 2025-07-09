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
      take: limit,
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
    return products;
  } catch (error) {
    console.error("Database error in getRecentProducts:", error);
    return [];
  }
}

// 상품 목록 조회 (페이지네이션)
export async function getProductsWithPagination(
  page: number = 0,
  take: number = 1
) {
  try {
    return await db.product.findMany({
      select: {
        title: true,
        price: true,
        created_at: true,
        photo: true,
        id: true,
      },
      skip: page * take,
      take,
      orderBy: {
        created_at: "desc",
      },
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

    return db.product.findMany({
      where: {
        OR: [
          { title: { contains: query } },
          { description: { contains: query } },
        ],
      },
      orderBy: { created_at: "desc" },
      take: limit,
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
      include: {
        user: {
          select: {
            username: true,
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
