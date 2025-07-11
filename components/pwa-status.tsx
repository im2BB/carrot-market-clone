"use client";

import { useEffect, useState } from "react";
import { WifiIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface PWAStatus {
  isOnline: boolean;
  isStandalone: boolean;
  isInstalled: boolean;
  serviceWorkerReady: boolean;
}

export default function PWAStatus() {
  const [pwaStatus, setPWAStatus] = useState<PWAStatus>({
    isOnline: true,
    isStandalone: false,
    isInstalled: false,
    serviceWorkerReady: false,
  });

  const [showOfflineNotice, setShowOfflineNotice] = useState(false);
  const [showOnlineNotice, setShowOnlineNotice] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    // 초기 상태 설정
    const updateStatus = () => {
      const isOnline = navigator.onLine;
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true;

      setPWAStatus((prev) => ({
        ...prev,
        isOnline,
        isStandalone,
        isInstalled: isStandalone,
      }));
    };

    updateStatus();

    // 네트워크 상태 변경 감지
    const handleOnline = () => {
      setPWAStatus((prev) => ({ ...prev, isOnline: true }));
      setShowOfflineNotice(false);

      // 오프라인 상태였다가 온라인으로 복구된 경우에만 알림 표시
      if (wasOffline) {
        setShowOnlineNotice(true);
        setWasOffline(false);

        // 3초 후 온라인 알림 숨기기
        setTimeout(() => {
          setShowOnlineNotice(false);
        }, 3000);
      }
    };

    const handleOffline = () => {
      setPWAStatus((prev) => ({ ...prev, isOnline: false }));
      setShowOfflineNotice(true);
      setWasOffline(true);
      setShowOnlineNotice(false);

      // 5초 후 오프라인 알림 숨기기
      setTimeout(() => {
        setShowOfflineNotice(false);
      }, 5000);
    };

    // Service Worker 등록 확인
    const checkServiceWorker = async () => {
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            setPWAStatus((prev) => ({ ...prev, serviceWorkerReady: true }));
          }
        } catch (error) {
          console.log("Service Worker 체크 실패:", error);
        }
      }
    };

    checkServiceWorker();

    // 이벤트 리스너 등록
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // 정리
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [wasOffline]);

  // 오프라인 알림
  if (showOfflineNotice) {
    return (
      <div className="fixed top-4 left-4 right-4 bg-red-500 text-white p-3 rounded-lg shadow-lg z-50 animate-slide-down">
        <div className="flex items-center gap-2">
          <ExclamationTriangleIcon className="w-5 h-5" />
          <span className="text-sm font-medium">오프라인 상태입니다</span>
        </div>
      </div>
    );
  }

  // 온라인 복구 알림 (오프라인 상태였을 때만)
  if (showOnlineNotice && pwaStatus.isOnline) {
    return (
      <div className="fixed top-4 left-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg z-50 animate-slide-down">
        <div className="flex items-center gap-2">
          <WifiIcon className="w-5 h-5" />
          <span className="text-sm font-medium">
            온라인 상태로 복구되었습니다
          </span>
        </div>
      </div>
    );
  }

  // 개발 모드에서 PWA 상태 표시 (DEBUG)
  if (process.env.NODE_ENV === "development") {
    return (
      <div className="fixed top-4 right-4 bg-neutral-800 text-white p-2 rounded text-xs z-50">
        <div>Online: {pwaStatus.isOnline ? "✅" : "❌"}</div>
        <div>Standalone: {pwaStatus.isStandalone ? "✅" : "❌"}</div>
        <div>SW Ready: {pwaStatus.serviceWorkerReady ? "✅" : "❌"}</div>
      </div>
    );
  }

  return null;
}
