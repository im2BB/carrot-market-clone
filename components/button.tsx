"use client";
import { useFormStatus } from "react-dom";

interface ButtonProps {
  text: string;
}

export default function Button({ text }: ButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      //이 훅은 form에 자식 계열(form내부)만 사용가능
      className="primary-btn h-10 
    disabled:bg-neutral-400 disabled:text-neutral-300
    disabled:cursor-not-allowed"
    >
      {pending ? "로딩 중..." : text}
    </button>
  );
}
