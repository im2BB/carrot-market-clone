export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 animate-pulse">
      {/* 헤더 스켈레톤 */}
      <div className="bg-slate-50 dark:bg-neutral-800 border-b border-slate-200 dark:border-neutral-700 p-4">
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-32"></div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-neutral-700 rounded"></div>
        </div>
      </div>

      {/* 네비게이션 스켈레톤 */}
      <div className="bg-slate-100 dark:bg-neutral-800 border-b border-slate-200 dark:border-neutral-700 p-4">
        <div className="flex space-x-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="h-10 bg-gray-200 dark:bg-neutral-700 rounded w-20"
            ></div>
          ))}
        </div>
      </div>

      {/* 컨텐츠 스켈레톤 */}
      <div className="p-6 space-y-6">
        <div>
          <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-48"></div>
        </div>

        {/* 통계 카드 스켈레톤 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-black dark:border-neutral-700"
            >
              <div className="text-center">
                <div className="w-10 h-10 bg-gray-200 dark:bg-neutral-700 rounded-full mx-auto mb-3"></div>
                <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-20 mx-auto mb-2"></div>
                <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-16 mx-auto"></div>
              </div>
            </div>
          ))}
        </div>

        {/* 최근 활동 스켈레톤 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-black dark:border-neutral-700"
            >
              <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-neutral-700 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-32 mb-1"></div>
                      <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-24"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
