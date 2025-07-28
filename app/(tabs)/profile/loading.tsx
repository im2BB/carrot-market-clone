export default function ProfileLoading() {
  return (
    <div className="space-y-6 pt-5 animate-pulse">
      {/* 프로필 헤더 스켈레톤 */}
      <div className="px-5 flex items-center gap-3">
        <div className="size-14 bg-gray-200 dark:bg-neutral-700 rounded-full"></div>
        <div className="flex flex-col gap-2">
          <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-24"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-32"></div>
        </div>
      </div>

      {/* 통계 카드 스켈레톤 */}
      <div className="grid grid-cols-2 gap-2 text-center">
        <div className="flex flex-col items-center p-3">
          <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-8 mb-1"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-12"></div>
        </div>
        <div className="flex flex-col items-center p-3">
          <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-8 mb-1"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-16"></div>
        </div>
      </div>

      {/* 버튼 영역 스켈레톤 */}
      <div className="flex p-5 gap-5 items-center justify-center border-y border-gray-200 dark:border-neutral-800">
        <div className="h-8 w-24 bg-gray-200 dark:bg-neutral-700 rounded"></div>
        <div className="h-8 w-24 bg-gray-200 dark:bg-neutral-700 rounded"></div>
      </div>

      {/* 메뉴 스켈레톤 */}
      <div className="space-y-3 px-5">
        <div className="flex items-center justify-between p-3">
          <div className="h-5 bg-gray-200 dark:bg-neutral-700 rounded w-20"></div>
          <div className="w-5 h-5 bg-gray-200 dark:bg-neutral-700 rounded"></div>
        </div>
        <div className="flex items-center justify-between p-3">
          <div className="h-5 bg-gray-200 dark:bg-neutral-700 rounded w-24"></div>
          <div className="w-5 h-5 bg-gray-200 dark:bg-neutral-700 rounded"></div>
        </div>
        <div className="flex items-center justify-between p-3">
          <div className="h-5 bg-gray-200 dark:bg-neutral-700 rounded w-16"></div>
          <div className="w-5 h-5 bg-gray-200 dark:bg-neutral-700 rounded"></div>
        </div>
      </div>
    </div>
  );
}
