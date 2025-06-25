import db from "@/lib/db";

export async function getPostById(id: number) {
  return db.post.findUnique({
    where: { id },
    include: {
      user: true,
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
    },
  });
}
