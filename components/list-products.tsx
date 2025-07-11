import { formatToTimeAgo, formatToWon } from "@/lib/utils";
import Image from "next/image";

interface ListProductProps {
  title: string;
  price: number;
  created_at: Date;
  photo: string;
  id: number;
  sold?: boolean;
  onProductClick: (id: number) => void;
  user?: { username?: string };
}

export default function ListProduct({
  title,
  price,
  created_at,
  photo,
  id,
  sold = false,
  onProductClick,
  user,
}: ListProductProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onProductClick(id);
  };

  return (
    <div
      className="flex gap-5 cursor-pointer items-center py-3 border-b border-neutral-800"
      onClick={handleClick}
    >
      <div className="relative size-28 rounded-md overflow-hidden flex-shrink-0">
        <Image
          fill
          src={`${photo}/width=100,height=100`}
          className={`object-cover bg-white ${
            sold ? "grayscale opacity-60" : ""
          }`}
          alt={title}
        />
        {sold && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <span className="text-white font-bold text-sm">판매완료</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-lg text-white truncate font-semibold">
            {title}
          </span>
          {sold && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
              판매완료
            </span>
          )}
        </div>
        <span className="text-orange-500 font-bold text-base">
          {formatToWon(price)}원
        </span>
        <div className="flex gap-3 text-xs text-neutral-400 mt-1">
          <span>판매자: {user?.username || "알 수 없음"}</span>
          <span>|</span>
          <span>{new Date(created_at).toLocaleDateString("ko-KR")}</span>
        </div>
      </div>
    </div>
  );
}
