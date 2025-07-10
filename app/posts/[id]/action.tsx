"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";
import { revalidateTag } from "next/cache";

export async function likePost(postId: number) {
  const session = await getSession();
  try {
    await db.like.create({
      data: {
        postId,
        userId: session.id!,
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {}
}

export async function dislikePost(postId: number) {
  try {
    const session = await getSession();
    await db.like.delete({
      where: {
        id: {
          postId,
          userId: session.id!,
        },
      },
    });
    revalidateTag(`like-status-${postId}`);
  } catch (e) {}
}

// 댓글 조회
export async function getComments(postId: number) {
  try {
    return await db.comment.findMany({
      where: {
        postId,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avater: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  } catch (error) {
    console.error("댓글 조회 오류:", error);
    return [];
  }
}

// 댓글 작성
export async function createComment(postId: number, payload: string) {
  const session = await getSession();

  if (!session.id) {
    return { error: "로그인이 필요합니다." };
  }

  if (!payload.trim()) {
    return { error: "댓글 내용을 입력해주세요." };
  }

  try {
    const comment = await db.comment.create({
      data: {
        payload: payload.trim(),
        postId,
        userId: session.id,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avater: true,
          },
        },
      },
    });

    revalidateTag(`post-detail`);
    return { success: true, comment };
  } catch (error) {
    console.error("댓글 작성 오류:", error);
    return { error: "댓글 작성에 실패했습니다." };
  }
}

// 댓글 삭제
export async function deleteComment(commentId: number) {
  const session = await getSession();

  if (!session.id) {
    return { error: "로그인이 필요합니다." };
  }

  try {
    // 댓글 소유자 확인
    const comment = await db.comment.findUnique({
      where: { id: commentId },
      select: { userId: true, postId: true },
    });

    if (!comment) {
      return { error: "댓글을 찾을 수 없습니다." };
    }

    if (comment.userId !== session.id) {
      return { error: "삭제 권한이 없습니다." };
    }

    await db.comment.delete({
      where: { id: commentId },
    });

    revalidateTag(`post-detail`);
    return { success: true };
  } catch (error) {
    console.error("댓글 삭제 오류:", error);
    return { error: "댓글 삭제에 실패했습니다." };
  }
}
