import BackButton from "@/components/back-button";
import SearchBar from "@/components/SearchBar";
import { getSearchedProducts } from "@/app/(tabs)/search/action";
import Link from "next/link";
import Image from "next/image";

function getSafeImageSrc(src?: string) {
  const DEFAULT_IMAGE = "/기본사용자.jpg";
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

export const metadata = {
  title: "검색 결과",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query: searchQuery } = await searchParams;
  const query = searchQuery?.trim() || "";
  if (!query) {
    return (
      <div className="p-10 text-center text-neutral-400">
        검색어를 입력해주세요.
      </div>
    );
  }

  const products = await getSearchedProducts(query);

  return (
    <div className="p-7">
      <SearchBar />

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-xl text-neutral-400 text-center py-20">
          {" "}
          " {query} " 에 대한 검색 결과가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => {
            const imgSrc = getSafeImageSrc(product.photo);
            return (
              <div
                key={product.id}
                className="flex flex-col items-center justify-center"
              >
                <Link
                  href={`/products/${product.id}`}
                  key={product.id}
                  className="block hover:scale-105 transition-transform duration-100"
                >
                  <div className="bg-white rounded-lg overflow-hidden aspect-square relative">
                    {imgSrc.startsWith("data:image") ||
                    imgSrc.startsWith("/") ||
                    imgSrc.startsWith("http") ? (
                      <Image
                        src={imgSrc}
                        alt={product.title}
                        width={400}
                        height={400}
                        className={`w-full h-full object-contain bg-white ${
                          product.sold ? "grayscale opacity-60" : ""
                        }`}
                        unoptimized={imgSrc.includes("imagedelivery.net")}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400">
                        이미지가 없습니다
                      </div>
                    )}
                    {product.sold && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <span className="text-white font-bold text-lg">
                          판매완료
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-7 mt-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white truncate text-lg">
                        {product.title}
                      </h3>
                      {product.sold && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                          판매완료
                        </span>
                      )}
                    </div>
                    <p className="text-orange-500 font-medium text-sm">
                      {product.price.toLocaleString()}원
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
      <BackButton />
    </div>
  );
}
