import BackButton from "@/components/back-button";
import LikeButton from "@/components/like-button";
import CommentList from "@/components/comment-list";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToTimeAgo } from "@/lib/utils";
import { EyeIcon, UserIcon } from "@heroicons/react/24/outline";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getComments } from "./action";

async function getPost(id: number) {
  try {
    const post = await db.post.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
      include: {
        user: {
          select: {
            username: true,
            avater: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  } catch (e) {
    return null;
  }
}

const GetcachedPost = nextCache(getPost, ["post-detail"], {
  tags: ["post-detail"],
  revalidate: 60,
});

async function getLikeStatus(postId: number, userId: number) {
  // const session = await getSession();
  const isLiked = await db.like.findUnique({
    where: {
      id: {
        postId,
        userId: userId,
      },
    },
  });
  const likeCount = await db.like.count({
    where: {
      postId,
    },
  });
  return {
    likeCount,
    isLiked: Boolean(isLiked),
  };
}

async function getCachedLikeStatus(postId: number) {
  const session = await getSession();
  const userId = session.id;
  const cachedOperation = nextCache(getLikeStatus, ["product-like-status"], {
    tags: [`like-status-${postId}`],
  });
  return cachedOperation(postId, userId!);
}

export default async function PostDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession(); // 여기서 세션 가져오기
  const { id } = await params;
  const postId = Number(id);
  if (isNaN(postId)) {
    return notFound();
  }
  const post = await GetcachedPost(postId);
  if (!post) {
    return notFound();
  }

  // session.id를 인자로 전달
  const { likeCount, isLiked } = await getCachedLikeStatus(postId);

  // 댓글 목록 조회
  const comments = await getComments(postId);

  return (
    <div className="p-5 text-white max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-2">
        <div className="size-7 rounded-full overflow-hidden bg-white flex items-center justify-center">
          {post.user.avater ? (
            <Image
              width={28}
              height={28}
              className="size-7 rounded-full object-cover"
              src={post.user.avater}
              alt={post.user.username}
            />
          ) : (
            <UserIcon className="w-4 h-4 text-gray-600" />
          )}
        </div>
        <div>
          <span className="text-sm font-semibold">{post.user.username}</span>
          <div className="text-xs">
            <span>{formatToTimeAgo(post.created_at.toString())}</span>
          </div>
        </div>
      </div>
      <h2 className="text-lg font-semibold">{post.title}</h2>
      <p className="mb-5">{post.description}</p>
      <div className="flex flex-col gap-5 items-start">
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <EyeIcon className="size-5" />
          <span>조회 {post.views}</span>
        </div>
        <LikeButton isLiked={isLiked} likeCount={likeCount} postId={postId} />
      </div>

      {/* 댓글 섹션 */}
      <CommentList
        initialComments={comments}
        postId={postId}
        currentUserId={session.id}
      />

      <BackButton />
    </div>
  );
}
