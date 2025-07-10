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
}

export default function ListProduct({
  title,
  price,
  created_at,
  photo,
  id,
  sold = false,
  onProductClick,
}: ListProductProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onProductClick(id);
  };

  return (
    <div className="flex gap-5 cursor-pointer" onClick={handleClick}>
      <div className="relative size-28 rounded-md overflow-hidden">
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
      <div className="flex flex-col gap-2">
        <div className="flex justify-center text-center gap-1">
          <div className="flex items-center gap-2">
            <span className="text-lg text-white mr-5">{title}</span>
            {sold && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                판매완료
              </span>
            )}
          </div>
        </div>
        <span className="text-sm  text-neutral-500">
          {formatToTimeAgo(created_at.toString())}
        </span>
        <span className="text-lg font-semibold text-orange-500">
          {formatToWon(price)}원
        </span>
      </div>
    </div>
  );
}
