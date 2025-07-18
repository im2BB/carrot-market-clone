import { getMyProducts } from "./action";
import { formatToWon } from "@/lib/utils";
import Link from "next/link";
import BackButton from "@/components/back-button";
import ToggleSoldButton from "./ToggleSoldButton";

export const metadata = {
  title: "내 판매상품",
};

export default async function MyProductsPage() {
  const products = await getMyProducts();

  const DEFAULT_IMAGE = "/기본사용자.jpg";
  function getSafeImageSrc(src?: string) {
    if (!src || typeof src !== "string" || src.trim() === "")
      return DEFAULT_IMAGE;
    if (src.startsWith("data:image")) return src;
    try {
      const url = new URL(src);
      if (
        url.hostname.includes("imagedelivery.net") ||
        url.hostname.includes("cloudflare")
      ) {
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
    <div className="p-7 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <BackButton />
        <h1 className="text-3xl font-bold">내 판매상품</h1>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-400 text-lg mb-4">
            등록한 판매상품이 없습니다.
          </p>
          <Link
            href="/add-products"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            첫 번째 상품 등록하기
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {products.map((product) => {
            const imgSrc = getSafeImageSrc(product.photo);
            return (
              <div
                key={product.id}
                className="bg-neutral-800 rounded-lg p-6 border border-neutral-700"
              >
                <div className="flex gap-6">
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <img
                      src={imgSrc}
                      alt={product.title}
                      className={`w-full h-full object-contain bg-white rounded-lg ${
                        product.sold ? "grayscale opacity-60" : ""
                      }`}
                    />
                    {product.sold && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                        <span className="text-white font-bold text-sm">
                          판매완료
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-semibold">
                          {product.title}
                        </h3>
                        {product.sold && (
                          <span className="bg-red-500 text-white text-sm px-3 py-1 rounded">
                            판매완료
                          </span>
                        )}
                      </div>
                      <span className="text-orange-500 font-bold text-lg">
                        {formatToWon(product.price)}원
                      </span>
                    </div>
                    <p className="text-neutral-300 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="text-sm text-neutral-400 mb-4">
                      <span className="text-orange-400 font-medium">
                        등록일:
                      </span>{" "}
                      {new Date(product.created_at).toLocaleDateString("ko-KR")}
                    </div>
                    <div className="flex gap-3">
                      <Link
                        href={`/products/${product.id}`}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        상품 보기
                      </Link>
                      <ToggleSoldButton
                        productId={product.id}
                        isSold={product.sold}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
