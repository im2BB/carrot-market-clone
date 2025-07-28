export default function PostDetailLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 animate-pulse">
      {/* 헤더 스켈레톤 */}
      <div className="p-5 border-b border-gray-200 dark:border-neutral-700">
        <div className="flex items-center justify-between mb-4">
          <div className="w-8 h-8 bg-gray-200 dark:bg-neutral-700 rounded-full"></div>
          <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-32"></div>
        </div>
        <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-full mb-2"></div>
        <div className="flex items-center gap-4 text-sm">
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-20"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-16"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-12"></div>
        </div>
      </div>

      {/* 컨텐츠 스켈레톤 */}
      <div className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-2/3"></div>
        </div>
      </div>

      {/* 댓글 섹션 스켈레톤 */}
      <div className="p-5 border-t border-gray-200 dark:border-neutral-700">
        <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-16 mb-4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="flex gap-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-neutral-700 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-20 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
