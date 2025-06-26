"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteMyPost } from "./action";
import { useState } from "react";

interface DeletePostButtonProps {
  postId: number;
}

export default function DeletePostButton({ postId }: DeletePostButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDeleting) return;

    if (
      confirm(
        "이 게시글을 삭제하시겠습니까?\n삭제된 게시글은 복구할 수 없습니다."
      )
    ) {
      setIsDeleting(true);
      try {
        const result = await deleteMyPost(postId);
        if (!result.success) {
          alert(result.error || "게시글 삭제에 실패했습니다.");
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
