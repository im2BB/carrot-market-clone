export default function Loading() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {[...Array(10)].map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-md animate-pulse"
        >
          <div className="size-12 bg-gray-200 dark:bg-neutral-700 rounded-full" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <div className="bg-gray-200 dark:bg-neutral-700 h-5 w-32 rounded" />
              <div className="bg-gray-200 dark:bg-neutral-700 h-4 w-12 rounded" />
            </div>
            <div className="bg-gray-200 dark:bg-neutral-700 h-4 w-48 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
