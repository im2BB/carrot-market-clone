import { getEvents, getEventById } from "@/lib/actions/database";

export async function getEventsAction() {
  return await getEvents();
}

export async function getEventByIdAction(id: number) {
  return await getEventById(id);
}
