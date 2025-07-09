"use client";

import FloatingButton from "@/components/floating-button";
import ProductList from "@/components/product-list";
import ProductModal from "@/components/ProductModal";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

// 동적 렌더링 강제
export const dynamic = "force-dynamic";

export default function Products() {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    null
  );

  const handleProductClick = (id: number) => {
    setSelectedProductId(id);
  };

  const handleCloseModal = () => {
    setSelectedProductId(null);
  };

  return (
    <div>
      <ProductList onProductClick={handleProductClick} />
      {selectedProductId && (
        <ProductModal id={selectedProductId} onClose={handleCloseModal} />
      )}
      <FloatingButton href="/add-products">
        <PlusIcon className="size-8" />
      </FloatingButton>
    </div>
  );
}
