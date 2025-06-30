"use client";

import CloseButton from "@/components/closeButton";
import ModalBackdrop from "@/components/ModalBackdrop";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ModalClientProps {
  product: any;
}

export default function ModalClient({ product }: ModalClientProps) {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="absolute inset-0 z-50 items-center justify-center">
      <CloseButton onCloseClick={handleClose} />
      <ModalBackdrop>
        <div className="absolute gap-5 pt-10 w-full h-full justify-center bg-black bg-opacity-60 top-0 left-0">
          <div className="max-w-screen-sm">
            <div className="relative pt-50 aspect-square bg-neutral-700 rounded-md text-neutral-200 flex justify-center items-center">
              <Image
                fill
                className="object-cover"
                src={`${product.photo}/public`}
                alt={product.title}
              />
            </div>
          </div>
          <div className="text-white px-3">
            <div className="p-3 flex gap-5 border-b border-neutral-700 items-center">
              <div className="size-10 overflow-hidden rounded-full">
                {product.user.avater !== null ? (
                  <Image
                    src={product.user.avater}
                    width={40}
                    height={40}
                    alt={product.user.username}
                  />
                ) : (
                  <UserIcon />
                )}
              </div>
              <h3 className="font-semibold ">{product.user.username}</h3>
            </div>
            <div className="p-5 flex justify-between ">
              <h1 className="text-2xl font-semibold">{product.title}</h1>
              <h1 className="font-semibold ">{formatToWon(product.price)}원</h1>
            </div>
            <div className="font-semibold p-3">
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      </ModalBackdrop>
    </div>
  );
} 