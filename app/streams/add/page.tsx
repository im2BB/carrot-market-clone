"use client";

import Button from "@/components/button";
import Input from "@/components/Input";
import { useActionState } from "react";
import { startStream } from "./action";

export default function AddStream() {
  const [state, action] = useActionState(startStream, null);
  return (
    <form className="p-5 flex flex-col gap-2" action={action}>
      <Input
        name="title"
        required
        placeholder="방송 이름을 입력해주세요."
        errors={state?.formErrors}
      />
      <Button text="방송 시작" />
    </form>
  );
}
