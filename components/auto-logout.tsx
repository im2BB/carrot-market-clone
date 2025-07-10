"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function AutoLogout() {
  const isLoggingOut = useRef(false);
  const inactivityTimer = useRef<NodeJS.Timeout>();
  const router = useRouter();

  // 30분 (1800000ms) 후 비활성으로 간주
  const INACTIVITY_TIME = 30 * 60 * 1000;

  useEffect(() => {
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

    const handleBeforeUnload = () => {
      performLogout();
    };

    const handlePageHide = () => {
      performLogout();
    };

    let isPageVisible = true;
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        isPageVisible = true;
        isLoggingOut.current = false;
        resetInactivityTimer(); // 페이지가 다시 보이면 타이머 리셋
      } else {
        isPageVisible = false;
        // 5초 후에도 페이지가 보이지 않으면 로그아웃
        setTimeout(() => {
          if (!isPageVisible) {
            performLogout();
          }
        }, 5000);
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

    // 이벤트 리스너 등록
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 사용자 활동 감지 이벤트 등록
    activityEvents.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    // 초기 타이머 설정
    resetInactivityTimer();

    // 정리 함수
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      activityEvents.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });

      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, [router]);

  return null;
}
