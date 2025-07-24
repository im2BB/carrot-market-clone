"use server";

import db from "@/lib/db";
import getSession from "@/lib/session";

import { redirect } from "next/navigation";

export async function GetcreatePost(formData: FormData) {
  const session = await getSession();
  if (!session.id) {
    redirect("/create-account");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const isNotice = formData.get("isNotice") === "true";

  // 공지사항은 관리자만 작성 가능
  if (isNotice && session.role !== "ADMIN") {
    throw new Error("공지사항은 관리자만 작성할 수 있습니다.");
  }

  await db.post.create({
    data: {
      title,
      description,
      isNotice,
      userId: session.id,
    },
  });

  redirect("/life");
}
