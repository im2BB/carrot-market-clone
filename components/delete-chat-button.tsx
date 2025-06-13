"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { deleteChatRoom } from "@/app/(tabs)/chat/actions";
import { useState } from "react";

interface DeleteChatButtonProps {
  chatRoomId: string;
}

export default function DeleteChatButton({
  chatRoomId,
}: DeleteChatButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDeleting) return;

    if (
      confirm("채팅방을 삭제하시겠습니까?\n모든 대화 내용이 함께 삭제됩니다.")
    ) {
      setIsDeleting(true);
      try {
        const result = await deleteChatRoom(chatRoomId);
        if (!result.success) {
          alert("채팅방 삭제에 실패했습니다.");
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
      className="p-2 text-neutral-500 hover:text-red-500 transition-colors disabled:opacity-50"
    >
      <TrashIcon className="w-5 h-5" />
    </button>
  );
}
