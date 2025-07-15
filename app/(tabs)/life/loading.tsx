export default function Loading() {
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
