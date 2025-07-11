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

  await db.post.create({
    data: {
      title,
      description,
      userId: session.id,
    },
  });

  redirect("/life");
}
