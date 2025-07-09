import Silder from "@/components/silder";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { getRecentProductsAction, getEventsAction } from "./action";
import Image from "next/image";

export const metadata = {
  title: "홈",
};

export default async function Home() {
  const products = await getRecentProductsAction();
  const events = await getEventsAction();

  console.log("홈 페이지 - 상품 수:", products?.length || 0);
  console.log("홈 페이지 - 이벤트 수:", events?.length || 0);
  console.log("이벤트 데이터:", events);

  return (
    <div className="p-7">
      <div className="p-10 gap-10 flex justify-center items-center">
        <p className="text-6xl text-orange-600">🥕당근이려나</p>
      </div>
      <SearchBar />
      <div>
        <Silder events={events || []} />
      </div>
      <div className="gap-2">
        <h2 className="flex p-5 justify-center text-orange-400 items-center text-lg font-medium">
          최근 등록 상품
        </h2>
        {!products || products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <p className="text-neutral-400 text-lg">등록된 상품이 없습니다</p>
            <p className="text-neutral-500 text-sm">
              첫번째로 상품을 등록해 보시겠어요?
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-4">
            {products.map((product) => {
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
                  if (url.protocol === "http:" || url.protocol === "https:")
                    return src;
                } catch {
                  if (src.startsWith("/")) return src;
                  return DEFAULT_IMAGE;
                }
                return DEFAULT_IMAGE;
              }

              const imgSrc = getSafeImageSrc(product.photo);

              return (
                <Link
                  href={`/products/${product.id}`}
                  key={product.id}
                  className="block hover:scale-110 transition-transform duration-100"
                  scroll={false}
                >
                  <div className="bg-white rounded-lg overflow-hidden aspect-square">
                    {imgSrc.startsWith("data:image") ||
                    imgSrc.startsWith("/") ||
                    imgSrc.startsWith("http") ? (
                      <Image
                        src={imgSrc}
                        alt={product.title || "상품 이미지"}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                        unoptimized={imgSrc.includes("imagedelivery.net")}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400">
                        이미지가 없습니다
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-7 mt-3">
                    <h3 className="text-white truncate text-lg">
                      {product.title || "제목 없음"}
                    </h3>
                    <p className="text-orange-500 font-medium text-sm">
                      {product.price ? product.price.toLocaleString() : 0}원
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
