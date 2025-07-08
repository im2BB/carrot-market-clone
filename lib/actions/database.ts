"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";

// 사용자 프로필 조회
export async function getUserProfile() {
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
}

// 최근 상품 조회
export async function getRecentProducts(limit: number = 9) {
  return await db.product.findMany({
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
}

// 상품 목록 조회 (페이지네이션)
export async function getProductsWithPagination(
  page: number = 0,
  take: number = 1
) {
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
}

// 상품 검색
export async function searchProducts(query: string, limit: number = 30) {
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
}

// 이벤트 목록 조회
export async function getEvents() {
  return await db.event.findMany({
    orderBy: { created_at: "desc" },
  });
}

// 특정 이벤트 조회
export async function getEventById(id: number) {
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
}

// 특정 상품 조회
export async function getProductById(id: number) {
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
}

// 특정 포스트 조회
export async function getPostById(id: number) {
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
}

// 라이브 스트림 조회
export async function getStreamById(id: number) {
  return await db.liveStream.findUnique({
    where: { id },
  });
}
