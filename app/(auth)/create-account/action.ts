"use server";
import bcrypt from "bcrypt";
import db from "@/lib/db";
import { z } from "zod";
import { redirect } from "next/navigation";
import getSession from "@/lib/seeeion";

const usernameSchema = z.string().min(5).max(10);

const checkUesrname = (uesrname: string) => !uesrname.includes("potato");
const checkPasswords = ({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) => password === confirm_password;

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "문자로만 가능해요!",
        required_error: "닉네임을 입력해주세요",
      })

      .toLowerCase() //소문자로 변환
      .trim() //공백제거
      // .transform((username) => {
      //   return '* {username} *'
      // })   이런식으로 변경해서 값을 보낼수 있음
      .refine(checkUesrname, "potato는 안되요~"),

    email: z
      .string({
        invalid_type_error: "이메일을 입력해주세요",
        required_error: "이메일을 입력해주세요",
      })
      .toLowerCase()
      .email(),

    password: z.string().min(4, "비밀번호가 너무 짧아요"),

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
  .refine(checkPasswords, {
    message: "비밀번호가 다릅니다!",
    path: ["confirm_password"],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username") ?? "",
    email: formData.get("email") ?? "",
    password: formData.get("password"),
    comfirm_Password: formData.get("comfirm_Password"),
  };
  const result = await formSchema.spa(data);
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
}
