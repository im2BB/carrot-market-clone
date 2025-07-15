"use client";

import {
  ArrowRightOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        window.location.href = "/";
      } else {
        alert("로그아웃에 실패했습니다.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center justify-between p-3 transition-colors hover:bg-orange-400 rounded-lg w-full text-left text-black dark:text-white group"
    >
      <span className="group-hover:text-white transition-colors">로그아웃</span>
      <ArrowRightOnRectangleIcon className="size-5 text-gray-500 dark:text-gray-400 group-hover:text-white transition-colors" />
    </button>
  );
}
