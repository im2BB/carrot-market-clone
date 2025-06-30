"use server";

import { deleteChatRoom } from "@/lib/actions/delete";

export async function deleteChatRoomAction(chatRoomId: string) {
  return await deleteChatRoom(chatRoomId);
}
