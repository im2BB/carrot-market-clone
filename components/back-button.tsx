"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="bg-orange-500 flex items-center
      justify-center rounded-full size-12 fixed 
      bottom-24 right-8 text-white transition-colors 
      hover:bg-orange-400"
    >
      <ArrowLeftIcon className="size-7" />
    </button>
  );
}
