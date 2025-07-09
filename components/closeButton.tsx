"use client";

import { XMarkIcon } from "@heroicons/react/24/solid";

interface CloseButtonProps {
  onCloseClick: () => void;
}

export default function CloseButton({ onCloseClick }: CloseButtonProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCloseClick();
  };

  return (
    <button
      onClick={handleClick}
      className="absolute z-50 bg-orange-500 rounded-full right-5 top-5 text-neutral-200"
    >
      <XMarkIcon className="size-6" />
    </button>
  );
}
