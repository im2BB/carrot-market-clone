import FormInput from "@/components/form-input";
import FormBtn from "@/components/from-btn";
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
        <FormInput
          type="text"
          placeholder="사용자 이름"
          required
          errors={["사용자 이름이 너무 짧습니다"]}
        />
        <FormInput
          type="email"
          placeholder="e-mail"
          required
          errors={["email 형식이 아닙니다다"]}
        />
        <FormInput
          type="password"
          placeholder="비밀번호"
          required
          errors={["비밀번호가 너무 짧습니다"]}
        />
        <FormInput
          type="password"
          placeholder="비밀번호 확인"
          required
          errors={["비밀번호가 틀립니다"]}
        />
        <FormBtn loading={false} text={"가입 완료"} />
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
