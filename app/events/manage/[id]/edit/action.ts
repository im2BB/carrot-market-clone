"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";
import { uploadImageToCloudflare } from "@/lib/actions/image-upload";

export async function updateEvent(eventId: number, formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const link = formData.get("link") as string;
    const start_date = formData.get("start_date") as string;
    const end_date = formData.get("end_date") as string;
    const imageFile = formData.get("image") as File | null;

    if (!title || !description || !start_date || !end_date) {
      return {
        success: false,
        error: "제목, 설명, 시작일, 종료일은 필수입니다.",
      };
    }

    // 날짜 검증
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    if (endDate <= startDate) {
      return { success: false, error: "종료일은 시작일보다 늦어야 합니다." };
    }

    let imageUrl = null;

    // 새 이미지가 업로드된 경우에만 처리
    if (imageFile && imageFile.size > 0) {
      const uploadResult = await uploadImageToCloudflare(imageFile);
      if (uploadResult.success) {
        imageUrl = uploadResult.imageUrl;
      } else {
        return { success: false, error: uploadResult.error };
      }
    }

    // 이벤트 업데이트
    const updateData: any = {
      title,
      description,
      link: link || null,
      start_date: startDate,
      end_date: endDate,
    };

    // 새 이미지가 있는 경우에만 이미지 URL 업데이트
    if (imageUrl) {
      updateData.image = imageUrl;
    }

    await db.event.update({
      where: { id: eventId },
      data: updateData,
    });

    revalidatePath("/admin/events");
    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("이벤트 수정 오류:", error);
    return { success: false, error: "이벤트 수정에 실패했습니다." };
  }
}
