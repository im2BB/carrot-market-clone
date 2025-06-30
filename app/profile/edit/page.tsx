import db from "@/lib/db";
import getSession from "@/lib/seeeion";
import { redirect } from "next/navigation";
import EditProfileClient from "./client";

export default async function EditProfilePage() {
  const session = await getSession();
  if (!session.id) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { id: session.id },
    select: { id: true, username: true, email: true, avater: true },
  });

  if (!user) {
    redirect("/login");
  }
  const userForClient = {
    id: user.id,
    username: user.username,
    email: user.email || "",
    avatar: user.avater, // Convert avater to avatar for client component
  };

  return <EditProfileClient user={userForClient} />;
}
