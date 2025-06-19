"use server";

import db from "@/lib/db";
import getSession from "@/lib/seeeion";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

export async function updateProfile(formData: FormData) {
  try {
    const session = await getSession();
    if (!session.id) {
      throw new Error("로그인이 필요합니다.");
    }

    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const avatarFile = formData.get("avatar") as File | null;

    if (!username) {
      throw new Error("사용자 이름은 필수입니다.");
    }

    if (password && password !== confirmPassword) {
      throw new Error("비밀번호가 일치하지 않습니다.");
    }

    const updateData: any = {
      username,
    };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    if (avatarFile && avatarFile instanceof File && avatarFile.size > 0) {
      const bytes = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64Image = `data:${avatarFile.type};base64,${buffer.toString(
        "base64"
      )}`;
      updateData.avater = base64Image; // Prisma 스키마의 필드명은 'avater'입니다
    }

    console.log("Updating user with data:", updateData); // 디버깅용 로그

    const updatedUser = await db.user.update({
      where: {
        id: session.id,
      },
      data: updateData,
    });
    if (!updatedUser) {
      return { error: "프로필 업데이트에 실패했습니다." };
    }

    return { redirect: "/profile" };
  } catch (error) {
    console.error("프로필 업데이트 중 오류 발생:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "프로필 업데이트 중 오류가 발생했습니다." };
  }
}
