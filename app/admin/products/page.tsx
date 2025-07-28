import { getAdminProducts } from "@/lib/actions/admin";
import { deleteProduct } from "@/lib/actions/delete";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";

export const dynamic = "force-dynamic";

// 이미지 URL 처리 함수
function getOptimizedImageUrl(url: string | null, size: number = 100): string {
  if (!url) return "/logo-carrot.png";

  const trimmedUrl = url.trim();
  if (!trimmedUrl) return "/logo-carrot.png";

  // Cloudflare Images URL인 경우 최적화 옵션 추가
  if (trimmedUrl.includes("imagedelivery.net")) {
    // URL 끝에 크기 최적화 옵션 추가
    return `${trimmedUrl}/w=${size},h=${size},fit=cover,q=80`;
  }

  return trimmedUrl;
}

// 관리자 상품 삭제 액션
async function adminDeleteProduct(productId: number) {
  "use server";

  try {
    await deleteProduct(productId);
    return { success: true, message: "상품이 삭제되었습니다." };
  } catch (error) {
    console.error("상품 삭제 오류:", error);
    return { success: false, message: "상품 삭제에 실패했습니다." };
  }
}

export default async function AdminProductsPage() {
  const { products, totalProducts } = await getAdminProducts(0, 20);

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-black dark:text-white">
            상품 관리
          </h1>
          <p className="text-sm lg:text-base text-gray-600 dark:text-neutral-400">
            총 {totalProducts}개의 상품이 등록되어 있습니다
          </p>
        </div>
      </div>

      {/* 데스크톱 테이블 뷰 */}
      <div className="hidden lg:block bg-white dark:bg-neutral-800 shadow-lg rounded-lg border border-black dark:border-neutral-700">
        <div className="px-6 py-4 border-b border-black dark:border-neutral-700">
          <h3 className="text-lg font-medium text-black dark:text-white">
            상품 목록
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-black dark:divide-neutral-700">
            <thead className="bg-gray-100 dark:bg-neutral-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-neutral-300 uppercase tracking-wider">
                  상품
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-neutral-300 uppercase tracking-wider">
                  가격
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-neutral-300 uppercase tracking-wider">
                  판매자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-neutral-300 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-neutral-300 uppercase tracking-wider">
                  등록일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-neutral-300 uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-800 divide-y divide-black dark:divide-neutral-700">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          src={getOptimizedImageUrl(product.photo, 48)}
                          alt={product.title}
                          className="h-12 w-12 rounded-lg object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-black dark:text-white">
                          {product.title}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-neutral-400">
                          {product.description?.substring(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-black dark:text-white">
                      {product.price.toLocaleString()}원
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-black dark:text-white">
                      {product.user.username}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-neutral-400">
                      {product.user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.sold
                          ? "bg-red-500 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {product.sold ? "판매완료" : "판매중"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-black dark:text-white">
                    {formatDistanceToNow(new Date(product.created_at), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      href={`/products/${product.id}`}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      보기
                    </Link>
                    <form
                      action={adminDeleteProduct.bind(null, product.id)}
                      className="inline"
                    >
                      <button
                        type="submit"
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        삭제
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 모바일 카드 뷰 */}
      <div className="lg:hidden space-y-3">
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-black dark:border-neutral-700">
          <h3 className="text-base font-medium text-black dark:text-white mb-3">
            상품 목록
          </h3>
        </div>
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-black dark:border-neutral-700"
          >
            <div className="flex gap-3 mb-3">
              <div className="flex-shrink-0">
                <img
                  src={getOptimizedImageUrl(product.photo, 100)}
                  alt={product.title}
                  className="w-20 h-20 rounded-lg object-cover"
                  loading="lazy"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-sm font-medium text-black dark:text-white truncate">
                    {product.title}
                  </h4>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${
                      product.sold
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {product.sold ? "완료" : "판매중"}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-neutral-400 mb-1">
                  {product.description?.substring(0, 60)}...
                </p>
                <p className="text-sm font-semibold text-orange-400">
                  {product.price.toLocaleString()}원
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-gray-100 dark:bg-neutral-700 rounded p-2">
                <div className="text-xs text-gray-600 dark:text-neutral-400">
                  판매자
                </div>
                <div className="text-sm text-black dark:text-white">
                  {product.user.username}
                </div>
                <div className="text-xs text-gray-600 dark:text-neutral-400 truncate">
                  {product.user.email}
                </div>
              </div>
              <div className="bg-gray-100 dark:bg-neutral-700 rounded p-2">
                <div className="text-xs text-gray-600 dark:text-neutral-400">
                  등록일
                </div>
                <div className="text-sm text-black dark:text-white">
                  {formatDistanceToNow(new Date(product.created_at), {
                    addSuffix: true,
                    locale: ko,
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Link
                href={`/products/${product.id}`}
                className="px-3 py-1 text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
              >
                보기
              </Link>
              <form
                action={adminDeleteProduct.bind(null, product.id)}
                className="inline"
              >
                <button
                  type="submit"
                  className="px-3 py-1 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                >
                  삭제
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
