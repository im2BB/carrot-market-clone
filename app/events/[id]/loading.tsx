export default function EventDetailLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 animate-pulse">
      {/* 이벤트 이미지 스켈레톤 */}
      <div className="relative aspect-video w-full bg-gray-200 dark:bg-neutral-700">
        <div className="absolute top-4 right-4 w-8 h-8 bg-gray-300 dark:bg-neutral-600 rounded-full"></div>
      </div>

      {/* 이벤트 정보 스켈레톤 */}
      <div className="p-5 space-y-4">
        <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-full"></div>

        <div className="flex items-center gap-4 text-sm">
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-20"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-16"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-12"></div>
        </div>

        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-5/6"></div>
        </div>
      </div>

      {/* 참여 버튼 스켈레톤 */}
      <div className="p-5">
        <div className="h-12 bg-gray-200 dark:bg-neutral-700 rounded-lg"></div>
      </div>
    </div>
  );
}
