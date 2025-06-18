import { GetcreatePost } from "./action";

export default function AddPost() {
  return (
    <div className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="font-bold">글쓰기</span>
      </div>
      <form action={GetcreatePost} className="flex flex-col gap-2">
        <input
          name="title"
          type="text"
          required
          placeholder="제목을 입력하세요"
          className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white"
        />
        <textarea
          name="description"
          required
          rows={10}
          placeholder="내용을 입력하세요"
          className="bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-white resize-none"
        />
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded">
          작성하기
        </button>
      </form>
    </div>
  );
}
