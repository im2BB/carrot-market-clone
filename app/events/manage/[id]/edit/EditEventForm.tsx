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

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description || "",
    link: event.link || "",
    start_date: new Date(event.start_date).toISOString().slice(0, 16),
    end_date: new Date(event.end_date).toISOString().slice(0, 16),
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState(event.image);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("start_date", formData.start_date);
      formDataToSend.append("end_date", formData.end_date);
      if (formData.link) {
        formDataToSend.append("link", formData.link);
      }
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }
      const result = await updateEvent(event.id, formDataToSend);
      if (result.success) {
        router.push("/admin/events");
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        name="title"
        type="text"
        required
        labelText="이벤트 제목 *"
        value={formData.title}
        onChange={handleInputChange}
        placeholder="이벤트 제목을 입력하세요"
      />
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          이벤트 설명 *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
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
          value={formData.start_date}
          onChange={handleInputChange}
        />
        <Input
          name="end_date"
          type="datetime-local"
          required
          labelText="종료일 *"
          value={formData.end_date}
          onChange={handleInputChange}
        />
      </div>
      <Input
        name="link"
        type="url"
        labelText="링크 (선택사항)"
        value={formData.link}
        onChange={handleInputChange}
        placeholder="https://example.com"
      />
      <div>
        <label htmlFor="image" className="block text-sm font-medium mb-2">
          이벤트 이미지
        </label>
        <div className="space-y-4">
          <div className="relative w-full aspect-video border-2 border-dashed border-neutral-600 rounded-lg overflow-hidden">
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
