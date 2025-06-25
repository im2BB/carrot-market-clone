import db from "@/lib/db";

// 최근 등록 상품 불러오기
export async function getRecentProducts() {
  return await db.product.findMany({
    take: 9,
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

// 이벤트 목록 불러오기
export async function getEvents() {
  return await db.event.findMany({
    orderBy: { created_at: "desc" },
  });
} 