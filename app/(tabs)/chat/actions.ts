"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

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
    return { success: false };
  }
}
