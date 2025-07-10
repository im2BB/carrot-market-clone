"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AutoLogout() {
  const isLoggingOut = useRef(false);
  const inactivityTimer = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  // 30분 (1800000ms) 후 비활성으로 간주
  const INACTIVITY_TIME = 30 * 60 * 1000;

  // 로그인이 필요한 페이지인지 확인
  const isProtectedPage = () => {
    const publicPages = [
      "/",
      "/login",
      "/create-account",
      "/github/start",
      "/github/complete",
    ];
    return !publicPages.includes(pathname);
  };

  useEffect(() => {
    // 로그인이 필요하지 않은 페이지에서는 AutoLogout 실행하지 않음
    if (!isProtectedPage()) return;

    const performLogout = async () => {
      if (isLoggingOut.current) return;
      isLoggingOut.current = true;

      try {
        await fetch("/api/logout", {
          method: "POST",
          keepalive: true,
        });

        // 로그아웃 후 로그인 페이지로 리다이렉트
        router.push("/login");
      } catch (error) {
        console.error("Auto logout failed:", error);
      }
    };

    const resetInactivityTimer = () => {
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }

      inactivityTimer.current = setTimeout(() => {
        performLogout();
      }, INACTIVITY_TIME);
    };

    const handleActivity = () => {
      if (!isLoggingOut.current) {
        resetInactivityTimer();
      }
    };

    // 탭이 숨겨진 시간을 추적
    let hideStartTime: number | null = null;
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        hideStartTime = null;
        isLoggingOut.current = false;
        resetInactivityTimer();
      } else {
        hideStartTime = Date.now();
        // 30분 이상 탭이 숨겨져 있으면 로그아웃
        setTimeout(() => {
          if (hideStartTime && Date.now() - hideStartTime >= INACTIVITY_TIME) {
            performLogout();
          }
        }, INACTIVITY_TIME);
      }
    };

    // 사용자 활동 감지 이벤트들
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];

    // 이벤트 리스너 등록 (beforeunload, pagehide 제거)
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 사용자 활동 감지 이벤트 등록
    activityEvents.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    // 초기 타이머 설정
    resetInactivityTimer();

    // 정리 함수
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      activityEvents.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });

      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, [router, pathname]);

  return null;
}
