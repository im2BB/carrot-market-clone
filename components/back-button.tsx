"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  fallbackUrl?: string;
}

export default function BackButton({ fallbackUrl }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (fallbackUrl) {
      router.push(fallbackUrl);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleBack}
      className="bg-orange-500 flex items-center
      justify-center rounded-full size-12 fixed 
      bottom-24 right-8 text-white transition-colors 
      hover:bg-orange-400"
    >
      <ArrowLeftIcon className="size-7" />
    </button>
  );
}
