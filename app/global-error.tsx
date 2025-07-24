"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen p-5 text-center">
          <div className="max-w-md mx-auto">
            <h1 className="text-6xl font-bold text-red-500 mb-4">오류</h1>
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              예상치 못한 오류가 발생했습니다
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              {error.message ||
                "서버에서 오류가 발생했습니다. 잠시 후 다시 시도해주세요."}
            </p>
            <div className="flex flex-col gap-4">
              <button
                onClick={reset}
                className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                다시 시도
              </button>
              <Link
                href="/home"
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                홈으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
