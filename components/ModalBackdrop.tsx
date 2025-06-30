"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function ModalBackdrop({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const backdropRef = useRef<HTMLDivElement>(null);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.back(); // esc는 뒤로가기 유지
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  // 모달 열릴 때 body 스크롤 막기
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    window.location.reload();
  };

  return (
    <div ref={backdropRef} onClick={onBackdropClick}>
      {children}
    </div>
  );
}
