"use server";

import { getCachedProductsWithPagination } from "@/lib/actions/database";

export async function getInitialProducts() {
  return await getCachedProductsWithPagination(0, 20);
}

export async function getMoreProducts(page: number) {
  return await getCachedProductsWithPagination(page, 20);
}
