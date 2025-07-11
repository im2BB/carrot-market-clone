"use client";

import { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // iOS 및 standalone 모드 감지
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const standalone = window.matchMedia("(display-mode: standalone)").matches;

    setIsIOS(iOS);
    setIsStandalone(standalone);

    // PWA 설치 프롬프트 이벤트 리스너
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // 이미 설치했거나 standalone 모드라면 프롬프트 표시 안함
      if (!standalone) {
        setShowInstallPrompt(true);
      }
    };

    // 앱이 설치된 후 이벤트
    const handleAppInstalled = () => {
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setShowInstallPrompt(false);
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // 하루 동안 다시 보지 않기
    localStorage.setItem("installPromptDismissed", new Date().toISOString());
  };

  // 이미 설치되었거나 standalone 모드라면 보이지 않음
  if (isStandalone || !showInstallPrompt) {
    return null;
  }

  // iOS 사용자를 위한 안내
  if (isIOS) {
    return (
      <div className="fixed bottom-20 left-4 right-4 bg-orange-500 text-white p-4 rounded-lg shadow-lg z-50">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-sm mb-1">앱으로 설치하기</h3>
            <p className="text-xs opacity-90">
              Safari에서 <strong>공유 버튼</strong>을 누르고{" "}
              <strong>"홈 화면에 추가"</strong>를 선택하여 앱을 설치하세요.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="ml-2 p-1 rounded-full hover:bg-orange-600 transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Android/Desktop 사용자를 위한 설치 버튼
  return (
    <div className="fixed bottom-20 left-4 right-4 bg-orange-500 text-white p-4 rounded-lg shadow-lg z-50">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="font-bold text-sm mb-1">앱으로 설치하기</h3>
          <p className="text-xs opacity-90">
            당근당근을 홈 화면에 추가하여 더 빠르게 이용하세요!
          </p>
        </div>
        <div className="flex items-center gap-2 ml-2">
          <button
            onClick={handleInstallClick}
            className="bg-white text-orange-500 px-3 py-1 rounded-md text-sm font-medium hover:bg-orange-50 transition-colors"
          >
            설치
          </button>
          <button
            onClick={handleDismiss}
            className="p-1 rounded-full hover:bg-orange-600 transition-colors"
          >
            <XMarkIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
