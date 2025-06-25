"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

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

    revalidatePath("/events/manage");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("이벤트 삭제 오류:", error);
    return { success: false, error: "이벤트 삭제에 실패했습니다." };
  }
} 