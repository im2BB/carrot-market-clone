export default function Loading() {
  return (
    <div className="p-5 animate-pulse flex flex-col gap-5">
      {[...Array(10)].map((_, index) => (
        <div
          key={index}
          className="*:rounded-md flex gap-5 animate-pulse py-3 border-b border-neutral-800"
        >
          <div className="size-28 bg-neutral-700 flex-shrink-0" />
          <div className="flex flex-col gap-1 *:rounded-md flex-1">
            <div className="bg-neutral-700 h-5 w-40" />
            <div className="bg-neutral-700 h-5 w-20" />
            <div className="flex gap-3 items-center mt-1">
              <div className="bg-neutral-700 h-4 w-24" />
              <div className="bg-neutral-700 h-4 w-1" />
              <div className="bg-neutral-700 h-4 w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
