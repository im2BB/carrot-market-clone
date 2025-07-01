"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateEvent } from "./action";
import Input from "@/components/Input";
import Image from "next/image";

interface Event {
  id: number;
  title: string;
  description: string | null;
  image: string;
  link?: string | null;
  start_date: Date;
  end_date: Date;
}

interface EditEventFormProps {
  event: Event;
}

export default function EditEventForm({ event }: EditEventFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description || "");
  const [link, setLink] = useState(event.link || "");
  const [startDate, setStartDate] = useState(
    new Date(event.start_date).toISOString().slice(0, 16)
  );
  const [endDate, setEndDate] = useState(
    new Date(event.end_date).toISOString().slice(0, 16)
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState(event.image);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", title);
      formDataToSend.append("description", description);
      formDataToSend.append("start_date", startDate);
      formDataToSend.append("end_date", endDate);
      if (link) {
        formDataToSend.append("link", link);
      }
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }
      const result = await updateEvent(event.id, formDataToSend);
      if (result.success) {
        router.push("/events/manage");
        router.refresh();
      } else {
        console.error(result.error || "이벤트 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("이벤트 수정 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmitForm} className="space-y-6">
      <Input
        name="title"
        type="text"
        required
        labelText="이벤트 제목 *"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="이벤트 제목을 입력하세요"
      />
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          이벤트 설명 *
        </label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          placeholder="이벤트 설명을 입력하세요"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          name="start_date"
          type="datetime-local"
          required
          labelText="시작일 *"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          name="end_date"
          type="datetime-local"
          required
          labelText="종료일 *"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <Input
        name="link"
        type="url"
        labelText="링크 (선택사항)"
        value={link}
        onChange={(e) => setLink(e.target.value)}
        placeholder="https://example.com"
      />
      <div>
        <label htmlFor="image" className="block text-sm font-medium mb-2">
          이벤트 이미지
        </label>
        <div className="space-y-4">
          <div className="relative w-64 h-48 border-2 border-dashed border-neutral-600 rounded-lg overflow-hidden">
            {previewImage && (
              <Image
                src={previewImage}
                alt="Event preview"
                width={400}
                height={400}
                className="w-full h-full object-cover"
                unoptimized={previewImage.includes("imagedelivery.net")}
              />
            )}
          </div>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <p className="text-sm text-neutral-400">
            새 이미지를 선택하지 않으면 기존 이미지가 유지됩니다.
          </p>
        </div>
      </div>
      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:bg-neutral-600 text-white py-3 rounded-lg font-medium transition-colors"
        >
          {isLoading ? "수정 중..." : "이벤트 수정"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/events/manage")}
          className="px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg font-medium transition-colors"
        >
          취소
        </button>
      </div>
    </form>
  );
}
