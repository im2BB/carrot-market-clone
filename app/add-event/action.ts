"use server";

import { z } from "zod";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { getCloudflareUploadUrl } from "@/lib/actions/image-upload";
import { redirect } from "next/navigation";

const eventSchema = z
  .object({
    image: z.string({
      required_error: "이미지를 업로드해주세요.",
    }),
    title: z.string({
      required_error: "제목을 입력해주세요.",
    }),
    description: z.string().optional(),
    link: z.string().url().optional().or(z.literal("")),
    start_date: z.string({
      required_error: "시작일을 입력해주세요.",
    }),
    end_date: z.string({
      required_error: "종료일을 입력해주세요.",
    }),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      return endDate > startDate;
    },
    {
      message: "종료일은 시작일보다 늦어야 합니다.",
      path: ["end_date"],
    }
  );

export async function createEvent(_: any, formData: FormData) {
  try {
    const data = {
      image: formData.get("image"),
      title: formData.get("title"),
      description: formData.get("description"),
      link: formData.get("link") || "",
      start_date: formData.get("start_date"),
      end_date: formData.get("end_date"),
    };

    console.log("Received event data:", data);

    const result = eventSchema.safeParse(data);
    if (!result.success) {
      console.log("Validation error:", result.error.flatten());
      return result.error.flatten();
    }

    const session = await getSession();
    if (!session.id) {
      return { error: "로그인이 필요합니다." };
    }

    console.log("Creating event with data:", result.data);

    const event = await db.event.create({
      data: {
        title: result.data.title,
        description: result.data.description || "",
        image: result.data.image,
        link: result.data.link || null,
        start_date: new Date(result.data.start_date),
        end_date: new Date(result.data.end_date),
        userId: session.id,
      },
    });

    console.log("Event created successfully:", event);

    // 클라이언트에서 리다이렉트를 처리하므로 성공 상태 반환
    return { success: true, event };
  } catch (error) {
    console.error("이벤트 생성 에러:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Stack trace:", error.stack);
    }
    return { error: "이벤트 등록에 실패했습니다." };
  }
}

export async function getUploadUrl() {
  return await getCloudflareUploadUrl();
}
