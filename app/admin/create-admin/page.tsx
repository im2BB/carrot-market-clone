import { createAdminAccount } from "@/lib/actions/admin";
import { revalidatePath } from "next/cache";

// 관리자 계정 생성 액션
async function handleCreateAdmin(formData: FormData) {
  "use server";

  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!username || !email || !password) {
    return { success: false, message: "모든 필드를 입력해주세요." };
  }

  const result = await createAdminAccount({ username, email, password });

  if (result.success) {
    revalidatePath("/admin/create-admin");
  }

  return result;
}

export default function CreateAdminPage() {
  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-white">
          관리자 계정 생성
        </h1>
        <p className="text-sm lg:text-base text-neutral-400">
          새로운 관리자 계정을 생성하세요
        </p>
      </div>

      {/* 관리자 계정 생성 폼 */}
      <div className="bg-neutral-800 shadow-lg rounded-lg border border-neutral-700">
        <div className="px-6 py-4 border-b border-neutral-700">
          <h3 className="text-lg font-medium text-white">새 관리자 계정</h3>
        </div>
        <div className="p-6">
          <form action={handleCreateAdmin} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-neutral-300 mb-2"
              >
                사용자명
              </label>
              <input
                type="text"
                name="username"
                id="username"
                required
                className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="사용자명"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-300 mb-2"
              >
                이메일
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="이메일"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-300 mb-2"
              >
                비밀번호
              </label>
              <input
                type="password"
                name="password"
                id="password"
                required
                minLength={8}
                className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="최소 8자 이상"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
              >
                관리자 계정 생성
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 안내 사항 */}
      <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-yellow-500 text-lg">⚠️</span>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-yellow-400">
              관리자 계정 생성 시 주의사항
            </h4>
            <div className="mt-2 text-sm text-yellow-300">
              <ul className="list-disc list-inside space-y-1">
                <li>
                  관리자 권한으로 생성된 계정은 모든 관리 기능에 접근할 수
                  있습니다
                </li>
                <li>비밀번호는 최소 8자 이상으로 설정해주세요</li>
                <li>이메일 주소는 중복될 수 없습니다</li>
                <li>생성된 계정은 즉시 관리자 권한을 가지게 됩니다</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
