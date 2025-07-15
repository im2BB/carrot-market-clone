import db from "@/lib/db";

export default async function InterceptedProductModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 타입 안전성을 위해 모든 필드를 조회
  const product = await db.product.findUnique({
    where: {
      id: +id,
    },
  });

  if (!product) return null;

  // sold 속성을 안전하게 접근
  const productWithSold = product as typeof product & { sold?: boolean };

  return (
    <div className="fixed inset-0 bg-black/60 z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-neutral-800 p-6 rounded-lg max-w-lg w-full">
        <a href={`/products/${id}`} className="block">
          <div className="relative aspect-square w-full rounded-md overflow-hidden mb-4 bg-white">
            <img
              src={`${product.photo}/width=400,height=400`}
              alt={product.title}
              className={`object-contain w-full h-full ${
                productWithSold.sold ? "grayscale opacity-60" : ""
              }`}
            />
            {productWithSold.sold && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <span className="text-white font-bold text-xl">판매완료</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-black dark:text-white">
                {product.title}
              </h2>
              {productWithSold.sold && (
                <span className="bg-red-500 text-white text-sm px-3 py-1 rounded">
                  판매완료
                </span>
              )}
            </div>
            <p className="text-gray-500 dark:text-neutral-400 text-sm ml-2">
              {new Date(product.created_at).toLocaleDateString()}
            </p>
            <p className="text-xl font-semibold text-orange-500">
              {product.price.toLocaleString()}원
            </p>
          </div>
        </a>
      </div>
    </div>
  );
}
