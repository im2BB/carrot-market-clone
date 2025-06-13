import db from "@/lib/db";
import getSession from "@/lib/seeeion";
import { notFound, redirect } from "next/navigation";
import { resolve } from "path";
import { Suspense } from "react";

async function getUser() {
  const session = await getSession();
  if (session.id) {
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
    });
    if (user) {
      return user;
    }
  }
  notFound();
}

async function Username() {
  await new Promise((resolve) => setTimeout(resolve, 10000));
  const user = await getUser();
  return <h1>환영 합니다 {user?.username}님</h1>;
}

export default async function Profile() {
  const user = await getUser();
  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };
  return (
    <div>
      <Suspense fallback={"안녕하세요!"}>
        <Username />
      </Suspense>
      {/* ssr중 아직 완료 되지 않았다면 보여주는것 */}
      <form action={logOut}>
        <button>로그 아웃</button>
      </form>
    </div>
  );
}
