"use server";

import { z } from "zod";
import validator from "validator";
import { redirect } from "next/navigation";
import { error } from "console";

const phoneSchema = z
  .string()
  .trim()
  .refine(
    (phone) => validator.isMobilePhone(phone, "ko-KR"),
    "올바른 전화번호를 입력하세요"
  );

const tokenSchema = z.coerce.number().min(100000).max(999999);
//coerce를 사용하면 변환을 할수 있음
// coerce.number 이런식이라면 문자열로 들어온다면 넘버로 변환

interface ActionState {
  token: boolean;
  phone?: string; // 전화번호 저장을 위한 필드 추가
}

export async function smsLogIn(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone")?.toString();
  const token = formData.get("token")?.toString();
  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    if (!result.success) {
      return {
        token: false,
        phone, // 실패해도 전화번호 유지
        error: result.error.flatten(),
      };
    } else {
      return {
        token: true,
        phone, // 성공시에도 전화번호 유지
      };
    }
  } else {
    const result = tokenSchema.safeParse(token);
    if (!result.success) {
      return {
        token: true,
        phone, // 토큰 검증 실패시에도 전화번호 유지
        error: result.error.flatten(),
      };
    } else {
      redirect("/");
    }
  }
}
