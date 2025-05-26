"use client";

import { PhotoIcon } from "@heroicons/react/16/solid";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

export default function Modal({ params }: { params: { id: string } }) {
  const router = useRouter();
  const onCloseClick = () => {
    router.back();
  };
  return (
    <div
      className=" absolute w-full h-full flex z-50 justify-center 
    items-center bg-black bg-opacity-60 top-0 left-0"
    >
      <button
        onClick={onCloseClick}
        className=" absolute right-20 top-5 text-neutral-200"
      >
        <XMarkIcon className="size-10" />
      </button>
      <div className="max-w-screen-sm h-1/2 w-full flex justify-center">
        <div
          className="aspect-square bg-neutral-700 rounded-md text-neutral-200
      flex justify-center items-center"
        >
          <PhotoIcon className="h-28" />
        </div>
      </div>
    </div>
  );
}
