"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CloseButton() {
  const router = useRouter();
  const onCloseClick = () => {
    router.push("/products"); // 항상 /products로 이동
  };

  return (
    <button
      onClick={onCloseClick}
      className=" absolute right-5 top-5 text-neutral-200"
    >
      <XMarkIcon className="size-10" />
    </button>
  );
}
