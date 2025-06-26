"use server";

import { saveMessage } from "@/lib/actions/chat";

export async function saveMessageAction(payload: string, chatRoomId: string) {
  return await saveMessage(payload, chatRoomId);
}
