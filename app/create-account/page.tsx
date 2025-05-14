import {
  ChatBubbleBottomCenterIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  ChatBubbleOvalLeftIcon,
} from "@heroicons/react/16/solid";
import Link from "next/link";

export default function CreateAccount() {
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">당근당근 가입 당근합니다!</h2>
      </div>
      <form className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 ">
          <input
            className="bg-transparent rounded-md w-full
            h-10 foucus:outline-none ring-1 focus:ring-2
            ring-neutral-200 focus:ring-orange-500 border-none
            placeholder:text-neutral-400"
            type="text"
            placeholder="이름"
            required
          />
          <span className="text-red-500 font-medium">오류 를 입력 하세요</span>
        </div>
        <button className="primary-btn h-10 text-">가입 완료</button>
      </form>
      <div className="w-full h-px bg-neutral-500" />
      <div>
        <Link
          className="primary-btn flex h-10 items-center justify-center gap-3"
          href={"/sms"}
        >
          <span>
            <ChatBubbleOvalLeftIcon className="h-6 w-6" />
          </span>
          <span>SMS로 가입하기</span>
        </Link>
      </div>
    </div>
  );
}
