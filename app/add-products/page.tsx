"use client";

import Button from "@/components/button";
import Input from "@/components/Input";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useActionState } from "react";
import { getUploadUrl, uploadProduct } from "./actions";
import BackButton from "@/components/back-button";

interface PhotoData {
  id: string;
  url: string;
  preview: string;
  uploadURL: string;
  file: File;
}

interface FormState {
  fieldErrors?: {
    title?: string[];
    price?: string[];
    description?: string[];
  };
  fieldValues?: {
    description?: string;
  };
}

export default function AddProduct() {
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [representativeIndex, setRepresentativeIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) {
      return;
    }

    // 최대 5장 제한
    if (photos.length + files.length > 5) {
      alert("최대 5장까지만 업로드할 수 있습니다.");
      return;
    }

    setIsUploading(true);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // 이미지 파일 체크
        if (!file.type.startsWith("image/")) {
          alert("이미지 파일만 업로드할 수 있습니다.");
          continue;
        }

        // 6MB 크기 제한
        const maxSize = 6 * 1024 * 1024; // 6MB
        if (file.size > maxSize) {
          alert("이미지 크기는 6MB를 넘을 수 없습니다.");
          continue;
        }

        const preview = URL.createObjectURL(file);
        const { success, result } = await getUploadUrl();

        if (success) {
          const { id, uploadURL } = result;
          const photoUrl = `https://imagedelivery.net/yaj69MDVrIu8_HJDUNcGIg/${id}`;

          setPhotos((prev) => [
            ...prev,
            {
              id,
              url: photoUrl,
              preview,
              uploadURL,
              file,
            },
          ]);
        }
      }
    } catch (error) {
      console.error("이미지 업로드 중 오류:", error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => {
      const newPhotos = prev.filter((_, i) => i !== index);
      // 대표 이미지 인덱스 조정
      if (representativeIndex >= newPhotos.length) {
        setRepresentativeIndex(Math.max(0, newPhotos.length - 1));
      }
      return newPhotos;
    });
  };

  const setRepresentative = (index: number) => {
    setRepresentativeIndex(index);
  };

  const interceptAction = async (_: unknown, formData: FormData) => {
    if (photos.length === 0) {
      alert("최소 1장의 사진을 업로드해주세요.");
      return;
    }

    // 모든 이미지를 Cloudflare에 업로드
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      const cloudflareForm = new FormData();
      cloudflareForm.append("file", photo.file);

      const response = await fetch(photo.uploadURL, {
        method: "post",
        body: cloudflareForm,
      });

      if (response.status !== 200) {
        alert("이미지 업로드에 실패했습니다.");
        return;
      }
    }

    // FormData에 모든 이미지 URL 추가
    photos.forEach((photo) => {
      formData.append("photos", photo.url);
    });

    formData.append("representativePhotoIndex", representativeIndex.toString());

    return uploadProduct(_, formData);
  };

  const [state, action] = useActionState(interceptAction, null);

  // 엔터키로 submit 방지
  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (
      e.key === "Enter" &&
      e.target instanceof HTMLTextAreaElement === false
    ) {
      e.preventDefault();
    }
  };

  // 저장하기 버튼 클릭 시 확인창
  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!window.confirm("저장하시겠습니까?")) {
      e.preventDefault();
    }
  };

  return (
    <div>
      <form
        action={action}
        className="flex flex-col gap-5 p-5"
        onKeyDown={handleFormKeyDown}
      >
        {/* 이미지 업로드 영역 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-black dark:text-white">
              상품 이미지
            </h3>
            <span className="text-sm text-gray-500 dark:text-neutral-400">
              {photos.length}/5
            </span>
          </div>

          {/* 이미지 업로드 버튼(label) 내부에 대표 이미지 미리보기 */}
          <label
            htmlFor="photo"
            className="border-2 aspect-square flex items-center 
            justify-center flex-col text-neutral-300 border-neutral-300 
            rounded-md border-dashed cursor-pointer bg-center bg-cover hover:border-orange-400 transition-colors w-150 h-150 mx-auto relative"
            style={photos.length > 0 ? { padding: 0 } : {}}
          >
            {photos.length === 0 ? (
              <>
                <PhotoIcon className="w-12" />
                <div className="text-gray-500 dark:text-neutral-400 text-sm text-center">
                  사진을 추가해주세요
                  <br />
                  <span className="text-xs">최대 5장까지</span>
                </div>
              </>
            ) : (
              <>
                <img
                  src={photos[representativeIndex].preview}
                  alt="대표 이미지 미리보기"
                  className="object-contain w-full h-full rounded-md"
                />
                <div className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
                  대표 미리보기
                </div>
              </>
            )}
          </label>

          <input
            onChange={onImageChange}
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            multiple
            className="hidden"
            disabled={isUploading}
          />

          {/* 썸네일 리스트 (가로 스크롤) */}
          {photos.length > 0 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  className="relative w-20 h-20 flex-shrink-0"
                >
                  <img
                    src={photo.preview}
                    alt={`썸네일 ${index + 1}`}
                    className={`object-cover w-full h-full rounded-lg border-2 cursor-pointer transition-all ${
                      representativeIndex === index
                        ? "border-orange-500"
                        : "border-neutral-400"
                    }`}
                    onClick={() => setRepresentative(index)}
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(index);
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors z-10"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {photos.length > 0 && (
            <p className="text-xs text-gray-500 dark:text-neutral-400">
              💡 아래 썸네일을 클릭하면 대표 이미지가 변경됩니다
            </p>
          )}
        </div>

        {/* 이하 기존 입력 폼 유지 */}
        <Input
          name="title"
          required
          placeholder="제목을 입력해주세요"
          type="text"
          errors={(state as FormState)?.fieldErrors?.title}
        />
        <Input
          name="price"
          required
          placeholder="가격을 입력해주세요"
          type="number"
          errors={(state as FormState)?.fieldErrors?.price}
        />
        {/* 설명 입력란 textarea로 대체 */}
        <div>
          <textarea
            name="description"
            required
            placeholder="설명을 입력해주세요"
            className="bg-white dark:bg-transparent rounded-md w-full h-40 md:h-60 foucus:outline-none ring-2 focus:ring-4 transition ring-gray-300 dark:ring-neutral-200 focus:ring-orange-500 border border-gray-300 dark:border-none placeholder:text-gray-500 dark:placeholder:text-neutral-400 p-3 text-black dark:text-white resize-vertical"
            defaultValue={(state as FormState)?.fieldValues?.description || ""}
          />
          {(state as FormState)?.fieldErrors?.description && (
            <div className="text-red-500 text-xs mt-1">
              {(state as FormState).fieldErrors!.description}
            </div>
          )}
        </div>
        <Button
          text={isUploading ? "업로드 중..." : "저장하기"}
          disabled={isUploading}
          onClick={handleSaveClick}
        />
      </form>
      <BackButton />
    </div>
  );
}
