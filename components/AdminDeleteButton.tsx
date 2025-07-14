"use client";

import { useState } from "react";
import DeleteConfirmModal from "./DeleteConfirmModal";

interface AdminDeleteButtonProps {
  postId: number;
  title: string;
  isDesktop?: boolean;
}

export default function AdminDeleteButton({
  postId,
  title,
  isDesktop = true,
}: AdminDeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const formData = new FormData();
      formData.append("postId", postId.toString());

      const response = await fetch("/api/admin/delete-post", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        window.location.href = "/admin/posts?success=post_deleted";
      } else {
        window.location.href = "/admin/posts?error=delete_failed";
      }
    } catch (error) {
      console.error("삭제 오류:", error);
      window.location.href = "/admin/posts?error=delete_failed";
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DeleteConfirmModal
      title="게시글 삭제 확인"
      description={`"${title}" 게시글을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
      onConfirm={handleDelete}
    >
      <button
        disabled={isDeleting}
        className={
          isDesktop
            ? "text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
            : "px-3 py-1 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded transition-colors disabled:opacity-50"
        }
      >
        {isDeleting ? "삭제 중..." : "삭제"}
      </button>
    </DeleteConfirmModal>
  );
}
