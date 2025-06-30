"use server";

import { deleteEvent } from "@/lib/actions/delete";

export async function deleteEventAction(eventId: number) {
  return await deleteEvent(eventId);
}
