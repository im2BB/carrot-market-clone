"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function toggleSoldStatus(productId: number) {
  const session = await getSession();

  if (!session.id) {
    return { error: "로그인이 필요합니다." };
  }

  try {
    // 상품 소유자 확인
    const product = await db.product.findUnique({
      where: { id: productId },
      select: { userId: true, sold: true },
    });

    if (!product) {
      return { error: "상품을 찾을 수 없습니다." };
    }

    if (product.userId !== session.id) {
      return { error: "권한이 없습니다." };
    }

    // 판매 상태 토글
    const updatedProduct = await db.product.update({
      where: { id: productId },
      data: { sold: !product.sold },
    });

    revalidatePath(`/products/${productId}`);
    revalidatePath("/products");
    revalidatePath("/");

    return { success: true, sold: updatedProduct.sold };
  } catch (error) {
    console.error("판매 상태 변경 중 오류:", error);
    return { error: "처리 중 오류가 발생했습니다." };
  }
}
