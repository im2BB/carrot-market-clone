import Silder from "@/components/silder";
import db from "@/lib/db";
import Link from "next/link";

export const metadata = {
  title: "홈",
};

async function getRecentProducts() {
  try {
    return await db.product.findMany({
      take: 8, // 최근 8개의 상품만 가져옴
      orderBy: {
        created_at: "desc", // 최신순으로 정렬
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("상품 조회 중 오류 발생:", error);
    return [];
  }
}

export default async function Home() {
  const products = await getRecentProducts();
  return (
    <div className="p-7">
      <div className="p-8 flex justify-center items-center">
        <p className="text-6xl">당근이려나</p>
      </div>
      <div className="flex justify-center items-center gap-3">
        <input
          className="bg-transparent rounded-md w-full
            h-10 foucus:outline-none ring-2 focus:ring-4
            transition
            ring-neutral-200 focus:ring-orange-500 border-none
            "
          placeholder="검색어를 입력하세요"
        />
        <button
          className="primary-btn h-10 w-12
    disabled:bg-neutral-400 disabled:text-neutral-300
    disabled:cursor-not-allowed"
        >
          검색
        </button>
      </div>
      <div>
        <div className="p-5 flex text-lg justify-center items-center">
          <p>이벤트 슬라이드</p>
        </div>
        <Silder />
      </div>
      <div>
        <h2 className="flex p-5 justify-center items-center text-lg font-medium">
          최근 등록 상품
        </h2>
        <div className="grid grid-cols-3 gap-4 ">
          {products.map((product) => (
            <Link
              href={`/products/${product.id}`}
              key={product.id}
              className="block"
            >
              <div className="bg-neutral-800 rounded-lg overflow-hidden aspect-square">
                {product.photo ? (
                  <img
                    src={product.photo}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex items-center gap-7 mt-3">
                <h3 className="text-white truncate text-lg">{product.title}</h3>
                <p className="text-orange-500 font-medium text-sm">
                  {product.price.toLocaleString()}원
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
