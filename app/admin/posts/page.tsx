import { getAdminPosts } from "@/lib/actions/admin";
import { deletePost } from "@/lib/actions/delete";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";

// 관리자 게시글 삭제 액션
async function adminDeletePost(postId: number) {
  "use server";

  try {
    const result = await deletePost(postId);
    if (result.success) {
      return { success: true, message: "게시글이 삭제되었습니다." };
    } else {
      return { success: false, message: "게시글 삭제에 실패했습니다." };
    }
  } catch (error) {
    console.error("게시글 삭제 오류:", error);
    return { success: false, message: "게시글 삭제에 실패했습니다." };
  }
}

export default async function AdminPostsPage() {
  const { posts, totalPosts } = await getAdminPosts(0, 20);

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">
            게시글 관리
          </h1>
          <p className="text-sm lg:text-base text-neutral-400">
            총 {totalPosts}개의 게시글이 등록되어 있습니다
          </p>
        </div>
      </div>

      {/* 데스크톱 테이블 뷰 */}
      <div className="hidden lg:block bg-neutral-800 shadow-lg rounded-lg border border-neutral-700">
        <div className="px-6 py-4 border-b border-neutral-700">
          <h3 className="text-lg font-medium text-white">게시글 목록</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-700">
            <thead className="bg-neutral-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  제목
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  작성자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  조회수
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  활동
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  작성일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="bg-neutral-800 divide-y divide-neutral-700">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">
                      {post.title}
                    </div>
                    <div className="text-sm text-neutral-400">
                      {post.description?.substring(0, 50)}...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">
                      {post.user.username}
                    </div>
                    <div className="text-sm text-neutral-400">
                      {post.user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">
                      {post.views.toLocaleString()}회
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    <div>댓글 {post._count.comments}개</div>
                    <div>좋아요 {post._count.likes}개</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {formatDistanceToNow(new Date(post.created_at), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      href={`/posts/${post.id}`}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      보기
                    </Link>
                    <form
                      action={adminDeletePost.bind(null, post.id)}
                      className="inline"
                    >
                      <button
                        type="submit"
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        삭제
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 모바일 카드 뷰 */}
      <div className="lg:hidden space-y-3">
        <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
          <h3 className="text-base font-medium text-white mb-3">게시글 목록</h3>
        </div>
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-neutral-800 rounded-lg p-4 border border-neutral-700"
          >
            <div className="mb-3">
              <h4 className="text-sm font-medium text-white mb-1">
                {post.title}
              </h4>
              <p className="text-xs text-neutral-400 mb-2">
                {post.description?.substring(0, 100)}...
              </p>
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span>조회수 {post.views.toLocaleString()}회</span>
                <span>
                  {formatDistanceToNow(new Date(post.created_at), {
                    addSuffix: true,
                    locale: ko,
                  })}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-neutral-700 rounded p-2">
                <div className="text-xs text-neutral-400">작성자</div>
                <div className="text-sm text-white">{post.user.username}</div>
                <div className="text-xs text-neutral-400 truncate">
                  {post.user.email}
                </div>
              </div>
              <div className="bg-neutral-700 rounded p-2">
                <div className="text-xs text-neutral-400">댓글</div>
                <div className="text-sm text-white">
                  {post._count.comments}개
                </div>
              </div>
              <div className="bg-neutral-700 rounded p-2">
                <div className="text-xs text-neutral-400">좋아요</div>
                <div className="text-sm text-white">{post._count.likes}개</div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Link
                href={`/posts/${post.id}`}
                className="px-3 py-1 text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
              >
                보기
              </Link>
              <form
                action={adminDeletePost.bind(null, post.id)}
                className="inline"
              >
                <button
                  type="submit"
                  className="px-3 py-1 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                >
                  삭제
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
