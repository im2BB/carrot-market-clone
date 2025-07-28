"use client";

import ListProduct from "./list-products";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  getMoreProducts,
  getInitialProducts,
} from "@/app/(tabs)/products/action";
import Loading from "@/app/(tabs)/products/loading";

interface ProductListProps {
  onProductClick: (id: number) => void;
}

export default function ProductList({ onProductClick }: ProductListProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  const [page, setPage] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const trigger = useRef<HTMLSpanElement>(null);

  // 초기 상품 로딩 최적화
  useEffect(() => {
    const loadInitialProducts = async () => {
      try {
        const initialProducts = await getInitialProducts();
        // initialProducts가 배열인지 확인
        if (Array.isArray(initialProducts)) {
          setProducts(initialProducts);
          // 페이지가 적으면 마지막 페이지로 설정
          if (initialProducts.length < 20) {
            setIsLastPage(true);
          }
        } else {
          // 배열이 아니면 빈 배열로 설정
          console.warn(
            "getInitialProducts returned non-array:",
            initialProducts
          );
          setProducts([]);
          setIsLastPage(true);
        }
      } catch (error) {
        console.error("Failed to load initial products:", error);
        setProducts([]);
        setIsLastPage(true);
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadInitialProducts();
  }, []);

  // 무한 스크롤 최적화
  const loadMoreProducts = useCallback(async () => {
    if (isLoading || isLastPage) return;

    setIsLoading(true);
    try {
      const newProducts = await getMoreProducts(page + 1);
      // newProducts가 배열인지 확인
      if (Array.isArray(newProducts)) {
        if (newProducts.length === 0) {
          setIsLastPage(true);
        } else {
          setPage((prev) => prev + 1);
          setProducts((prev) => [...prev, ...newProducts]);

          // 페이지 수가 적으면 마지막 페이지로 설정
          if (newProducts.length < 20) {
            setIsLastPage(true);
          }
        }
      } else {
        // 배열이 아니면 마지막 페이지로 설정
        console.warn("getMoreProducts returned non-array:", newProducts);
        setIsLastPage(true);
      }
    } catch (error) {
      console.error("Failed to load more products:", error);
      setIsLastPage(true);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, isLastPage]);

  // Intersection Observer 최적화
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const element = entries[0];
        if (element.isIntersecting && !isLoading && !isLastPage) {
          loadMoreProducts();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px", // 100px 전에 미리 로딩
      }
    );

    if (trigger.current) {
      observer.observe(trigger.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [loadMoreProducts, isLoading, isLastPage]);

  if (isInitialLoading) {
    return <Loading />;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-5">
      {products && products.length > 0 ? (
        <>
          {products.map((product, index) => (
            <ListProduct
              key={`${product.id}-${index}`}
              {...product}
              onProductClick={onProductClick}
            />
          ))}
          {!isLastPage && (
            <span
              ref={trigger}
              className="block h-10 w-full"
              aria-hidden="true"
            />
          )}
          {isLoading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center pt-64 gap-4">
          <p className="text-black dark:text-neutral-400 text-lg">
            등록된 상품이 없습니다
          </p>
          <p className="text-black dark:text-neutral-500 text-sm">
            첫번째로 상품을 등록해 보시겠어요?
          </p>
        </div>
      )}
    </div>
  );
}
