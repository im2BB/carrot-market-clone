"use client";

import Link from "next/link";

interface FloatingButtonProps {
  href: string;
  children: React.ReactNode;
}

export default function FloatingButton({
  children,
  href,
}: FloatingButtonProps) {
  return (
    <Link
      href={href}
      className="bg-orange-500 flex items-center
      justify-center rounded-full size-12 fixed 
      bottom-24 right-8 text-white transition-colors 
      hover:bg-orange-400"
    >
      {children}
    </Link>
  );
}
