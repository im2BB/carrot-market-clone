"use server";
import bcrypt from "bcrypt";
import db from "@/lib/db";
import { z } from "zod";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const usernameSchema = z.string().min(5).max(10);

const checkUesrname = (uesrname: string) => !uesrname.includes("potato");
const checkPasswords = (data: {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
}) => data.password === data.confirm_password;

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "문자로만 가능해요!",
        required_error: "닉네임을 입력해주세요",
      })
      .toLowerCase()
      .trim()
      .refine(checkUesrname, "potato는 안되요~"),
    email: z
      .string({
        invalid_type_error: "이메일을 입력해주세요",
        required_error: "이메일을 입력해주세요",
      })
      .toLowerCase()
      .email(),
    password: z.string().min(4, "비밀번호가 너무 짧아요"),
    confirm_password: z.string(),

    //   .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    // comfirm_Password: z.string().min(10, "비밀번호가 너무 짧아요"),
  })
  .superRefine(async ({ username }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "이미 사용중인 이름입니다.",
        path: ["username"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .superRefine(async ({ email }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (user) {
      ctx.addIssue({
        code: "custom",
        message: "이미 사용중인 이메일 입니다.",
        path: ["email"],
        fatal: true,
      });
      return z.NEVER;
    }
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "비밀번호가 다릅니다!",
    path: ["confirm_password"],
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

      redirect("/profile");
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
