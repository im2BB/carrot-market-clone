import BackButton from "@/components/back-button";
import { GetcreatePost } from "./action";
import Input from "@/components/Input";
import Button from "@/components/button";

export default function AddPost() {
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
        <Button text="저장하기" />
      </form>
      <BackButton />
    </div>
  );
}
