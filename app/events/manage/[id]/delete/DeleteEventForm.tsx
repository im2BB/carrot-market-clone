"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteEvent } from "./action";

interface Event {
  id: number;
  title: string;
  description: string | null;
  image: string;
  link?: string | null;
}

interface DeleteEventFormProps {
  event: Event;
}

export default function DeleteEventForm({ event }: DeleteEventFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setIsLoading(true);
    setError("");

    try {
      const result = await deleteEvent(event.id);

      if (result.success) {
        router.push("/events/manage");
        router.refresh();
      } else {
        setError(result.error || "이벤트 삭제에 실패했습니다.");
      }
    } catch (error) {
      setError("이벤트 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-neutral-800 rounded-lg p-6 border border-red-500/20">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-red-400">
          삭제할 이벤트 정보
        </h2>
        <div className="space-y-3">
          <div>
            <span className="text-neutral-400">제목:</span>
            <p className="text-white font-medium">{event.title}</p>
          </div>
          <div>
            <span className="text-neutral-400">설명:</span>
            <p className="text-white">{event.description}</p>
          </div>
          {event.link && (
            <div>
              <span className="text-neutral-400">링크:</span>
              <p className="text-orange-400">{event.link}</p>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="relative w-64 h-48 border-2 border-red-500/30 rounded-lg overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
        <p className="text-red-400 text-sm">
          ⚠️ 이 작업은 되돌릴 수 없습니다. 이벤트를 삭제하면 모든 데이터가
          영구적으로 제거됩니다.
        </p>
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleDelete}
          disabled={isLoading}
          className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-neutral-600 text-white py-3 rounded-lg font-medium transition-colors"
        >
          {isLoading ? "삭제 중..." : "이벤트 삭제"}
        </button>
        <button
          onClick={() => router.push("/events/manage")}
          className="px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg font-medium transition-colors"
        >
          취소
        </button>
      </div>
    </div>
  );
}
