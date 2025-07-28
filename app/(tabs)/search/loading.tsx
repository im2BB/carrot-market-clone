export default function SearchLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 animate-pulse">
      {/* 검색바 스켈레톤 */}
      <div className="p-7">
        <div className="h-12 bg-gray-200 dark:bg-neutral-700 rounded-lg mb-6"></div>

        {/* 검색 결과 그리드 스켈레톤 */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(12)].map((_, index) => (
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
