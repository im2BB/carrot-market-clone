import { getStreamById } from "@/lib/actions/database";

export async function getStreamByIdAction(id: number) {
  return await getStreamById(id);
}
