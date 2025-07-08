"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CloseButton from "./closeButton";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { formatToWon } from "@/lib/utils";

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
    router.push(`/products/${id}`);
  };

  const handleClose = () => {
    onClose();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
        <div className="bg-neutral-800 p-6 rounded-lg">
          <div className="text-white">로딩 중...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
        <div className="bg-neutral-800 p-6 rounded-lg">
          <div className="text-white">상품을 찾을 수 없습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      onClick={handleClose}
    >
      <div
        className="bg-neutral-800 p-6 rounded-lg max-w-lg w-full mx-4 cursor-pointer"
        onClick={handleModalClick}
      >
        <CloseButton onCloseClick={handleClose} />
        <div className="relative aspect-square w-full rounded-md overflow-hidden mb-4">
          <Image
            fill
            className="object-cover"
            src={`${product.photo}/public`}
            alt={product.title}
          />
        </div>
        <div className="text-white">
          <div className="flex gap-3 border-b border-neutral-700 items-center mb-4 pb-3">
            <div className="size-10 overflow-hidden rounded-full">
              {product.user.avater ? (
                <Image
                  src={product.user.avater}
                  width={40}
                  height={40}
                  alt={product.user.username}
                />
              ) : (
                <UserIcon className="w-10 h-10 text-neutral-400" />
              )}
            </div>
            <h3 className="font-semibold">{product.user.username}</h3>
          </div>
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-2xl font-semibold">{product.title}</h1>
            <h1 className="font-semibold">{formatToWon(product.price)}원</h1>
          </div>
          <div className="text-neutral-300">
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
