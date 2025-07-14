import { getAdminPosts, toggleNoticeStatus } from "@/lib/actions/admin";
import { deletePost } from "@/lib/actions/delete";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import AdminDeleteButton from "@/components/AdminDeleteButton";

export const dynamic = "force-dynamic";

// 관리자 게시글 삭제 액션 (서버 액션은 유지하되 사용하지 않음)
async function adminDeletePost(postId: number) {
  "use server";

  try {
    const result = await deletePost(postId);
    if (result.success) {
      revalidatePath("/admin/posts");
      redirect("/admin/posts?success=post_deleted");
    } else {
      redirect("/admin/posts?error=delete_failed");
    }
  } catch (error) {
    console.error("게시글 삭제 오류:", error);
    redirect("/admin/posts?error=delete_failed");
  }
}

// 공지사항 토글 액션
async function adminToggleNotice(postId: number) {
  "use server";

  try {
    const result = await toggleNoticeStatus(postId);
    if (result.success) {
      revalidatePath("/admin/posts");
      revalidatePath("/life");
      redirect("/admin/posts?success=notice_toggled");
    } else {
      redirect("/admin/posts?error=toggle_failed");
    }
  } catch (error) {
    console.error("공지사항 토글 오류:", error);
    redirect("/admin/posts?error=toggle_failed");
  }
}

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams?: { success?: string; error?: string };
}) {
  const { posts, totalPosts } = await getAdminPosts(0, 20);
  const success = searchParams?.success;
  const error = searchParams?.error;

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
        <Link
          href="/admin/create-notice"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          📢 공지사항 작성
        </Link>
      </div>

      {/* 성공 메시지 표시 */}
      {success && (
        <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-green-500 text-lg">✅</span>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-green-400">
                작업이 완료되었습니다
              </h4>
              <div className="mt-2 text-sm text-green-300">
                {success === "notice_created" &&
                  "공지사항이 성공적으로 등록되었습니다."}
                {success === "post_deleted" &&
                  "게시글이 성공적으로 삭제되었습니다."}
                {success === "notice_toggled" &&
                  "공지사항 상태가 변경되었습니다."}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 오류 메시지 표시 */}
      {error && (
        <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-red-500 text-lg">⚠️</span>
            </div>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-red-400">
                오류가 발생했습니다
              </h4>
              <div className="mt-2 text-sm text-red-300">
                작업을 완료할 수 없습니다. 다시 시도해주세요.
              </div>
            </div>
          </div>
        </div>
      )}

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
                  타입
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
                    <div className="flex items-center space-x-2">
                      {post.isNotice && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          📢 공지
                        </span>
                      )}
                      <div>
                        <div className="text-sm font-medium text-white">
                          {post.title}
                        </div>
                        <div className="text-sm text-neutral-400">
                          {post.description?.substring(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        post.isNotice
                          ? "bg-orange-100 text-orange-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {post.isNotice ? "공지사항" : "일반 게시글"}
                    </span>
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
                      action={adminToggleNotice.bind(null, post.id)}
                      className="inline"
                    >
                      <button
                        type="submit"
                        className={`transition-colors ${
                          post.isNotice
                            ? "text-yellow-400 hover:text-yellow-300"
                            : "text-orange-400 hover:text-orange-300"
                        }`}
                      >
                        {post.isNotice ? "공지해제" : "공지설정"}
                      </button>
                    </form>
                    <AdminDeleteButton
                      postId={post.id}
                      title={post.title}
                      isDesktop={true}
                    />
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
              <div className="flex items-center space-x-2 mb-2">
                {post.isNotice && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    📢 공지
                  </span>
                )}
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    post.isNotice
                      ? "bg-orange-100 text-orange-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {post.isNotice ? "공지사항" : "일반 게시글"}
                </span>
              </div>
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
                action={adminToggleNotice.bind(null, post.id)}
                className="inline"
              >
                <button
                  type="submit"
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                    post.isNotice
                      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
                >
                  {post.isNotice ? "공지해제" : "공지설정"}
                </button>
              </form>
              <AdminDeleteButton
                postId={post.id}
                title={post.title}
                isDesktop={false}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
