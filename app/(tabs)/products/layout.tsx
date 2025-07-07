"use client";
import TabBar from "@/components/tab-bar";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function ProductsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  // /products/숫자 패턴이면 상세 페이지
  const isDetail = /^\/products\/[0-9]+$/.test(pathname);

  return children;
}
