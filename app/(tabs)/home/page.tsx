import Silder from "@/components/silder";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import {
  getRecentProductsAction,
  getEventsAction,
  getRecentPostsAction,
} from "./action";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

export const metadata = {
  title: "홈",
};

// 동적 렌더링 강제 - 데이터베이스 데이터를 실시간으로 가져오기 위해
export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getRecentProductsAction();
  const events = await getEventsAction();
  const posts = await getRecentPostsAction();

  return (
    <div className="p-7">
      <div className="flex justify-center items-center py-8">
        <Image
          src="/logo-carrot.png"
          alt="당근마켓 클론 로고"
          width={220}
          height={220}
          priority
        />
      </div>
      <SearchBar />
      <div>
        <Silder events={events || []} />
      </div>

      <div className="gap-2 mb-8">
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
                  <div className="bg-white rounded-lg overflow-hidden aspect-square relative">
                    {imgSrc.startsWith("data:image") ||
                    imgSrc.startsWith("/") ||
                    imgSrc.startsWith("http") ? (
                      <Image
                        src={imgSrc}
                        alt={product.title || "상품 이미지"}
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
                  <div className="flex flex-col items-center mt-3">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white truncate text-lg">
                        {product.title || "제목 없음"}
                      </h3>
                      {product.sold && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                          판매완료
                        </span>
                      )}
                    </div>
                    <p className="text-orange-500 font-medium text-sm">
                      {product.price ? product.price.toLocaleString() : 0}원
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-neutral-400 text-xs">
                        {product.user?.username || "알 수 없음"}
                      </span>
                      <span className="text-neutral-500 text-xs">•</span>
                      <span className="text-neutral-400 text-xs">
                        {formatDistanceToNow(new Date(product.created_at), {
                          addSuffix: true,
                          locale: ko,
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* 최근 게시물 섹션 - 최근 상품 아래로 이동, 제목만 표시 */}
      <div className="gap-2">
        <h2 className="flex p-5 justify-center text-orange-400 items-center text-lg font-medium">
          최근 게시물
        </h2>
        {!posts || posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <p className="text-neutral-400 text-sm">등록된 게시물이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="block bg-neutral-800 rounded-lg p-4 hover:bg-neutral-700 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-white font-medium text-sm line-clamp-1 flex-1">
                    {post.title}
                  </h3>
                  <span className="text-neutral-400 text-xs ml-2 flex-shrink-0">
                    {formatDistanceToNow(new Date(post.created_at), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </span>
                </div>
              </Link>
            ))}
            <div className="text-center pt-2">
              <Link
                href="/life"
                className="text-orange-400 text-sm hover:text-orange-300 transition-colors"
              >
                더보기 →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
