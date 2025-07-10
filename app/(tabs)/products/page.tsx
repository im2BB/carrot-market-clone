import FloatingButton from "@/components/floating-button";
import ProductsClient from "@/components/products-client";
import { PlusIcon } from "@heroicons/react/24/solid";

export const metadata = {
  title: "상품 리스트",
};

// 동적 렌더링 강제
export const dynamic = "force-dynamic";

export default function Products() {
  return (
    <div>
      <ProductsClient />
      <FloatingButton href="/add-products">
        <PlusIcon className="size-8" />
      </FloatingButton>
    </div>
  );
}
