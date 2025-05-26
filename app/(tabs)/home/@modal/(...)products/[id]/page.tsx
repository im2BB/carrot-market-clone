import CloseButton from "@/components/closeButton";
import ModalBackdrop from "@/components/ModalBackdrop";
import db from "@/lib/db";
import getSession from "@/lib/seeeion";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { notFound } from "next/navigation";

// async function getProducts() {
//   await new Promise((resolve) => setTimeout(resolve, 10000));
// }  스켈레톤 보고싶으면 사용

async function getIsOwner(userId: Number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

async function getProduct(id: number) {
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          username: true,
          avater: true,
        },
      },
    },
  });
  return product;
}

export default async function Modal({ params }: { params: { id: string } }) {
  // const Modal = await getProducts();  스켈레톤 보고싶으면 사용용
  const id = Number(params.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getProduct(id);
  if (!product) {
    return notFound();
  }

  return (
    <ModalBackdrop>
      <div
        className=" absolute gap-5 w-full h-full flex flex-col z-50 justify-center 
     bg-black bg-opacity-60 top-0 left-0"
      >
        <CloseButton />
        <div className="max-w-screen-sm h-1/2 w-full flex justify-center">
          <div
            className="relative aspect-square bg-neutral-700 rounded-md text-neutral-200
      flex justify-center items-center"
          >
            <Image
              fill
              className="object-cover"
              src={product.photo}
              alt={product.title}
            />
          </div>
        </div>
        <div className="text-white px-3">
          <div className="p-3 flex gap-5 border-b border-neutral-700 items-center">
            <div className="size-10 overflow-hidden rounded-full">
              {product.user.avater !== null ? (
                <Image
                  src={product.user.avater}
                  width={40}
                  height={40}
                  alt={product.user.username}
                />
              ) : (
                <UserIcon />
              )}
            </div>
            <h3 className="font-semibold ">{product.user.username}</h3>
          </div>
          <div className="p-5 flex justify-between ">
            <h1 className="text-2xl font-semibold">{product.title}</h1>
            <h1 className="font-semibold ">{formatToWon(product.price)}원</h1>
          </div>
          <div className="font-semibold p-3">
            <p>{product.description}</p>
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
}
