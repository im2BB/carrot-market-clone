import { formatToTimeAgo, formatToWon } from "@/lib/utils";
import Image from "next/image";

interface ListProductProps {
  title: string;
  price: number;
  created_at: Date;
  photo: string;
  id: number;
  onProductClick: (id: number) => void;
}

export default function ListProduct({
  title,
  price,
  created_at,
  photo,
  id,
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
          className="object-cover bg-white"
          alt={title}
        />
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-center text-center gap-1">
          <span className="text-lg text-white mr-5">{title}</span>
          <span className="text-sm text-neutral-500">
            {formatToTimeAgo(created_at.toString())}
          </span>
        </div>
        <span className="text-lg font-semibold text-orange-500">
          {formatToWon(price)}원
        </span>
      </div>
    </div>
  );
}
