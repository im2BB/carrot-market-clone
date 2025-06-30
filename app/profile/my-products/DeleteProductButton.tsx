"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteMyProduct } from "./action";
import { useState } from "react";

interface DeleteProductButtonProps {
  productId: number;
}

export default function DeleteProductButton({
  productId,
}: DeleteProductButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDeleting) return;

    if (
      confirm("이 상품을 삭제하시겠습니까?\n삭제된 상품은 복구할 수 없습니다.")
    ) {
      setIsDeleting(true);
      try {
        const result = await deleteMyProduct(productId);
        if (!result.success) {
          alert(result.error || "상품 삭제에 실패했습니다.");
        } else {
          // 페이지 새로고침
          window.location.reload();
        }
      } catch (error) {
        alert("오류가 발생했습니다.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
    >
      삭제
    </button>
  );
}
