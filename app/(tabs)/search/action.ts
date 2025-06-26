import { searchProducts } from "@/lib/actions/database";

export async function getSearchedProducts(query: string) {
  return await searchProducts(query, 30);
}
