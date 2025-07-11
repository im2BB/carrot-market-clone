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

const checkUniqueUsername = async (username: string) => {
  const user = await db.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });
  // return !user;
  return !Boolean(user);
};

const checkUniqueEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
  // return !user;
  return !Boolean(user);
};

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "닉네임은 문자열 이어야 합니다.",
        required_error: "닉네임을 입력하세요.",
      })
      .toLowerCase()
      .min(3, "닉네임은 최소 3자 이상 이어야 합니다.")
      .max(10, "닉네임은 최대 10자 이하여야 합니다.")
      .trim()
      .refine(checkUniqueUsername, "중복된 닉네임입니다."),
    email: z
      .string({
        invalid_type_error: "이메일은 문자열 이어야 합니다.",
        required_error: "이메일을 입력하세요.",
      })
      .email()
      .toLowerCase()
      .refine(checkUniqueEmail, "중복된 이메일입니다."),
    password: z
      .string({
        required_error: "비밀번호를 입력하세요.",
      })
      .min(PASSWORD_MIN_LENGTH, "비밀번호는 최소 4자 이상이어야 합니다.")
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string({
      required_error: "비밀번호 확인을 입력하세요.",
    }),
  })
  .superRefine(({ password, confirm_password }, ctx) => {
    if (password !== confirm_password) {
      ctx.addIssue({
        code: "custom",
        message: "비밀번호가 일치하지 않습니다.",
        path: ["confirm_password"],
      });
    }
  });

export async function createAccount(prevState: any, formData: FormData) {
  try {
    const data = {
      username: formData.get("username") ?? "",
      email: formData.get("email") ?? "",
      password: formData.get("password"),
      confirm_password: formData.get("confirm_password"),
    };
    const result = await formSchema.safeParseAsync(data);
    if (!result.success) {
      return {
        ...result.error.flatten(),
        values: {
          username: data.username,
          email: data.email,
        },
      };
    } else {
      const hashedPassword = await bcrypt.hash(result.data.password, 12);
      const user = await db.user.create({
        data: {
          username: result.data.username,
          email: result.data.email,
          password: hashedPassword,
        },
        select: {
          id: true,
        },
      });
      const session = await getSession();
      session.id = user.id;
      await session.save();

      redirect("/home");
    }
  } catch (error) {
    // Next.js redirect 오류는 다시 던져야 함
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }

    console.error("Create account error:", error);
    return {
      fieldErrors: {
        username: [],
        email: [],
        password: ["계정 생성 중 오류가 발생했습니다. 다시 시도해주세요."],
        confirm_password: [],
      },
      values: {
        username: formData.get("username"),
        email: formData.get("email"),
      },
    };
  }
}
