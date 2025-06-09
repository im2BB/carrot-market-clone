"use server";
import bcrypt from "bcrypt";
import db from "@/lib/db";
import { z } from "zod";
import { redirect } from "next/navigation";
import getSession from "@/lib/seeeion";

const formSchema = z
  .object({
    username: z
      .string()
      .min(3, "닉네임은 3자 이상이어야 합니다")
      .max(10, "닉네임은 10자 이하여야 합니다"),

    email: z.string().email("올바른 이메일 형식이 아닙니다"),

    password: z.string().min(4, "비밀번호는 4자 이상이어야 합니다"),

    confirm_password: z.string().min(4, "비밀번호는 4자 이상이어야 합니다"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirm_password"],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const values = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };

  const result = await formSchema.safeParseAsync(values);

  if (!result.success) {
    return {
      fieldErrors: result.error.flatten().fieldErrors,
      values,
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
