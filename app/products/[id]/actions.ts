"use server";
import db from "@/lib/db";
import { redirect } from "next/navigation";

export async function deleteProduct(productId: number) {
  await db.product.delete({
    where: { id: productId },
  });
  redirect("/products");
}