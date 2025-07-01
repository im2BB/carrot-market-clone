"use server";

import { getProductsWithPagination } from "@/lib/actions/database";

export async function getInitialProducts() {
  return await getProductsWithPagination(0, 50);
}

export async function getMoreProducts(page: number) {
  return await getProductsWithPagination(page, 50);
}
