import db from "@/lib/db";
import { formatToTimeAgo } from "@/lib/utils";
import {
  ChatBubbleBottomCenterIcon,
  HandThumbUpIcon,
} from "@heroicons/react/24/outline";

import { PlusIcon } from "@heroicons/react/24/outline";
import FloatingButton from "@/components/floating-button";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "커뮤니티",
};

async function getPosts() {
  const posts = await db.post.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      views: true,
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
    orderBy: { created_at: "desc" },
  });
  return posts;
}

export default async function Life() {
  const posts = await getPosts();
  return (
    <div className="relative">
      <div className="p-5 flex flex-col">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <a
              key={post.id}
              href={`/posts/${post.id}`}
              className="pb-5 gap-2 mb-5 border-b border-neutral-500 text-neutral-400 flex flex-col last:pb-0 last:border-b-0"
            >
              <h2 className=" text-white text-lg font-semibold">
                {post.title}
              </h2>
              <p>{post.description}</p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex gap-4 items-center">
                  <span>
                    {new Date(post.created_at)
                      .toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                      .replace(/\. /g, ".")
                      .replace(/\.$/, "")}
                  </span>
                  <span>|</span>
                  <span className="text-orange-400">
                    {post.user?.username || "알 수 없음"}
                  </span>
                  <span>.</span>
                  <span>조회수 {post.views}</span>
                </div>
                <div className="flex gap-4 items-center *:flex *:items-center *:gap-1">
                  <span>
                    <HandThumbUpIcon className="size-4" />
                    {post._count.likes}
                  </span>
                  <span>
                    <ChatBubbleBottomCenterIcon className="size-4" />
                    {post._count.comments}
                  </span>
                </div>
              </div>
            </a>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center pt-64 gap-4">
            <p className="text-neutral-400 text-lg">
              등록된 커뮤니티 정보가 없습니다
            </p>
            <p className="text-neutral-500 text-sm">
              첫번째로 커뮤니티 정보를 등록해 보시겠어요?
            </p>
          </div>
        )}
      </div>
      <FloatingButton href="/add-post">
        <PlusIcon className="size-8" />
      </FloatingButton>
    </div>
  );
}
