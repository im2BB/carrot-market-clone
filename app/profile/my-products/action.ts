"use server";

import db from "@/lib/db";
import getSession from "@/lib/seeeion";
import { revalidatePath } from "next/cache";

// 내 판매상품 조회
export async function getMyProducts() {
  const session = await getSession();
  if (!session.id) return [];

  return await db.product.findMany({
    where: {
      userId: session.id,
    },
    orderBy: {
      created_at: "desc",
    },
  });
}

// 내 판매상품 삭제
export async function deleteMyProduct(productId: number) {
  const session = await getSession();
  if (!session.id) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  try {
    // 내가 등록한 상품인지 확인
    const product = await db.product.findFirst({
      where: {
        id: productId,
        userId: session.id,
      },
    });

    if (!product) {
      return {
        success: false,
        error: "상품을 찾을 수 없거나 삭제 권한이 없습니다.",
      };
    }

    await db.product.delete({
      where: {
        id: productId,
      },
    });

    revalidatePath("/profile/my-products");
    return { success: true };
  } catch (error) {
    console.error("상품 삭제 오류:", error);
    return { success: false, error: "상품 삭제에 실패했습니다." };
  }
}
