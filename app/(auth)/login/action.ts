"use server";
import bcrypt from "bcrypt";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";
import loginUser from "@/lib/login";

const checkEmailExists = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  // if (user) {
  //   return true;
  // } else {
  //   return false;
  // } or
  return Boolean(user);
};

const formSchema = z.object({
  email: z
    .string()
    .email()
    .toLowerCase()
    .refine(checkEmailExists, "존재하지 않는 이메일 입니다."),
  password: z.string({ required_error: "비밀번호를 입력하세요." }),
  //.min(PASSWORD_MIN_LENGTH)
  //.regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
});

export async function login(prevState: any, formData: FormData) {
  try {
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    const result = await formSchema.safeParseAsync(data);
    if (!result.success) {
      return result.error.flatten();
    } else {
      const user = await db.user.findUnique({
        where: {
          email: result.data.email,
        },
        select: {
          id: true,
          password: true,
        },
      });
      
      if (!user) {
        return {
          fieldErrors: {
            email: ["존재하지 않는 이메일입니다."],
            password: [],
          },
        };
      }
      
      const ok = await bcrypt.compare(
        result.data.password,
        user.password ?? "xxxx"
      );
      if (ok) {
        await loginUser(user);
        redirect("/profile");
      } else {
        return {
          fieldErrors: {
            password: ["잘못된 비밀번호 입니다."],
            email: [],
          },
        };
      }
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      fieldErrors: {
        email: [],
        password: ["로그인 중 오류가 발생했습니다. 다시 시도해주세요."],
      },
    };
  }
}
