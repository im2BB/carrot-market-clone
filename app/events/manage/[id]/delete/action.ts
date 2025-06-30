"use server";

import { deleteEvent as deleteEventLib } from "@/lib/actions/delete";

export async function deleteEventAction(eventId: number) {
  return await deleteEventLib(eventId);
}

// 반드시 named export로!
export const deleteEvent = deleteEventLib;
