"use client";
import { useState } from "react";
import ProductModal from "@/components/ProductModal";

export default function HomeClient({ products }: { products: any[] }) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const DEFAULT_IMAGE = "/기본사용자.jpg";
  function getSafeImageSrc(src?: string) {
    if (!src || typeof src !== "string" || src.trim() === "") return DEFAULT_IMAGE;
    if (src.startsWith("data:image")) return src;
    try {
      const url = new URL(src);
      if (url.hostname.includes("imagedelivery.net") || url.hostname.includes("cloudflare")) {
        return `${src}/width=400,height=400`;
      }
      if (url.protocol === "http:" || url.protocol === "https:") return src;
    } catch {
      if (src.startsWith("/")) return src;
      return DEFAULT_IMAGE;
    }
    return DEFAULT_IMAGE;
  }
  return (
    <div className="p-7">
      <div className="p-8 flex justify-center items-center">
        <p className="text-6xl">당근이려나</p>
      </div>
      <div className="flex justify-center items-center gap-3">
        <input
          className="bg-transparent rounded-md w-full h-10 foucus:outline-none ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none"
          placeholder="검색어를 입력하세요"
        />
        <button className="primary-btn h-10 w-12 disabled:bg-neutral-400 disabled:text-neutral-300 disabled:cursor-not-allowed">
          검색
        </button>
      </div>
      <div>
        <div className="p-5 flex text-lg justify-center items-center">
          <p>이벤트 슬라이드</p>
        </div>
        {/* Silder는 서버 컴포넌트에서만 사용 가능하므로 필요시 prop으로 전달 */}
      </div>
      <div>
        <h2 className="flex p-5 justify-center items-center text-lg font-medium">최근 등록 상품</h2>
        <div className="grid grid-cols-3 gap-4 ">
          {products.map((product) => {
            const imgSrc = getSafeImageSrc(product.photo);
            return (
              <div
                key={product.id}
                className="block hover:scale-110 transition-transform duration-100 cursor-pointer"
                onClick={() => setSelectedId(product.id)}
              >
                <div className="bg-neutral-800 rounded-lg overflow-hidden aspect-square">
                  {imgSrc.startsWith("data:image") || imgSrc.startsWith("/") || imgSrc.startsWith("http") ? (
                    <img src={imgSrc} alt={product.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-neutral-400">No Image</div>
                  )}
                </div>
                <div className="flex items-center gap-7 mt-3">
                  <h3 className="text-white truncate text-lg">{product.title}</h3>
                  <p className="text-orange-500 font-medium text-sm">{product.price.toLocaleString()}원</p>
                </div>
              </div>
            );
          })}
        </div>
        {selectedId && <ProductModal id={selectedId} onClose={() => setSelectedId(null)} />}
      </div>
    </div>
  );
} 