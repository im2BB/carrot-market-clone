import { getAdminUsers, deleteUser } from "@/lib/actions/admin";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export const dynamic = "force-dynamic";

// 로컬 Role enum 정의 (Prisma 클라이언트가 업데이트되지 않은 경우)
enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

// 사용자 타입 정의
type AdminUser = {
  id: number;
  username: string;
  email: string | null;
  role: Role;
  created_at: Date;
  _count: {
    products: number;
    posts: number;
  };
};

// 사용자 삭제 액션
async function handleDeleteUser(userId: number) {
  "use server";

  const result = await deleteUser(userId);
  revalidatePath("/admin/users");
  return result;
}

export default async function AdminUsersPage() {
  const { users, totalUsers } = await getAdminUsers(0, 20);
  const typedUsers = users as unknown as AdminUser[];

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-black dark:text-white">
            사용자 관리
          </h1>
          <p className="text-sm lg:text-base text-gray-600 dark:text-neutral-400">
            총 {totalUsers}명의 사용자가 있습니다
          </p>
        </div>
        <Link
          href="/admin/create-admin"
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
        >
          👑 관리자 계정 생성
        </Link>
      </div>

      {/* 데스크톱 테이블 뷰 */}
      <div className="hidden lg:block bg-white dark:bg-neutral-800 shadow-lg rounded-lg border border-black dark:border-neutral-700">
        <div className="px-6 py-4 border-b border-black dark:border-neutral-700">
          <h3 className="text-lg font-medium text-black dark:text-white">
            사용자 목록
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-black dark:divide-neutral-700">
            <thead className="bg-gray-100 dark:bg-neutral-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-neutral-300 uppercase tracking-wider">
                  사용자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-neutral-300 uppercase tracking-wider">
                  이메일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-neutral-300 uppercase tracking-wider">
                  권한
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-neutral-300 uppercase tracking-wider">
                  활동
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-neutral-300 uppercase tracking-wider">
                  가입일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-neutral-300 uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-800 divide-y divide-black dark:divide-neutral-700">
              {typedUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-black dark:text-white">
                      {user.username}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-neutral-400">
                      ID: {user.id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-black dark:text-white">
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === Role.ADMIN
                          ? "bg-orange-500 text-white"
                          : "bg-neutral-600 text-neutral-200"
                      }`}
                    >
                      {user.role === Role.ADMIN ? "관리자" : "일반사용자"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white">
                    <div>상품 {user._count.products}개</div>
                    <div>게시글 {user._count.posts}개</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white">
                    {formatDistanceToNow(new Date(user.created_at), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {user.role !== Role.ADMIN && (
                      <form action={handleDeleteUser.bind(null, user.id)}>
                        <button
                          type="submit"
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          삭제
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 모바일 카드 뷰 */}
      <div className="lg:hidden space-y-3">
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-black dark:border-neutral-700">
          <h3 className="text-base font-medium text-black dark:text-white mb-3">
            사용자 목록
          </h3>
        </div>
        {typedUsers.map((user) => (
          <div
            key={user.id}
            className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-black dark:border-neutral-700"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium text-black dark:text-white truncate">
                    {user.username}
                  </h4>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.role === Role.ADMIN
                        ? "bg-orange-500 text-white"
                        : "bg-gray-500 dark:bg-neutral-600 text-white dark:text-neutral-200"
                    }`}
                  >
                    {user.role === Role.ADMIN ? "관리자" : "일반"}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-neutral-400 truncate">
                  {user.email}
                </p>
                <p className="text-xs text-gray-600 dark:text-neutral-400">
                  ID: {user.id}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-gray-100 dark:bg-neutral-700 rounded p-2">
                <div className="text-xs text-gray-600 dark:text-neutral-400">
                  활동
                </div>
                <div className="text-sm text-black dark:text-white">
                  상품 {user._count.products}개
                </div>
                <div className="text-sm text-black dark:text-white">
                  게시글 {user._count.posts}개
                </div>
              </div>
              <div className="bg-gray-100 dark:bg-neutral-700 rounded p-2">
                <div className="text-xs text-gray-600 dark:text-neutral-400">
                  가입일
                </div>
                <div className="text-sm text-black dark:text-white">
                  {formatDistanceToNow(new Date(user.created_at), {
                    addSuffix: true,
                    locale: ko,
                  })}
                </div>
              </div>
            </div>

            {user.role !== Role.ADMIN && (
              <div className="flex justify-end">
                <form action={handleDeleteUser.bind(null, user.id)}>
                  <button
                    type="submit"
                    className="px-3 py-1 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                  >
                    삭제
                  </button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
