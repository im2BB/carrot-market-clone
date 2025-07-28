"use client";

import Image from "next/image";
import ThemeToggle from "./theme-toggle";

export default function HomeHeader() {
  return (
    <div className="relative py-8">
      {/* 토글 버튼을 우상단 고정 위치에 배치 */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* 로고를 중앙에 배치 */}
      <div className="flex justify-center items-center">
        <Image
          src="/logo-carrot.png"
          alt="당근마켓 클론 로고"
          width={220}
          height={220}
          priority
        />
      </div>
    </div>
  );
}
