export default function Loading() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {[...Array(10)].map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-4 p-4 bg-neutral-900 rounded-md animate-pulse"
        >
          <div className="size-12 bg-neutral-700 rounded-full" />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <div className="bg-neutral-700 h-5 w-32 rounded" />
              <div className="bg-neutral-700 h-4 w-12 rounded" />
            </div>
            <div className="bg-neutral-700 h-4 w-48 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
