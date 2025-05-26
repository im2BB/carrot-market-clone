import CloseButton from "@/components/closeButton";
import { PhotoIcon } from "@heroicons/react/16/solid";

export default function Modal({ params }: { params: { id: string } }) {
  return (
    <div
      className=" absolute w-full h-full flex z-50 justify-center 
    items-center bg-black bg-opacity-60 top-0 left-0"
    >
      <CloseButton />
      <div className="max-w-screen-sm h-1/2 w-full flex justify-center">
        <div
          className="aspect-square bg-neutral-700 rounded-md text-neutral-200
      flex justify-center items-center"
        >
          <PhotoIcon className="h-28" />
        </div>
      </div>
    </div>
  );
}
