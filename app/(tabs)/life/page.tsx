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
  try {
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

    console.log("공지사항 개수:", notices.length);
    console.log("일반 게시글 개수:", posts.length);

    return { notices, posts };
  } catch (error) {
    console.error("게시글 조회 중 오류 발생:", error);
    return { notices: [], posts: [] };
  }
}

export default async function Life() {
  const { notices, posts } = await getPosts();

  return (
    <div className="p-5 flex flex-col gap-5">
      {/* 공지사항 섹션 */}
      {notices.length > 0 && (
        <div className="space-y-3 p-2">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-lg">📢</span>
            <h2 className="text-lg font-semibold text-black dark:text-white">
              공지사항
            </h2>
          </div>
          {notices.map((notice, index) => (
            <Link
              key={notice.id}
              href={`/posts/${notice.id}`}
              className={`block p-4 text-gray-600 dark:text-neutral-400 bg-gradient-to-r from-orange-900/10 to-transparent dark:from-orange-900/10 dark:to-transparent rounded-lg border border-orange-500/20 hover:from-orange-50 hover:bg-orange-50 dark:hover:from-orange-900/20 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer ${
                index < notices.length - 1
                  ? "border-b border-gray-200 dark:border-neutral-500 mb-3"
                  : ""
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-500 text-white">
                  📢 공지
                </span>
                <span className="text-orange-400 text-sm">
                  {formatToTimeAgo(notice.created_at.toString())}
                </span>
              </div>
              <h2 className="text-black dark:text-white text-lg font-semibold mb-1">
                {notice.title}
              </h2>
              <p className="text-gray-600 dark:text-neutral-400 whitespace-pre-wrap line-clamp-3">
                {notice.description}
              </p>
              <div className="flex items-center gap-4 text-sm mt-2">
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

      {/* 공지사항이 없을 때 안내 메시지 */}
      {notices.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>현재 공지사항이 없습니다.</p>
        </div>
      )}

      {/* 일반 게시글 섹션 */}
      <div className="space-y-3">
        {notices.length > 0 && (
          <div className="flex items-center space-x-2 mb-4 pt-6 border-t-2 border-gray-200 dark:border-neutral-600">
            <h2 className="text-lg font-semibold text-black dark:text-white">
              자유게시판
            </h2>
          </div>
        )}
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className={`block pb-5 mb-5 text-gray-600 dark:text-neutral-400 hover:bg-orange-50 dark:hover:bg-neutral-800/50 transition-colors cursor-pointer rounded-lg p-3 ${
                index < posts.length - 1
                  ? "border-b border-gray-200 dark:border-neutral-500"
                  : ""
              }`}
            >
              <h2 className="text-black dark:text-white text-lg font-semibold mb-1">
                {post.title}
              </h2>
              <p className="mb-1 text-gray-600 dark:text-neutral-400 whitespace-pre-wrap line-clamp-3">
                {post.description}
              </p>
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
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>아직 게시글이 없습니다.</p>
            <p className="text-sm mt-2">첫 번째 게시글을 작성해보세요!</p>
          </div>
        )}
      </div>

      <FloatingButton href="/add-post">
        <PlusIcon className="size-6" />
      </FloatingButton>
    </div>
  );
}
