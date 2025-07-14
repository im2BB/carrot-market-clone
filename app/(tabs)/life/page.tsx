import db from "@/lib/db";
import { formatToTimeAgo } from "@/lib/utils";
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/24/outline";
import FloatingButton from "@/components/floating-button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "커뮤니티",
};

async function getPosts() {
  // 공지사항과 일반 게시글을 분리해서 조회
  const notices = await db.post.findMany({
    where: { isNotice: true },
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
      isNotice: true,
      created_at: true,
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
      user: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  const posts = await db.post.findMany({
    where: { isNotice: false },
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
      isNotice: true,
      created_at: true,
      _count: {
        select: {
          comments: true,
          likes: true,
        },
      },
      user: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return { notices, posts };
}

export default async function Life() {
  const { notices, posts } = await getPosts();

  return (
    <div className="p-5 flex flex-col gap-5">
      {/* 공지사항 섹션 */}
      {notices.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-lg">📢</span>
            <h2 className="text-lg font-semibold text-white">공지사항</h2>
          </div>
          {notices.map((notice) => (
            <Link
              key={notice.id}
              href={`/posts/${notice.id}`}
              className="block pb-5 mb-5 border-b border-neutral-500 text-neutral-400 last:pb-0 last:border-b-0 bg-gradient-to-r from-orange-900/10 to-transparent rounded-lg p-4 border border-orange-500/20 hover:from-orange-900/20 hover:bg-neutral-800/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2 mb-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-500 text-white">
                  📢 공지
                </span>
                <span className="text-orange-400 text-sm">
                  {formatToTimeAgo(notice.created_at.toString())}
                </span>
              </div>
              <h2 className="text-white text-lg font-semibold mb-1">
                {notice.title}
              </h2>
              <p className="mb-1 text-neutral-400">{notice.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <span>{notice.user.username}</span>
                <span>조회 {notice.views}</span>
                <span className="flex items-center gap-1">
                  <HandThumbUpIcon className="size-4" />
                  {notice._count.likes}
                </span>
                <span className="flex items-center gap-1">
                  <ChatBubbleBottomCenterIcon className="size-4" />
                  {notice._count.comments}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 일반 게시글 섹션 */}
      <div className="space-y-3">
        {notices.length > 0 && (
          <div className="flex items-center space-x-2 mb-4 pt-4 border-t border-neutral-600">
            <h2 className="text-lg font-semibold text-white">자유게시판</h2>
          </div>
        )}
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/posts/${post.id}`}
            className="block pb-5 mb-5 border-b border-neutral-500 text-neutral-400 last:pb-0 last:border-b-0 hover:bg-neutral-800/50 transition-colors cursor-pointer rounded-lg p-3"
          >
            <h2 className="text-white text-lg font-semibold mb-1">
              {post.title}
            </h2>
            <p className="mb-1 text-neutral-400">{post.description}</p>
            <div className="flex items-center gap-4 text-sm">
              <span>{post.user.username}</span>
              <span>{formatToTimeAgo(post.created_at.toString())}</span>
              <span>조회 {post.views}</span>
              <span className="flex items-center gap-1">
                <HandThumbUpIcon className="size-4" />
                {post._count.likes}
              </span>
              <span className="flex items-center gap-1">
                <ChatBubbleBottomCenterIcon className="size-4" />
                {post._count.comments}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <FloatingButton href="/add-post">
        <PlusIcon className="size-6" />
      </FloatingButton>
    </div>
  );
}
