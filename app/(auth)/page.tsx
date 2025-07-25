import Link from "next/link";
import Image from "next/image";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

export default async function Home() {
  // 세션 체크를 일시적으로 비활성화
  // try {
  //   const session = await getSession();
  //   console.log("Session check:", session.id ? "User logged in" : "No user");

  //   if (session.id) {
  //     redirect("/home");
  //   }
  // } catch (error) {
  //   console.error("Session error:", error);
  //   // 세션 오류가 발생해도 페이지는 표시
  // }

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
        <div className="flex gap-2 text-black dark:text-white">
          <span>이미 계정이 있으신가요?</span>
          <Link href="/login" className="hover:underline text-orange-500">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
