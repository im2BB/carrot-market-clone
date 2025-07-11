"use client";

import { useEffect, useState } from "react";
import { WifiIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function OfflinePage() {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    window.location.reload();
  };

  useEffect(() => {
    // 네트워크 상태 변경 감지
    const handleOnline = () => {
      window.location.reload();
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-neutral-900 text-white">
      <div className="text-center max-w-md">
        {/* 오프라인 아이콘 */}
        <div className="w-24 h-24 mx-auto mb-6 bg-neutral-800 rounded-full flex items-center justify-center">
          <WifiIcon className="w-12 h-12 text-gray-400" />
        </div>

        {/* 당근 이모지 */}
        <div className="text-6xl mb-4">🥕</div>

        {/* 제목 */}
        <h1 className="text-2xl font-bold mb-2">연결이 끊어졌어요</h1>

        {/* 설명 */}
        <p className="text-gray-400 mb-6 leading-relaxed">
          인터넷 연결을 확인하고 다시 시도해주세요.
          <br />
          일부 기능은 오프라인에서도 사용할 수 있습니다.
        </p>

        {/* 재시도 버튼 */}
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <ArrowPathIcon
            className={`w-5 h-5 ${isRetrying ? "animate-spin" : ""}`}
          />
          {isRetrying ? "재시도 중..." : "다시 시도"}
        </button>

        {/* 오프라인 기능 안내 */}
        <div className="mt-8 p-4 bg-neutral-800 rounded-lg">
          <h3 className="font-semibold mb-2">오프라인에서도 가능한 기능</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>• 이전에 본 상품 정보 확인</li>
            <li>• 저장된 채팅 기록 보기</li>
            <li>• 프로필 정보 확인</li>
          </ul>
        </div>

        {/* 네트워크 상태 */}
        <div className="mt-6 text-sm text-gray-500">
          <p>
            네트워크 상태:
            <span className="ml-1 text-red-400">오프라인</span>
          </p>
        </div>
      </div>
    </div>
  );
}
