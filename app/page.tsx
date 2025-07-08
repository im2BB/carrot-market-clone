import Link from "next/link";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const session = cookieStore.get("delicious-karrot");

  if (session?.value) {
    // 로그인된 사용자는 홈으로 이동할 수 있는 버튼만 보여줌
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="my-auto flex flex-col items-center gap-2 *:font-medium">
          <span className="text-9xl">🥕</span>
          <h1 className="text-4xl pt-4">당근</h1>
          <h2 className="text-2xl">어서오세요!</h2>
        </div>
        <div className="flex flex-col items-center gap-3 w-full">
          <Link href="/home" className="primary-btn py-2.5 text-lg ">
            홈으로 이동
          </Link>
        </div>
      </div>
    );
  }
  // 로그인하지 않은 사용자는 기존 화면
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="my-auto flex flex-col items-center gap-2 *:font-medium">
        <span className="text-9xl">🥕</span>
        <h1 className="text-4xl pt-4">당근</h1>
        <h2 className="text-2xl">당근 클론입니다</h2>
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
