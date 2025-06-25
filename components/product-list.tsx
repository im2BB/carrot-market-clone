"use client";

import ListProduct from "./list-products";
import { useEffect, useRef, useState } from "react";
import {
  getMoreProducts,
  getInitialProducts,
} from "@/app/(tabs)/products/action";

interface ProductListProps {
  initialProducts: Awaited<ReturnType<typeof getInitialProducts>>;
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  const [page, setpage] = useState(0);
  const trigger = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        const element = entries[0];
        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
          setIsLoading(true);
          const newProducts = await getMoreProducts(page + 1);
          if (newProducts.length !== 0) {
            setpage((prev) => prev + 1);
            setProducts((prev) => [...prev, ...newProducts]);
          } else {
            setIsLastPage(true);
          }
          setIsLoading(false);
        }
      },
      {
        threshold: 1.0,
      }
    );
    if (trigger.current) {
      observer.observe(trigger.current);
    }
    const onLoadMoreClick = async () => {};
    return () => {
      observer.disconnect();
    };
  }, [page]);
  return (
    <div className="p-5 flex flex-col gap-5">
      {products && products.length > 0 ? (
        <>
          {products.map((product) => (
            <ListProduct key={product.id} {...product} />
          ))}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center pt-64 gap-4">
          <p className="text-neutral-400 text-lg">등록된 상품이 없습니다</p>
          <p className="text-neutral-500 text-sm">
            첫번째로 상품을 등록해 보시겠어요?
          </p>
        </div>
      )}
      {/* {!isLastPage ? (
        <span
          ref={trigger}
          className=" text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
        >
          {isLoading ? "로딩 중" : "불러오기"}
        </span>
      ) : null} */}
    </div>
  );
}
