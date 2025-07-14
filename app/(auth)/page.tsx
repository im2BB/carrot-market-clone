import Link from "next/link";
import Image from "next/image";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();

  if (session.id) {
    redirect("/home");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="my-auto flex flex-col items-center gap-2 *:font-medium">
        <Image
          src="/logo-carrot.png"
          alt="당근마켓 클론 로고"
          width={500}
          height={500}
          priority
          className="mb-4"
        />
      </div>
      <div className="flex flex-col items-center gap-3 w-full">
        <Link href="/create-account" className="primary-btn py-2.5 text-lg ">
          시작하기
        </Link>
        <div className="flex gap-2">
          <span>이미 계정이 있으신가요?</span>
          <Link href="/login" className="hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
