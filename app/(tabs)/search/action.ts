import db from "@/lib/db";

export async function getSearchedProducts(query: string) {
  if (!query) return [];
  return db.product.findMany({
    where: {
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
      ],
    },
    orderBy: { created_at: "desc" },
    take: 30,
  });
} 