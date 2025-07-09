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
    console.log("Login attempt started");
    
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    
    console.log("Form data extracted:", { email: data.email });
    
    const result = await formSchema.safeParseAsync(data);
    if (!result.success) {
      console.log("Validation failed:", result.error);
      return result.error.flatten();
    } else {
      console.log("Validation passed, querying database");
      
      // 데이터베이스 연결 테스트
      try {
        await db.$connect();
        console.log("Database connected successfully");
      } catch (dbError) {
        console.error("Database connection failed:", dbError);
        throw new Error("데이터베이스 연결에 실패했습니다.");
      }
      
      const user = await db.user.findUnique({
        where: {
          email: result.data.email,
        },
        select: {
          id: true,
          password: true,
        },
      });
      
      console.log("User query result:", user ? "User found" : "User not found");
      
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
      
      console.log("Password comparison result:", ok);
      
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
    // Next.js redirect 오류는 다시 던져야 함
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    
    console.error("Login error details:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    return {
      fieldErrors: {
        email: [],
        password: [`로그인 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`],
      },
    };
  }
}
