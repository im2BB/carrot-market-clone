import { PhotoIcon, UserIcon } from "@heroicons/react/16/solid";

export default function Loading() {
  return (
    <div
      className=" absolute  w-full h-full 
     bg-black bg-opacity-60 top-0 left-0"
    >
      <div className=" animate-pulse  gap-5 w-full h-full flex flex-col z-50 justify-center">
        <div className="max-w-screen-sm h-1/2 w-full flex justify-center">
          <div
            className="relative aspect-square bg-neutral-700 rounded-md text-neutral-200
      flex justify-center items-center"
          >
            <PhotoIcon />
          </div>
        </div>
        <div className="text-white px-3">
          <div className="p-3 flex gap-4 border-b items-center border-neutral-700">
            <div className="size-10  rounded-full">
              <UserIcon />
            </div>
            <div className="h-5 w-40 bg-neutral-700 rounded-md" />
          </div>
          <div className="p-5 flex justify-between ">
            <div className="h-5 w-40 bg-neutral-700 rounded-md" />
            <div className="h-5 w-20 bg-neutral-700 rounded-md" />
          </div>
          <div className="font-semibold p-3">
            <div className="h-2 w-90 bg-neutral-700 rounded-md" />
          </div>
          <div className="font-semibold px-3">
            <div className="h-2 w-90 bg-neutral-700 rounded-md" />
          </div>
          <div className="font-semibold p-3">
            <div className="h-2 w-90 bg-neutral-700 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
