"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CloseButton from "./closeButton";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { formatToWon } from "@/lib/utils";
import ProductModalSkeleton from "@/app/(tabs)/products/@modal/(...)products/[id]/loading";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  photo: string;
  created_at: Date;
  user: {
    username: string;
    avater: string | null;
  };
  sold: boolean;
}

export default function ProductModal({
  id,
  onClose,
}: {
  id: number;
  onClose: () => void;
}) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    // 새로고침으로 페이지 이동
    window.location.href = `/products/${id}`;
  };

  const handleClose = () => {
    onClose();
  };

  if (loading) {
    return <ProductModalSkeleton onClose={handleClose} />;
  }

  if (!product) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-lg">
          <div className="text-black dark:text-white">
            상품을 찾을 수 없습니다.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
      <div
        className="bg-white dark:bg-neutral-800 p-6 rounded-lg max-w-lg w-full mx-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <CloseButton onCloseClick={handleClose} />

        {/* 클릭 가능한 콘텐츠 영역 */}
        <div
          className="cursor-pointer rounded-md p-2 -m-2"
          onClick={handleModalClick}
        >
          <div className="relative aspect-square w-full rounded-md overflow-hidden mb-4 bg-white">
            <Image
              fill
              className={`object-contain ${
                product.sold ? "grayscale opacity-60" : ""
              }`}
              src={`${product.photo}/public`}
              alt={product.title}
            />
            {product.sold && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <span className="text-white font-bold text-xl">판매완료</span>
              </div>
            )}
          </div>
          <div className="text-black dark:text-white">
            <div className="flex gap-3 border-b border-gray-200 dark:border-neutral-700 items-center mb-4 pb-3">
              <div className="size-10 overflow-hidden rounded-full bg-white flex items-center justify-center">
                {product.user.avater ? (
                  <Image
                    src={product.user.avater}
                    width={40}
                    height={40}
                    alt={product.user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-6 h-6 text-gray-600" />
                )}
              </div>
              <h3 className="font-semibold">{product.user.username}</h3>
            </div>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">{product.title}</h1>
                {product.sold && (
                  <span className="bg-red-500 text-white text-sm px-3 py-1 rounded">
                    판매완료
                  </span>
                )}
              </div>
              <h1 className="font-semibold text-orange-500">
                {formatToWon(product.price)}원
              </h1>
            </div>
            <div className="text-gray-700 dark:text-neutral-300">
              <p>{product.description}</p>
            </div>
          </div>
        </div>

        {/* 클릭하여 상세페이지로 이동 안내 */}
        <div className="text-center mt-4 text-gray-500 dark:text-neutral-400 text-sm">
          클릭 시 상세페이지로 이동합니다
        </div>

        {/* 배경 클릭으로 모달 닫기 */}
        <div className="fixed inset-0 -z-10" onClick={handleClose} />
      </div>
    </div>
  );
}
