"use client";

import { useState, useOptimistic, startTransition } from "react";
import Image from "next/image";
import { formatToTimeAgo } from "@/lib/utils";
import { UserIcon, TrashIcon } from "@heroicons/react/24/outline";
import { createComment, deleteComment } from "@/app/posts/[id]/action";

interface Comment {
  id: number;
  payload: string;
  created_at: Date;
  user: {
    id: number;
    username: string;
    avater: string | null;
  };
}

interface CommentListProps {
  initialComments: Comment[];
  postId: number;
  currentUserId: number | undefined;
}

export default function CommentList({
  initialComments,
  postId,
  currentUserId,
}: CommentListProps) {
  const [comments, setComments] = useOptimistic(
    initialComments,
    (
      state,
      action: { type: string; comment?: Comment; commentId?: number }
    ) => {
      switch (action.type) {
        case "add":
          return action.comment ? [action.comment, ...state] : state;
        case "delete":
          return state.filter((comment) => comment.id !== action.commentId);
        default:
          return state;
      }
    }
  );

  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);

    // 낙관적 업데이트를 startTransition으로 감싸기
    const optimisticComment: Comment = {
      id: Date.now(), // 임시 ID
      payload: newComment.trim(),
      created_at: new Date(),
      user: {
        id: currentUserId || 0,
        username: "나",
        avater: null,
      },
    };

    startTransition(() => {
      setComments({ type: "add", comment: optimisticComment });
    });

    setNewComment("");

    try {
      const result = await createComment(postId, newComment);
      if (result.error) {
        // 에러 시 롤백
        startTransition(() => {
          setComments({ type: "delete", commentId: optimisticComment.id });
        });
        alert(result.error);
      }
    } catch (error) {
      // 에러 시 롤백
      startTransition(() => {
        setComments({ type: "delete", commentId: optimisticComment.id });
      });
      console.error("댓글 작성 오류:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;

    // 낙관적 업데이트를 startTransition으로 감싸기
    startTransition(() => {
      setComments({ type: "delete", commentId });
    });

    try {
      const result = await deleteComment(commentId);
      if (result.error) {
        alert(result.error);
        // 에러시에는 페이지 새로고침으로 원래 상태 복구
        window.location.reload();
      }
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
      // 에러시에는 페이지 새로고침으로 원래 상태 복구
      window.location.reload();
    }
  };

  return (
    <div className="mt-8 border-t border-neutral-700 pt-6">
      <h3 className="text-lg font-semibold mb-4">댓글 {comments.length}개</h3>

      {/* 댓글 작성 폼 */}
      {currentUserId && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="댓글을 입력하세요..."
              className="flex-1 bg-neutral-800 border border-neutral-600 rounded-lg p-3 text-white placeholder-neutral-400 resize-none min-h-[80px] focus:outline-none focus:border-orange-500"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="self-end bg-orange-500 hover:bg-orange-600 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              {isSubmitting ? "작성중..." : "작성"}
            </button>
          </div>
        </form>
      )}

      {/* 댓글 목록 */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-neutral-400 text-center py-8">
            첫 번째 댓글을 작성해보세요!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-3 p-4 bg-neutral-800 rounded-lg"
            >
              <div className="size-8 rounded-full overflow-hidden bg-white flex items-center justify-center flex-shrink-0">
                {comment.user.avater ? (
                  <Image
                    src={comment.user.avater}
                    width={32}
                    height={32}
                    alt={comment.user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-4 h-4 text-gray-600" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">
                      {comment.user.username}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {formatToTimeAgo(comment.created_at.toString())}
                    </span>
                  </div>

                  {currentUserId === comment.user.id && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-neutral-400 hover:text-red-400 transition-colors p-1"
                      title="댓글 삭제"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-white whitespace-pre-wrap">
                  {comment.payload}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
