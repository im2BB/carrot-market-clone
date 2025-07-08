"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidatePath } from "next/cache";

// 내 게시글 조회
export async function getMyPosts() {
  const session = await getSession();
  if (!session.id) return [];

  return await db.post.findMany({
    where: {
      userId: session.id,
    },
    include: {
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
}

// 내 게시글 삭제
export async function deleteMyPost(postId: number) {
  const session = await getSession();
  if (!session.id) {
    return { success: false, error: "로그인이 필요합니다." };
  }

  try {
    // 내가 작성한 게시글인지 확인
    const post = await db.post.findFirst({
      where: {
        id: postId,
        userId: session.id,
      },
    });

    if (!post) {
      return {
        success: false,
        error: "게시글을 찾을 수 없거나 삭제 권한이 없습니다.",
      };
    }

    await db.post.delete({
      where: {
        id: postId,
      },
    });

    revalidatePath("/profile/my-posts");
    return { success: true };
  } catch (error) {
    console.error("게시글 삭제 오류:", error);
    return { success: false, error: "게시글 삭제에 실패했습니다." };
  }
}
