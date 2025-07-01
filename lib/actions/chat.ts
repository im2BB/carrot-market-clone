"use server";

import db from "@/lib/db";
import getSession from "@/lib/seeeion";

// 메시지 저장
export async function saveMessage(payload: string, chatRoomId: string) {
  const session = await getSession();
  await db.message.create({
    data: {
      payload,
      chatRoomId,
      userId: session.id!,
    },
    select: { id: true },
  });
}

// 채팅방 목록 조회
export async function getChatRooms() {
  const session = await getSession();
  if (!session.id) return [];

  return await db.chatRoom.findMany({
    where: {
      users: {
        some: {
          id: session.id,
        },
      },
    },
    include: {
      users: {
        select: {
          id: true,
          username: true,
        },
      },
      messages: {
        orderBy: {
          created_at: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      update_at: "desc",
    },
  });
}

// 특정 채팅방의 메시지 조회
export async function getChatMessages(chatRoomId: string) {
  return await db.message.findMany({
    where: {
      chatRoomId,
    },
    include: {
      user: {
        select: {
          id: true,
          username: true,
        },
      },
    },
    orderBy: {
      created_at: "asc",
    },
  });
}
