"use client";

import { UserIcon } from "@heroicons/react/24/outline";

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
      className="flex items-center justify-between p-3 transition-colors hover:bg-neutral-800 rounded-lg w-full text-left"
    >
      <span>로그아웃</span>
      <UserIcon className="size-5 text-gray-400" />
    </button>
  );
}
