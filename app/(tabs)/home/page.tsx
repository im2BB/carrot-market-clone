import Silder from "@/components/silder";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { getHomePageDataAction } from "./action";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import HomeHeader from "@/components/home-header";

export const metadata = {
  title: "홈",
};

// 임시로 동적 렌더링 강제하여 캐시 우회
export const dynamic = "force-dynamic";

// 안전한 이미지 URL 처리 함수
function getSafeImageUrl(url?: string): string {
  if (!url || typeof url !== "string" || url.trim() === "") {
    return "/기본사용자.jpg";
  }

  // Data URL인 경우 그대로 반환
  if (url.startsWith("data:image")) {
    return url;
  }

  // 상대 경로인 경우 그대로 반환
  if (url.startsWith("/")) {
    return url;
  }

  try {
    const urlObj = new URL(url);
    // Cloudflare Images 최적화
    if (
      urlObj.hostname.includes("imagedelivery.net") ||
      urlObj.hostname.includes("cloudflare")
    ) {
      return `${url}/width=400,height=400`;
    }
    // 유효한 HTTP/HTTPS URL인 경우 그대로 반환
    if (urlObj.protocol === "http:" || urlObj.protocol === "https:") {
      return url;
    }
  } catch (error) {
    // URL 파싱 실패 시 기본 이미지 반환
    console.warn("Invalid image URL:", url);
  }

  return "/기본사용자.jpg";
}

export default async function Home() {
  // 단일 함수로 모든 데이터를 병렬로 가져오기
  const { products, events, posts } = await getHomePageDataAction();

  console.log("홈페이지 렌더링 - 이벤트:", events?.length, events);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 transition-colors duration-200">
      <div className="p-7">
        <HomeHeader />
        <SearchBar />
        <div>
          <Silder events={events || []} />
        </div>

        <div className="gap-2 mb-8">
          <h2 className="flex p-5 justify-center text-black dark:text-orange-300 items-center text-lg font-medium">
            최근 등록 상품
          </h2>
          {!products || products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <p className="text-black dark:text-neutral-500 text-lg">
                등록된 상품이 없습니다
              </p>
              <p className="text-black dark:text-neutral-400 text-sm">
                첫번째로 상품을 등록해 보시겠어요?
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {products.map((product) => {
                const safeImageUrl = getSafeImageUrl(product.photo);

                return (
                  <Link
                    href={`/products/${product.id}`}
                    key={product.id}
                    className="block hover:scale-105 transition-transform duration-200"
                    prefetch={true}
                  >
                    <div className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden aspect-square relative">
                      <Image
                        src={safeImageUrl}
                        alt={product.title || "상품 이미지"}
                        fill
                        className="object-cover"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      {product.sold && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            판매완료
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-center mt-3">
                      <div className="flex items-center gap-2">
                        <h3 className="text-black dark:text-white truncate text-lg">
                          {product.title || "제목 없음"}
                        </h3>
                        {product.sold && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                            판매완료
                          </span>
                        )}
                      </div>
                      <p className="text-orange-500 dark:text-orange-400 font-medium text-sm">
                        {product.price ? product.price.toLocaleString() : 0}원
                      </p>
                      <span className="text-black dark:text-neutral-400 text-xs">
                        {product.user?.username || "알 수 없음"}
                      </span>
                      <span className="text-black dark:text-neutral-400 text-xs">
                        •
                      </span>
                      <span className="text-black dark:text-neutral-500 text-xs">
                        {formatDistanceToNow(new Date(product.created_at), {
                          addSuffix: true,
                          locale: ko,
                        })}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* 최근 게시물 섹션 - 최적화됨 */}
        <div className="gap-2">
          <h2 className="flex p-5 justify-center text-black dark:text-orange-300 items-center text-lg font-medium">
            최근 게시물
          </h2>
          {!posts || posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <p className="text-black dark:text-neutral-500 text-sm">
                등록된 게시물이 없습니다
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.id}`}
                  className="block bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                  prefetch={true}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-black dark:text-white font-medium text-sm line-clamp-1 flex-1">
                      {post.title}
                    </h3>
                    <span className="text-black dark:text-neutral-400 text-xs ml-2 flex-shrink-0">
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
                  className="text-black dark:text-orange-300 text-sm hover:text-orange-500 dark:hover:text-orange-200 transition-colors"
                >
                  더보기 →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
