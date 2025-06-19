export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black/60 z-10 flex items-center justify-center">
      <div className="bg-neutral-800 p-6 rounded-lg max-w-lg w-full animate-pulse">
        <div className="relative aspect-square w-full rounded-md overflow-hidden mb-4 bg-neutral-700"></div>
        <div className="flex flex-col gap-2">
          <div className="h-8 bg-neutral-700 rounded w-3/4"></div>
          <div className="h-6 bg-neutral-700 rounded w-1/4"></div>
          <div className="h-7 bg-neutral-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}
