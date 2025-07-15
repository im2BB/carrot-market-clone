"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 상품 삭제
export async function deleteProduct(productId: number) {
  try {
    await db.product.delete({
      where: { id: productId },
    });
    revalidatePath("/products");
    redirect("/products");
  } catch (error) {
    console.error("상품 삭제 오류:", error);
    throw new Error("상품 삭제에 실패했습니다.");
  }
}

// 이벤트 삭제
export async function deleteEvent(eventId: number) {
  try {
    // 이벤트가 존재하는지 확인
    const event = await db.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return { success: false, error: "이벤트를 찾을 수 없습니다." };
    }

    // 이벤트 삭제
    await db.event.delete({
      where: { id: eventId },
    });

    revalidatePath("/admin/events");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("이벤트 삭제 오류:", error);
    return { success: false, error: "이벤트 삭제에 실패했습니다." };
  }
}

// 채팅방 삭제
export async function deleteChatRoom(chatRoomId: string) {
  try {
    // 트랜잭션을 사용하여 모든 작업이 함께 실행되도록 보장
    await db.$transaction(async (tx) => {
      // 1. 먼저 해당 채팅방의 모든 메시지 삭제
      await tx.message.deleteMany({
        where: {
          chatRoomId,
        },
      });

      // 2. 채팅방 삭제
      await tx.chatRoom.delete({
        where: {
          id: chatRoomId,
        },
      });
    });

    revalidatePath("/chat");
    return { success: true };
  } catch (error) {
    console.error("채팅방 삭제 중 오류 발생:", error);
    return { success: false, error: "채팅방 삭제에 실패했습니다." };
  }
}

// 게시글 삭제
export async function deletePost(postId: number) {
  try {
    // 트랜잭션을 사용하여 모든 작업이 함께 실행되도록 보장
    await db.$transaction(async (tx) => {
      // 1. 먼저 해당 게시글의 모든 좋아요 삭제
      await tx.like.deleteMany({
        where: {
          postId,
        },
      });

      // 2. 해당 게시글의 모든 댓글 삭제
      await tx.comment.deleteMany({
        where: {
          postId,
        },
      });

      // 3. 게시글 삭제
      await tx.post.delete({
        where: {
          id: postId,
        },
      });
    });

    revalidatePath("/life");
    return { success: true };
  } catch (error) {
    console.error("게시글 삭제 중 오류 발생:", error);
    return { success: false, error: "게시글 삭제에 실패했습니다." };
  }
}
