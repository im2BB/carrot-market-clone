"use client";

import { toggleSoldStatus } from "./action";
import { useState } from "react";

interface ToggleSoldButtonProps {
  productId: number;
  isSold: boolean;
}

export default function ToggleSoldButton({
  productId,
  isSold,
}: ToggleSoldButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await toggleSoldStatus(productId);
      if (!result.success) {
        alert(result.error || "판매 상태 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("판매 상태 변경 오류:", error);
      alert("판매 상태 변경 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        isSold
          ? "bg-green-500 hover:bg-green-600 text-white"
          : "bg-red-500 hover:bg-red-600 text-white"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoading ? "처리 중..." : isSold ? "판매 취소" : "판매 완료"}
    </button>
  );
}
