import { getEventById } from "@/lib/actions/database";

export async function getEventByIdAction(id: number) {
  return await getEventById(id);
}
