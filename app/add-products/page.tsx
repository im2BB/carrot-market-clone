"use client";

import Button from "@/components/button";
import Input from "@/components/Input";
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useActionState } from "react";
import {
  getUploadUrl,
  uploadProduct,
  uploadProductWithoutImage,
} from "./actions";
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
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [useImageUpload, setUseImageUpload] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setUploadError(null);

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
        console.log("Cloudflare 업로드 URL 요청 중...");
        const uploadResult = await getUploadUrl();

        if (uploadResult.success && uploadResult.result) {
          const { id, uploadURL } = uploadResult.result;
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
          console.log("이미지 업로드 URL 생성 성공:", id);
        } else {
          const errorMessage =
            uploadResult.error ||
            "이미지 업로드 URL을 가져오는데 실패했습니다.";
          setUploadError(errorMessage);
          alert(errorMessage);
          console.error("이미지 업로드 URL 생성 실패:", uploadResult.error);
          break;
        }
      }
    } catch (error) {
      console.error("이미지 업로드 중 오류:", error);
      const errorMessage = "이미지 업로드 중 오류가 발생했습니다.";
      setUploadError(errorMessage);
      alert(errorMessage);
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
    try {
      setIsSubmitting(true);
      console.log("상품 등록 시작");

      if (useImageUpload && photos.length === 0) {
        alert("최소 1장의 사진을 업로드해주세요.");
        return;
      }

      if (useImageUpload) {
        console.log("이미지 업로드 모드로 진행");
        // 모든 이미지를 Cloudflare에 업로드
        for (let i = 0; i < photos.length; i++) {
          const photo = photos[i];
          const cloudflareForm = new FormData();
          cloudflareForm.append("file", photo.file);

          try {
            console.log(`이미지 ${i + 1} 업로드 중:`, photo.id);
            const response = await fetch(photo.uploadURL, {
              method: "post",
              body: cloudflareForm,
            });

            if (response.status !== 200) {
              const errorText = await response.text();
              console.error(
                "Cloudflare 업로드 실패:",
                response.status,
                errorText
              );
              alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
              return;
            }
            console.log(`이미지 ${i + 1} 업로드 성공`);
          } catch (error) {
            console.error("이미지 업로드 중 네트워크 오류:", error);
            alert(
              "이미지 업로드 중 네트워크 오류가 발생했습니다. 다시 시도해주세요."
            );
            return;
          }
        }

        // FormData에 모든 이미지 URL 추가
        photos.forEach((photo) => {
          formData.append("photos", photo.url);
        });

        formData.append(
          "representativePhotoIndex",
          representativeIndex.toString()
        );

        console.log("이미지 업로드 완료, 상품 등록 진행");
        return uploadProduct(_, formData);
      } else {
        console.log("이미지 없이 상품 등록 진행");
        // 이미지 없이 상품 등록
        return uploadProductWithoutImage(_, formData);
      }
    } catch (error) {
      console.error("상품 등록 중 오류:", error);
      alert("상품 등록 중 오류가 발생했습니다. 다시 시도해주세요.");
      return {
        fieldErrors: {
          title: ["상품 등록 중 오류가 발생했습니다."],
        },
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  const [state, action] = useActionState(interceptAction, null);

  // 저장하기 버튼 클릭 시 확인창
  const handleSaveClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!window.confirm("저장하시겠습니까?")) {
      e.preventDefault();
    }
  };

  return (
    <div className="p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="font-bold text-black dark:text-white">상품 등록</span>
      </div>

      <form
        action={action}
        className="flex flex-col gap-5 p-5 focus:outline-none"
      >
        {/* 이미지 업로드 모드 선택 */}
        <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="uploadMode"
              checked={useImageUpload}
              onChange={() => setUseImageUpload(true)}
              className="text-orange-500"
            />
            <span className="text-sm font-medium">이미지 업로드</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="uploadMode"
              checked={!useImageUpload}
              onChange={() => setUseImageUpload(false)}
              className="text-orange-500"
            />
            <span className="text-sm font-medium">
              이미지 없이 등록 (테스트용)
            </span>
          </label>
        </div>

        {/* 이미지 업로드 영역 */}
        {useImageUpload && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-black dark:text-white">
                상품 이미지
              </h3>
              <span className="text-sm text-gray-500 dark:text-neutral-400">
                {photos.length}/5
              </span>
            </div>

            {/* 업로드 에러 메시지 */}
            {uploadError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  ⚠️ {uploadError}
                </p>
                <p className="text-red-500 dark:text-red-300 text-xs mt-1">
                  관리자에게 문의하거나 잠시 후 다시 시도해주세요.
                </p>
              </div>
            )}

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
        )}

        {/* 이미지 없이 등록할 때 안내 메시지 */}
        {!useImageUpload && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-blue-600 dark:text-blue-400 text-sm">
              ℹ️ 이미지 없이 상품을 등록합니다. 기본 이미지가 사용됩니다.
            </p>
          </div>
        )}

        {/* 제목 입력 */}
        <Input
          name="title"
          required
          placeholder="제목을 입력하세요"
          type="text"
          errors={(state as FormState)?.fieldErrors?.title}
        />

        {/* 가격 입력 */}
        <Input
          name="price"
          required
          placeholder="가격을 입력하세요"
          type="number"
          errors={(state as FormState)?.fieldErrors?.price}
        />

        {/* 설명 입력란 - 글쓰기 형식으로 개선 */}
        <div>
          <textarea
            name="description"
            required
            placeholder="상품에 대한 자세한 설명을 입력하세요&#10;&#10;예시:&#10;- 상품 상태 (새상품/중고)&#10;- 거래 방법 (직거래/택배)&#10;- 상품 특징 및 장점&#10;- 기타 참고사항"
            className="bg-white dark:bg-transparent rounded-md w-full
              h-60 foucus:outline-none ring-2 focus:ring-4
              transition
              ring-gray-300 dark:ring-neutral-200 focus:ring-orange-500 border border-gray-300 dark:border-none
              placeholder:text-gray-500 dark:placeholder:text-neutral-400 text-black dark:text-white p-3 resize-vertical"
            defaultValue={(state as FormState)?.fieldValues?.description || ""}
          />
          {(state as FormState)?.fieldErrors?.description && (
            <div className="text-red-500 text-xs mt-1">
              {(state as FormState).fieldErrors!.description}
            </div>
          )}
        </div>

        <Button
          text={isUploading || isSubmitting ? "처리 중..." : "저장하기"}
          disabled={isUploading || isSubmitting}
          onClick={handleSaveClick}
        />
      </form>
      <BackButton />
    </div>
  );
}
