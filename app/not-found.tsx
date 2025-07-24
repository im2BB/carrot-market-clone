import Link from "next/link";
import BackButton from "@/components/back-button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-5 text-center">
      <div className="max-w-md mx-auto">
        <h1 className="text-6xl font-bold text-orange-500 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <div className="flex flex-col gap-4">
          <Link
            href="/life"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            커뮤니티로 돌아가기
          </Link>
          <Link
            href="/home"
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
        <div className="mt-8">
          <BackButton />
        </div>
      </div>
    </div>
  );
}
