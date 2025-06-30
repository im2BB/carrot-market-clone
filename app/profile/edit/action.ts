"use server";

import db from "@/lib/db";
import getSession from "@/lib/seeeion";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";
import { getCloudflareUploadUrl } from "@/lib/actions/image-upload";

async function getUploadUrl() {
  return await getCloudflareUploadUrl();
}

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
      try {
        // Cloudflare Images API를 사용하여 이미지 업로드
        const uploadResponse = await getUploadUrl();

        if (uploadResponse.success) {
          const { id, uploadURL } = uploadResponse.result;

          const cloudflareForm = new FormData();
          cloudflareForm.append("file", avatarFile);

          const uploadResult = await fetch(uploadURL, {
            method: "POST",
            body: cloudflareForm,
          });

          if (!uploadResult.ok) {
            throw new Error("이미지 업로드에 실패했습니다.");
          }

          // Cloudflare Images URL 형식
          const avatarUrl = `https://imagedelivery.net/yaj69MDVrIu8_HJDUNcGIg/${id}/public`;
          updateData.avater = avatarUrl;
        } else {
          throw new Error("이미지 업로드 URL을 가져오는데 실패했습니다.");
        }
      } catch (error) {
        console.error("아바타 업로드 오류:", error);
        throw new Error("아바타 업로드에 실패했습니다.");
      }
    }

    console.log("Updating user with data:", updateData);

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
