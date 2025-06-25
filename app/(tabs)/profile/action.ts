import db from "@/lib/db";
import getSession from "@/lib/seeeion";

// 프로필 정보 불러오기
export async function getProfile() {
  const session = await getSession();
  if (!session.id) return null;
  return await db.user.findUnique({
    where: { id: session.id },
    include: {
      _count: {
        select: {
          products: true,
          posts: true,
        },
      },
    },
  });
} 