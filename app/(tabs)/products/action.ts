"use server";

import db from "@/lib/db";

export async function getInitialProducts() {
  return db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
}

export async function getProductById(id: number) {
  return db.product.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      price: true,
      created_at: true,
      photo: true,
    },
  });
}
