export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 animate-pulse">
      {/* 이미지 슬라이더 스켈레톤 */}
      <div className="relative aspect-square w-full bg-gray-200 dark:bg-neutral-700">
        <div className="absolute top-4 right-4 w-8 h-8 bg-gray-300 dark:bg-neutral-600 rounded-full"></div>
      </div>

      {/* 사용자 정보 스켈레톤 */}
      <div className="p-5 flex items-center gap-3 border-b border-gray-200 dark:border-neutral-700">
        <div className="w-10 h-10 bg-gray-200 dark:bg-neutral-700 rounded-full"></div>
        <div className="h-5 bg-gray-200 dark:bg-neutral-700 rounded w-24"></div>
      </div>

      {/* 상품 정보 스켈레톤 */}
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-48"></div>
          <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-24"></div>
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-1/2"></div>
        </div>
      </div>

      {/* 버튼 스켈레톤 */}
      <div className="p-5">
        <div className="h-12 bg-gray-200 dark:bg-neutral-700 rounded-lg"></div>
      </div>
    </div>
  );
}
