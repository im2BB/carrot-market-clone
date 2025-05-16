"use client";

import Input from "@/components/Input";
import Button from "@/components/button";
import { useFormState } from "react-dom";
import { smsVerufication } from "./action";

export default function SMSLogIn() {
  const [state, dispatch] = useFormState(smsVerufication, null);
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS 로그인</h1>
        <h2 className="text-xl">핸드폰 번호를 입력하세요</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        <Input
          name="phone"
          type="number"
          placeholder="번호를 입력하세요"
          required
        />
        <Input
          name="token"
          type="number"
          placeholder="인증번호를 입력하세요"
          required
        />

        <Button text={"인증번호 확인"} />
      </form>
    </div>
  );
}
