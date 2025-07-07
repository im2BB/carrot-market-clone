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
      <div className="flex  flex-col gap-1 *:text-white">
        <span className="text-lg">{title}</span>
        <span className="text-sm text-neutral-500">
          {formatToTimeAgo(created_at.toString())}
        </span>
        <span className="text-lg font-semibold">{formatToWon(price)}원</span>
      </div>
    </div>
  );
}
