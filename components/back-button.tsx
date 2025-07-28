"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  fallbackUrl?: string;
  position?: "left" | "right";
}

export default function BackButton({
  fallbackUrl,
  position = "left",
}: BackButtonProps) {
  // 뒤로가기 버튼 비활성화
  return null;

  // const router = useRouter();

  // const handleBack = () => {
  //   if (fallbackUrl) {
  //     router.push(fallbackUrl);
  //   } else {
  //     router.back();
  //   }
  // };

  // return (
  //   <button
  //     onClick={handleBack}
  //     className={`bg-orange-500 flex items-center justify-center rounded-full w-12 h-12 absolute top-4 ${
  //       position === "right" ? "right-4" : "left-4"
  //     } z-30 text-white transition-colors hover:bg-orange-400`}
  //   >
  //     <ArrowLeftIcon className="w-6 h-6" />
  //   </button>
  // );
}
