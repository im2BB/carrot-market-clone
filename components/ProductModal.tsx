"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CloseButton from "./closeButton";

export default function ProductModal({ id, onClose }: { id: number, onClose: () => void }) {
  const router = useRouter();

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/products/${id}`);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg relative cursor-pointer" onClick={handleModalClick}>
        <CloseButton onCloseClick={onClose} />
        <div className="w-64 h-64 bg-neutral-200 flex items-center justify-center mb-4">상품 ID: {id}</div>
        <h2 className="text-2xl font-bold mb-2">상품 정보는 추후 구현</h2>
      </div>
    </div>
  );
} 