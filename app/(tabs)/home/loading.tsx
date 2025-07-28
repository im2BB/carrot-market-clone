export default function HomeLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 transition-colors duration-200 animate-pulse">
      <div className="p-7">
        {/* 헤더 스켈레톤 */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-32"></div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-200 dark:bg-neutral-700 rounded-full"></div>
            <div className="w-8 h-8 bg-gray-200 dark:bg-neutral-700 rounded-full"></div>
          </div>
        </div>

        {/* 검색바 스켈레톤 */}
        <div className="h-12 bg-gray-200 dark:bg-neutral-700 rounded-lg mb-6"></div>

        {/* 슬라이더 스켈레톤 */}
        <div className="mb-8">
          <div className="aspect-[16/9] bg-gray-200 dark:bg-neutral-700 rounded-lg"></div>
        </div>

        {/* 최근 등록 상품 섹션 스켈레톤 */}
        <div className="mb-8">
          <div className="flex justify-center mb-6">
            <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-32"></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="space-y-3">
                <div className="aspect-square bg-gray-200 dark:bg-neutral-700 rounded-lg"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 최근 게시물 섹션 스켈레톤 */}
        <div>
          <div className="flex justify-center mb-6">
            <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-24"></div>
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="bg-neutral-100 dark:bg-neutral-800 rounded-lg p-4"
              >
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-16"></div>
                </div>
              </div>
            ))}
            <div className="text-center pt-2">
              <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-16 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
