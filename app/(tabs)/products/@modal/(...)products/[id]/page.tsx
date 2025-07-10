import db from "@/lib/db";

export default async function InterceptedProductModalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await db.product.findUnique({
    where: {
      id: +id,
    },
    select: {
      id: true,
      title: true,
      price: true,
      created_at: true,
      photo: true,
    },
  });

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-neutral-800 p-6 rounded-lg max-w-lg w-full">
        <a href={`/products/${id}`} className="block">
          <div className="relative aspect-square w-full rounded-md overflow-hidden mb-4 bg-white">
            <img
              src={`${product.photo}/width=400,height=400`}
              alt={product.title}
              className="object-contain w-full h-full"
            />
          </div>
          <div className="flex flex-col gap-2 *:text-white">
            <h2 className="text-2xl font-bold">{product.title}</h2>
            <p className="text-neutral-400">
              {new Date(product.created_at).toLocaleDateString()}
            </p>
            <p className="text-xl font-semibold">
              {product.price.toLocaleString()}원
            </p>
          </div>
        </a>
      </div>
    </div>
  );
}
