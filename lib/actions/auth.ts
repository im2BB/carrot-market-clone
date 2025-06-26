"use server";

import db from "@/lib/db";
import bcrypt from "bcrypt";
import { z } from "zod";

// 사용자명 중복 확인
export async function checkUsernameExists(username: string) {
  const user = await db.user.findUnique({
    where: { username },
  });
  return Boolean(user);
}

// 이메일 중복 확인
export async function checkEmailExists(email: string) {
  const user = await db.user.findUnique({
    where: { email },
  });
  return Boolean(user);
}

// 비밀번호 해시화
export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

// 비밀번호 검증
export async function verifyPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}

// 사용자 스키마 검증
export const userSchema = z.object({
  username: z
    .string({
      invalid_type_error: "문자로만 가능해요!",
      required_error: "닉네임을 입력해주세요",
    })
    .toLowerCase()
    .trim()
    .min(3, "닉네임은 3자 이상이어야 합니다.")
    .max(10, "닉네임은 10자 이하여야 합니다."),
  email: z
    .string({
      invalid_type_error: "이메일을 입력해주세요",
      required_error: "이메일을 입력해주세요",
    })
    .toLowerCase()
    .email("올바른 이메일 형식이 아닙니다."),
  password: z.string().min(4, "비밀번호가 너무 짧아요"),
});

// 로그인 스키마 검증
export const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string({ required_error: "비밀번호를 입력하세요." }),
});
