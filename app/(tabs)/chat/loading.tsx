export default function Loading() {
  return (
    <div className="p-5 animate-pulse flex flex-col gap-5">
      {[...Array(10)].map((_, index) => (
        <div key={index} className="*:rounded-md flex gap-5 animate-pulse">
          <div className="size-14 bg-neutral-700" />
          <div className="flex flex-col justify-between *:rounded-md">
            <div className=" gap-2 ">
              <div className="bg-neutral-700 h-5 w-40" />
              <div className="bg-neutral-700 h-5 w-20" />
            </div>
            <div className="flex flex-col">
              <div className="bg-neutral-700 h-5 w-10" />
              <div className="bg-neutral-700 h-5 w-10" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
