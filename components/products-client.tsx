"use client";

import { useState } from "react";
import ProductList from "@/components/product-list";
import ProductModal from "@/components/ProductModal";

interface ProductsClientProps {
  // ProductList에 필요한 props가 있다면 여기에 추가
}

export default function ProductsClient({}: ProductsClientProps) {
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
    <>
      <ProductList onProductClick={handleProductClick} />
      {selectedProductId && (
        <ProductModal id={selectedProductId} onClose={handleCloseModal} />
      )}
    </>
  );
}
