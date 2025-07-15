"use client";

import SocialLogin from "@/components/social-login";
import { useActionState } from "react";
import { createAccount } from "./action";
import Button from "@/components/button";
import Input from "@/components/Input";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export default function CreateAccount() {
  const [state, dispatch] = useActionState(createAccount, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl text-black dark:text-white">안녕하세요!</h1>
        <h2 className="text-xl text-black dark:text-white">
          당근당근 가입 당근합니다!
        </h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input
          name="username"
          type="text"
          placeholder="닉네임"
          required
          errors={state?.fieldErrors?.username}
          minLength={3}
          maxLength={10}
          defaultValue={String(state?.values?.username || "")}
        />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          required
          errors={state?.fieldErrors?.email}
          defaultValue={String(state?.values?.email || "")}
        />
        <Input
          name="password"
          type="password"
          placeholder="비밀번호"
          required
          errors={state?.fieldErrors.password}
          minLength={PASSWORD_MIN_LENGTH}
        />
        <Input
          name="confirm_password"
          type="password"
          placeholder="비밀번호 확인"
          required
          errors={state?.fieldErrors.confirm_password}
          minLength={PASSWORD_MIN_LENGTH}
        />
        <Button text={"가입 완료"} />
      </form>
      <SocialLogin text={" 가입하기"} />
    </div>
  );
}
