"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PhotoIcon,
} from "@heroicons/react/24/solid";

interface ProductImageSliderProps {
  images: string[];
  representativeIndex: number;
  productId: number;
  isOwner: boolean;
  onRepresentativeChange?: (newIndex: number) => void;
}

export default function ProductImageSlider({
  images,
  representativeIndex,
  productId,
  isOwner,
  onRepresentativeChange,
}: ProductImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(representativeIndex);
  const [isChangingRepresentative, setIsChangingRepresentative] =
    useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const changeRepresentative = async (newIndex: number) => {
    if (!isOwner || newIndex === representativeIndex) return;

    setIsChangingRepresentative(true);
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          representativePhotoIndex: newIndex,
        }),
      });

      if (response.ok) {
        onRepresentativeChange?.(newIndex);
      } else {
        alert("대표 이미지 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("대표 이미지 변경 오류:", error);
      alert("대표 이미지 변경 중 오류가 발생했습니다.");
    } finally {
      setIsChangingRepresentative(false);
    }
  };

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-square bg-white flex items-center justify-center">
        <div className="text-center">
          <PhotoIcon className="w-16 h-16 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500">이미지가 없습니다</p>
        </div>
      </div>
    );
  }

  const currentImage = images[currentIndex];
  const DEFAULT_IMAGE = "/기본사용자.jpg";

  function getSafeImageSrc(src?: string) {
    if (!src || typeof src !== "string" || src.trim() === "")
      return DEFAULT_IMAGE;
    if (src.startsWith("data:image")) return src;
    try {
      const url = new URL(src);
      if (
        url.hostname.includes("imagedelivery.net") ||
        url.hostname.includes("cloudflare")
      ) {
        return `${src}/width=800,height=800`;
      }
      if (url.protocol === "http:" || url.protocol === "https:") return src;
    } catch {
      if (src.startsWith("/")) return src;
      return DEFAULT_IMAGE;
    }
    return DEFAULT_IMAGE;
  }

  return (
    <div className="relative aspect-square bg-white">
      {/* 메인 이미지 */}
      <Image
        fill
        className="object-contain"
        src={getSafeImageSrc(currentImage)}
        alt={`상품 이미지 ${currentIndex + 1}`}
        unoptimized={currentImage.includes("imagedelivery.net")}
      />

      {/* 네비게이션 버튼 (2장 이상일 때만 표시) */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </>
      )}

      {/* 이미지 인디케이터 */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? "bg-white" : "bg-white bg-opacity-50"
              }`}
            />
          ))}
        </div>
      )}

      {/* 대표 이미지 표시 및 변경 버튼 */}
      {isOwner && images.length > 1 && onRepresentativeChange && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {currentIndex === representativeIndex && (
            <div className="bg-orange-500 text-white text-xs px-2 py-1 rounded">
              대표
            </div>
          )}
          <button
            onClick={() => changeRepresentative(currentIndex)}
            disabled={
              isChangingRepresentative || currentIndex === representativeIndex
            }
            className={`text-xs px-2 py-1 rounded transition-all ${
              currentIndex === representativeIndex
                ? "bg-gray-500 text-white cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {isChangingRepresentative ? "변경 중..." : "대표로 설정"}
          </button>
        </div>
      )}

      {/* 이미지 카운터 */}
      {images.length > 1 && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}
