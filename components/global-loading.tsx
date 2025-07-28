export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
        <p className="text-gray-600 dark:text-neutral-400 text-sm">
          로딩 중...
        </p>
      </div>
    </div>
  );
}

// 페이지 스켈레톤 컴포넌트
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 animate-pulse">
      {/* 헤더 스켈레톤 */}
      <div className="bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 p-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 bg-gray-200 dark:bg-neutral-700 rounded"></div>
          <div className="h-8 w-8 bg-gray-200 dark:bg-neutral-700 rounded-full"></div>
        </div>
      </div>

      {/* 컨텐츠 스켈레톤 */}
      <div className="p-4 space-y-4">
        {/* 검색바 스켈레톤 */}
        <div className="h-12 bg-gray-200 dark:bg-neutral-700 rounded-lg"></div>

        {/* 카드 그리드 스켈레톤 */}
        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="aspect-square bg-gray-200 dark:bg-neutral-700 rounded-lg"></div>
              <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 리스트 스켈레톤 컴포넌트
export function ListSkeleton() {
  return (
    <div className="p-5 animate-pulse flex flex-col gap-5">
      {[...Array(10)].map((_, index) => (
        <div
          key={index}
          className="*:rounded-md flex gap-5 animate-pulse py-3 border-b border-gray-200 dark:border-neutral-800"
        >
          <div className="size-28 bg-gray-200 dark:bg-neutral-700 flex-shrink-0" />
          <div className="flex flex-col gap-1 *:rounded-md flex-1">
            <div className="bg-gray-200 dark:bg-neutral-700 h-5 w-40" />
            <div className="bg-gray-200 dark:bg-neutral-700 h-5 w-20" />
            <div className="flex gap-3 items-center mt-1">
              <div className="bg-gray-200 dark:bg-neutral-700 h-4 w-24" />
              <div className="bg-gray-200 dark:bg-neutral-700 h-4 w-1" />
              <div className="bg-gray-200 dark:bg-neutral-700 h-4 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// 카드 스켈레톤 컴포넌트
export function CardSkeleton() {
  return (
    <div className="p-5 animate-pulse flex flex-col">
      {[...Array(10)].map((_, index) => (
        <div
          key={index}
          className="pb-5 gap-2 mb-5 border-b border-gray-200 dark:border-neutral-500 flex flex-col animate-pulse"
        >
          <div className="bg-gray-200 dark:bg-neutral-700 h-6 w-40 rounded" />
          <div className="bg-gray-200 dark:bg-neutral-700 h-4 w-full rounded" />
          <div className="bg-gray-200 dark:bg-neutral-700 h-4 w-3/4 rounded" />
          <div className="flex items-center justify-between text-sm mt-2">
            <div className="flex gap-4 items-center">
              <div className="bg-gray-200 dark:bg-neutral-700 h-4 w-20 rounded" />
              <div className="bg-gray-200 dark:bg-neutral-700 h-4 w-1 rounded" />
              <div className="bg-gray-200 dark:bg-neutral-700 h-4 w-16 rounded" />
              <div className="bg-gray-200 dark:bg-neutral-700 h-4 w-1 rounded" />
              <div className="bg-gray-200 dark:bg-neutral-700 h-4 w-12 rounded" />
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-1">
                <div className="bg-gray-200 dark:bg-neutral-700 h-4 w-4 rounded" />
                <div className="bg-gray-200 dark:bg-neutral-700 h-4 w-4 rounded" />
              </div>
              <div className="flex items-center gap-1">
                <div className="bg-gray-200 dark:bg-neutral-700 h-4 w-4 rounded" />
                <div className="bg-gray-200 dark:bg-neutral-700 h-4 w-4 rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
