import { getMyPosts } from "./action";
import Link from "next/link";
import BackButton from "@/components/back-button";
import DeletePostButton from "./DeletePostButton";

export const metadata = {
  title: "내 게시글",
};

export default async function MyPostsPage() {
  const posts = await getMyPosts();

  return (
    <div className="p-7 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <BackButton />
        <h1 className="text-3xl font-bold">내 게시글</h1>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-400 text-lg mb-4">
            작성한 게시글이 없습니다.
          </p>
          <Link
            href="/add-post"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            첫 번째 게시글 작성하기
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-neutral-800 rounded-lg p-6 border border-neutral-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold">{post.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                      <span>좋아요 {post._count.likes}</span>
                      <span>댓글 {post._count.comments}</span>
                    </div>
                  </div>
                  <p className="text-neutral-300 mb-4 line-clamp-3">
                    {post.description}
                  </p>
                  <div className="text-sm text-neutral-400 mb-4">
                    <span className="text-orange-400 font-medium">작성일:</span>{" "}
                    {new Date(post.created_at).toLocaleDateString("ko-KR")}
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={`/posts/${post.id}`}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      게시글 보기
                    </Link>
                    <Link
                      href={`/add-post?edit=${post.id}`}
                      className="bg-neutral-500 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      수정
                    </Link>
                    <DeletePostButton postId={post.id} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
