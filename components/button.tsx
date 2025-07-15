"use client";
import { useFormStatus } from "react-dom";

interface ButtonProps {
  text: string;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function Button({ text, disabled, onClick }: ButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending || disabled}
      onClick={onClick}
      className="primary-btn h-10 
    disabled:bg-gray-300 dark:disabled:bg-neutral-400 disabled:text-gray-500 dark:disabled:text-neutral-300
    disabled:cursor-not-allowed"
    >
      {pending ? "로딩 중..." : text}
    </button>
  );
}
