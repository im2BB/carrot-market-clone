"use server";
import { deleteProduct } from "@/lib/actions/delete";

export async function deleteProductAction(productId: number) {
  return await deleteProduct(productId);
}
