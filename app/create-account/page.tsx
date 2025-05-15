"use client";

import FormInput from "@/components/form-input";
import FormBtn from "@/components/from-btn";
import SocialLogin from "@/components/social-login";
import { useFormState } from "react-dom";
import { createAccount } from "./action";

export default function CreateAccount() {
  const [state, dispatch] = useFormState(createAccount, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">당근당근 가입 당근합니다!</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <FormInput name="username" type="text" placeholder="닉네임" required />
        <FormInput name="email" type="email" placeholder="Email" required />
        <FormInput
          name="password"
          type="password"
          placeholder="비밀번호"
          required
        />
        <FormInput
          name="comfirm_Password"
          type="password"
          placeholder="비밀번호 확인"
          required
        />
        <FormBtn text={"가입 완료"} />
      </form>
      <SocialLogin text={" 가입하기"} />
    </div>
  );
}
