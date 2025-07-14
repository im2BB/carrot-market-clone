import { createNotice } from "@/lib/actions/admin";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

// 공지사항 생성 액션
async function handleCreateNotice(formData: FormData) {
  "use server";

  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    if (!title || !description) {
      redirect("/admin/create-notice?error=missing_fields");
    }

    const result = await createNotice({ title, description });

    if (result.success) {
      revalidatePath("/admin/posts");
      revalidatePath("/life");
      redirect("/admin/posts?success=notice_created");
    } else {
      console.error("공지사항 생성 실패:", result.message);
      redirect(
        "/admin/create-notice?error=failed&message=" +
          encodeURIComponent(result.message || "알 수 없는 오류")
      );
    }
  } catch (error) {
    console.error("공지사항 생성 중 오류 발생:", error);
    redirect(
      "/admin/create-notice?error=server_error&message=" +
        encodeURIComponent("서버 오류가 발생했습니다")
    );
  }
}

export default function CreateNoticePage({
  searchParams,
}: {
  searchParams?: { error?: string; message?: string };
}) {
  const error = searchParams?.error;
  const errorMessage = searchParams?.message;

  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-white">
          공지사항 등록
        </h1>
        <p className="text-sm lg:text-base text-neutral-400">
          새로운 공지사항을 등록하세요
        </p>
      </div>

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
                {error === "missing_fields" &&
                  "제목과 내용을 모두 입력해주세요."}
                {error === "failed" &&
                  (errorMessage
                    ? decodeURIComponent(errorMessage)
                    : "공지사항 등록에 실패했습니다.")}
                {error === "server_error" &&
                  (errorMessage
                    ? decodeURIComponent(errorMessage)
                    : "서버 오류가 발생했습니다.")}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 공지사항 작성 폼 */}
      <div className="bg-neutral-800 shadow-lg rounded-lg border border-neutral-700">
        <div className="px-6 py-4 border-b border-neutral-700">
          <h3 className="text-lg font-medium text-white">공지사항 작성</h3>
        </div>
        <div className="p-6">
          <form action={handleCreateNotice} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-neutral-300 mb-2"
              >
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                maxLength={100}
                className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="공지사항 제목을 입력하세요"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-neutral-300 mb-2"
              >
                내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                id="description"
                required
                rows={8}
                className="w-full px-3 py-2 bg-neutral-700 border border-neutral-600 rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-vertical"
                placeholder="공지사항 내용을 입력하세요"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Link
                href="/admin/posts"
                className="bg-neutral-600 text-white px-4 py-2 rounded-lg hover:bg-neutral-700 transition-colors text-sm font-medium"
              >
                취소
              </Link>
              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
              >
                공지사항 등록
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 안내 사항 */}
      <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <span className="text-blue-500 text-lg">📢</span>
          </div>
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-400">
              공지사항 등록 안내
            </h4>
            <div className="mt-2 text-sm text-blue-300">
              <ul className="list-disc list-inside space-y-1">
                <li>공지사항은 게시판 상단에 고정 표시됩니다</li>
                <li>중요한 정보나 공지를 전달할 때 사용하세요</li>
                <li>제목은 간결하고 명확하게 작성해주세요</li>
                <li>등록 후 게시글 관리에서 일반 게시글로 변경 가능합니다</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
