import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

export const metadata = {
  title: "라이브",
};

// 동적 렌더링 강제
export const dynamic = "force-dynamic";

export default function Live() {
  return (
    <div>
      <h1 className="text-white text-4xl">LIVE</h1>
      <Link
        href="/streams/add"
        className="bg-orange-500 flex items-center
      justify-center rounded-full size-12 fixed 
      bottom-24 right-8 text-white transition-colors 
      hover:bg-orange-400"
      >
        <PlusIcon className="size-8" />
      </Link>
    </div>
  );
}
