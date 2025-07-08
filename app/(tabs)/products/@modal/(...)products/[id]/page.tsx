import { getProduct } from "@/app/products/[id]/actions";
import ModalBackdrop from "@/components/ModalBackdrop";
import Image from "next/image";

export default async function ProductModal({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await getProduct(id);
  if (!product) return null;

  return (
    <ModalBackdrop>
      <div className="bg-white w-full max-w-lg rounded-lg p-6">
        <div className="relative aspect-square w-full">
          <Image
            src={product.image ?? ""}
            alt={product.name}
            fill
            className="object-cover rounded-lg cursor-pointer"
          />
        </div>
        <div className="mt-5">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-xl mt-3">${product.price}</p>
          <p className="text-gray-700 mt-4">{product.description}</p>
        </div>
      </div>
    </ModalBackdrop>
  );
}
