export default function AdminPostsLoading() {
  return (
    <div className="space-y-4 lg:space-y-6 animate-pulse">
      {/* 헤더 스켈레톤 */}
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-48"></div>
        </div>
        <div className="h-10 bg-gray-200 dark:bg-neutral-700 rounded w-32"></div>
      </div>

      {/* 데스크톱 테이블 뷰 스켈레톤 */}
      <div className="hidden lg:block bg-white dark:bg-neutral-800 shadow-lg rounded-lg border border-black dark:border-neutral-700">
        <div className="px-6 py-4 border-b border-black dark:border-neutral-700">
          <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-24"></div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-black dark:divide-neutral-700">
            <thead className="bg-gray-100 dark:bg-neutral-700">
              <tr>
                {[...Array(7)].map((_, index) => (
                  <th key={index} className="px-6 py-3 text-left">
                    <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-16"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-800 divide-y divide-black dark:divide-neutral-700">
              {[...Array(10)].map((_, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="h-5 bg-gray-200 dark:bg-neutral-700 rounded w-16"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-32"></div>
                        <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-24"></div>
                      </div>
                    </div>
                  </td>
                  {[...Array(6)].map((_, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-16"></div>
                        {cellIndex === 2 && (
                          <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-20"></div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 모바일 카드 뷰 스켈레톤 */}
      <div className="lg:hidden space-y-3">
        <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-black dark:border-neutral-700">
          <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-24"></div>
        </div>
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-black dark:border-neutral-700"
          >
            <div className="mb-3">
              <div className="flex items-center space-x-2 mb-2">
                <div className="h-5 bg-gray-200 dark:bg-neutral-700 rounded w-16"></div>
                <div className="h-5 bg-gray-200 dark:bg-neutral-700 rounded w-20"></div>
              </div>
              <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-3/4 mb-2"></div>
              <div className="flex items-center justify-between text-xs">
                <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-20"></div>
                <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-16"></div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="bg-gray-100 dark:bg-neutral-700 rounded p-2">
                <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-12 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-16 mb-1"></div>
                <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-20"></div>
              </div>
              <div className="bg-gray-100 dark:bg-neutral-700 rounded p-2">
                <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-12 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-16"></div>
              </div>
              <div className="bg-gray-100 dark:bg-neutral-700 rounded p-2">
                <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-12 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-16"></div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-16"></div>
              <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-20"></div>
              <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
