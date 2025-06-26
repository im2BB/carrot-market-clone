import { getPostById } from "@/lib/actions/database";

export async function getPostByIdAction(id: number) {
  return await getPostById(id);
}
