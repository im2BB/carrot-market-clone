import { getAdminStats } from "@/lib/actions/admin";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";

export default async function AdminDashboard() {
  const data = await getAdminStats();

  return (
    <div className="space-y-4 lg:space-y-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-white">대시보드</h1>
        <p className="text-sm lg:text-base text-neutral-400">
          당근마켓 관리자 현황을 확인하세요
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <div className="bg-neutral-800 rounded-lg shadow-lg p-4 lg:p-6 border border-neutral-700">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm lg:text-base">👥</span>
              </div>
            </div>
            <div className="text-xs lg:text-sm font-medium text-neutral-400 mb-2">
              총 사용자
            </div>
            <div className="text-xl lg:text-3xl font-bold text-white">
              {data.stats.userCount}
            </div>
          </div>
        </div>

        <div className="bg-neutral-800 rounded-lg shadow-lg p-4 lg:p-6 border border-neutral-700">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm lg:text-base">📦</span>
              </div>
            </div>
            <div className="text-xs lg:text-sm font-medium text-neutral-400 mb-2">
              총 상품
            </div>
            <div className="text-xl lg:text-3xl font-bold text-white">
              {data.stats.productCount}
            </div>
          </div>
        </div>

        <div className="bg-neutral-800 rounded-lg shadow-lg p-4 lg:p-6 border border-neutral-700">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm lg:text-base">📝</span>
              </div>
            </div>
            <div className="text-xs lg:text-sm font-medium text-neutral-400 mb-2">
              총 게시글
            </div>
            <div className="text-xl lg:text-3xl font-bold text-white">
              {data.stats.postCount}
            </div>
          </div>
        </div>

        <div className="bg-neutral-800 rounded-lg shadow-lg p-4 lg:p-6 border border-neutral-700">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm lg:text-base">🎉</span>
              </div>
            </div>
            <div className="text-xs lg:text-sm font-medium text-neutral-400 mb-2">
              총 이벤트
            </div>
            <div className="text-xl lg:text-3xl font-bold text-white">
              {data.stats.eventCount}
            </div>
          </div>
        </div>
      </div>

      {/* 최근 활동 */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
        {/* 최근 가입 사용자 */}
        <div className="bg-neutral-800 rounded-lg shadow-lg border border-neutral-700">
          <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-neutral-700">
            <h3 className="text-base lg:text-lg font-medium text-white">
              최근 가입 사용자
            </h3>
          </div>
          <div className="p-4 lg:p-6">
            <div className="space-y-3">
              {data.recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-white truncate">
                      {user.username}
                    </div>
                    <div className="text-xs lg:text-sm text-neutral-400 truncate">
                      {user.email}
                    </div>
                  </div>
                  <div className="text-xs lg:text-sm text-neutral-400 flex-shrink-0 ml-2">
                    {formatDistanceToNow(new Date(user.created_at), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link
                href="/admin/users"
                className="text-orange-500 hover:text-orange-400 text-sm font-medium transition-colors"
              >
                모든 사용자 보기 →
              </Link>
            </div>
          </div>
        </div>

        {/* 최근 등록 상품 */}
        <div className="bg-neutral-800 rounded-lg shadow-lg border border-neutral-700">
          <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-neutral-700">
            <h3 className="text-base lg:text-lg font-medium text-white">
              최근 등록 상품
            </h3>
          </div>
          <div className="p-4 lg:p-6">
            <div className="space-y-3">
              {data.recentProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-white truncate">
                      {product.title}
                    </div>
                    <div className="text-xs lg:text-sm text-neutral-400 truncate">
                      {product.user.username} · {product.price.toLocaleString()}
                      원
                    </div>
                  </div>
                  <div className="text-xs lg:text-sm text-neutral-400 flex-shrink-0 ml-2">
                    {formatDistanceToNow(new Date(product.created_at), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link
                href="/admin/products"
                className="text-orange-500 hover:text-orange-400 text-sm font-medium transition-colors"
              >
                모든 상품 보기 →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
