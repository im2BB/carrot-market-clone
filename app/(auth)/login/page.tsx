"use client";

import FormInput from "@/components/Input";
import FormBtn from "@/components/button";
import { useActionState } from "react";
import { login } from "./action";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import GlobalLoading from "@/components/global-loading";
import SocialLogin from "@/components/social-login";

function LoginForm() {
  const [state, dispatch] = useActionState(login, null);
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex flex-col  py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl text-black dark:text-white">안녕하세요!</h1>
        <h2 className="text-xl text-black dark:text-white mb-10">
          로그인 시 이메일과 비밀번호를 입력하세요
        </h2>
      </div>

      {/* GitHub 로그인 에러 메시지 */}
      {error === "github_auth_failed" && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          GitHub 로그인에 실패했습니다. 다시 시도해주세요.
        </div>
      )}

      <form action={dispatch} className="flex flex-col gap-3 mb-5">
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

export default function LogIn() {
  return (
    <Suspense fallback={<GlobalLoading />}>
      <LoginForm />
    </Suspense>
  );
}
