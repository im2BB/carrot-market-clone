import BackButton from "@/components/back-button";
import { GetcreatePost } from "./action";
import Input from "@/components/Input";
import Button from "@/components/button";
import getSession from "@/lib/session";

export default async function AddPost() {
  const session = await getSession();
  const isAdmin = session.role === "ADMIN";

  return (
    <div className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="font-bold text-black dark:text-white">글쓰기</span>
      </div>
      <form
        action={GetcreatePost}
        className="flex flex-col gap-5 p-5 focus:outline-none"
      >
        <Input
          name="title"
          type="text"
          required
          placeholder="제목을 입력하세요"
        />
        <textarea
          name="description"
          required
          placeholder="내용을 입력하세요"
          className="bg-white dark:bg-transparent rounded-md w-full
            h-60 foucus:outline-none ring-2 focus:ring-4
            transition
            ring-gray-300 dark:ring-neutral-200 focus:ring-orange-500 border border-gray-300 dark:border-none
            placeholder:text-gray-500 dark:placeholder:text-neutral-400 text-black dark:text-white p-3"
        />

        {/* 관리자인 경우에만 공지사항 옵션 표시 */}
        {isAdmin && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isNotice"
              name="isNotice"
              value="true"
              className="w-4 h-4 text-orange-600 bg-gray-100 border-gray-300 rounded focus:ring-orange-500 dark:focus:ring-orange-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor="isNotice"
              className="text-sm font-medium text-gray-900 dark:text-gray-300"
            >
              공지사항으로 등록
            </label>
          </div>
        )}

        <Button text="저장하기" />
      </form>
      <BackButton />
    </div>
  );
}
