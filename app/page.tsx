"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // 쿠키 확인
    const cookies = document.cookie.split(";");
    const sessionCookie = cookies.find((cookie) =>
      cookie.trim().startsWith("delicious-karrot=")
    );

    if (sessionCookie) {
      // 로그인된 사용자는 home으로
      router.push("/home");
    } else {
      // 로그인되지 않은 사용자는 login으로
      router.push("/login");
    }
  }, [router]);

  // 로딩 중 표시
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="text-6xl mb-4">🥕</div>
        <div className="text-xl">로딩 중...</div>
      </div>
    </div>
  );
}
