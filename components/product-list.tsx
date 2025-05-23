"use client";

import Products, { InitialProducts } from "@/app/(tabs)/products/page";
import ListProduct from "./list-products";
import { useState } from "react";
import { getMoreProducts } from "@/app/(tabs)/products/action";

interface ProductListProps {
  initialProducts: InitialProducts;
}

export default function ProductList({ initialProducts }: ProductListProps) {
  const [products, setProducts] = useState(initialProducts);
  const [isLoding, setisLoding] = useState(false);
  const onLoadMoreClick = async () => {
    setisLoding(true);
    const newProducts = await getMoreProducts(1);
    setProducts((prev) => [...prev, ...newProducts]);
    setisLoding(false);
  };
  return (
    <div className="p-5 flex flex-col gap-5">
      {products.map((product) => (
        <ListProduct key={product.id} {...product} />
      ))}
      <button
        onClick={onLoadMoreClick}
        disabled={isLoding}
        className="text-xm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2
      rounded-md hover:opacity-90 active:scale-95"
      >
        {isLoding ? "로딩 중..." : " 불러오기"}
      </button>
    </div>
  );
}
