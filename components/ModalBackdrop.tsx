"use client";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function ModalBackdrop({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const backdropRef = useRef<HTMLDivElement>(null);

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 어디를 클릭해도 닫히게 하려면 아래 조건문을 제거하세요.
    // if (e.target === backdropRef.current) {
    router.back();
    // }
  };

  return (
    <div ref={backdropRef} onClick={onBackdropClick}>
      {children}
    </div>
  );
}
