"use client";

import FormInput from "@/components/Input";
import FormBtn from "@/components/button";
import SocialLogin from "@/components/social-login";
import { useActionState } from "react";
import { login } from "./action";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export default function LogIn() {
  const [state, dispatch] = useActionState(login, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl text-black dark:text-white">안녕하세요!</h1>
        <h2 className="text-xl text-black dark:text-white">
          로그인 시 이메일과 비밀번호를 입력하세요
        </h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <FormInput
          name="email"
          type="email"
          placeholder="e-mail"
          required
          autoComplete="email"
          errors={state?.fieldErrors.email}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="비밀번호"
          required
          minLength={PASSWORD_MIN_LENGTH}
          autoComplete="current-password"
          errors={state?.fieldErrors.password}
        />
        <FormBtn text={"로그인"} />
      </form>
      <SocialLogin text={" 로그인"} />
    </div>
  );
}
