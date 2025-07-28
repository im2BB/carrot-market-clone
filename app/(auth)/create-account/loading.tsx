export default function CreateAccountLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 flex items-center justify-center">
      <div className="w-full max-w-md p-6 space-y-6">
        {/* 제목 스켈레톤 */}
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-32"></div>
          <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-48"></div>
        </div>

        {/* 폼 스켈레톤 */}
        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-20"></div>
              <div className="h-12 bg-gray-200 dark:bg-neutral-700 rounded-lg"></div>
            </div>
          ))}
        </div>

        {/* 버튼 스켈레톤 */}
        <div className="h-12 bg-gray-200 dark:bg-neutral-700 rounded-lg"></div>

        {/* 소셜 로그인 스켈레톤 */}
        <div className="space-y-3">
          <div className="h-px bg-gray-200 dark:bg-neutral-700"></div>
          <div className="h-12 bg-gray-200 dark:bg-neutral-700 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
}
