"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function NavigationLoading() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    // 페이지 이동 시작 시 로딩 표시
    handleStart();

    // 짧은 지연 후 로딩 완료 (실제 네비게이션 완료를 감지하기 어려우므로)
    const timer = setTimeout(() => {
      handleComplete();
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-orange-500 animate-pulse">
        <div className="h-full bg-orange-400 animate-ping"></div>
      </div>
    </div>
  );
}
