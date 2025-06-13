"use client";

import Input from "@/components/Input";
import Button from "@/components/button";
import { useActionState } from "react"; // 변경
import { smsLogIn } from "./action";

const initialState = {
  token: false,
  phone: "", // 초기 상태에서 phone 값 필요
  error: undefined,
};

export default function SMSLogIn() {
  const [state, dispatch] = useActionState(smsLogIn, initialState); // 변경
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS 로그인</h1>
        <h2 className="text-xl">핸드폰 번호를 입력하세요</h2>
      </div>
      <form action={dispatch} className="flex flex-col gap-3">
        {state.token ? (
          <Input
            name="token"
            type="number"
            placeholder="인증번호를 입력하세요"
            required
            min={100000}
            max={999999}
            errors={state.error?.formErrors}
          />
        ) : (
          <Input
            name="phone"
            type="text"
            placeholder="전화번호를 입력하세요"
            required
            defaultValue={state.phone} // 입력값 초기화 방지
            errors={state.error?.formErrors} //오류메시지 출력
          />
        )}
        <Button text={state.token ? "인증번호 확인" : "인증번호 보내기"} />
      </form>
    </div>
  );
}
