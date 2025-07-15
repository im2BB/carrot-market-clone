import { getCachedProductById } from "@/lib/actions/database";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import BackButton from "@/components/back-button";
import { toggleSoldStatus } from "./action";
import ProductImageSlider from "@/components/ProductImageSlider";
import db from "@/lib/db";

async function getIsOwner(userId: Number) {
  const session = await getSession();
  if (session.id) {
    return session.id === userId;
  }
  return false;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getCachedProductById(Number(id));
  return {
    title: product?.title || "상품 정보",
    description: product?.description || "상품 상세 정보",
  };
}

export default async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const productId = Number(id);
  if (isNaN(productId)) {
    return notFound();
  }

  // 캐시된 함수 사용으로 성능 향상
  const product = await getCachedProductById(productId);
  if (!product) {
    return notFound();
  }

  const isOwner = await getIsOwner(product.userId);

  // 이미지 배열 처리 (기존 photo 필드와 새로운 photos 배열 모두 지원)
  const images =
    product.photos && product.photos.length > 0
      ? product.photos
      : product.photo
      ? [product.photo]
      : ["/기본사용자.jpg"];

  const createChatRoom = async () => {
    "use server";
    const session = await getSession();
    const room = await db.chatRoom.create({
      data: {
        users: {
          connect: [
            {
              id: product.userId,
            },
            {
              id: session.id,
            },
          ],
        },
      },
      select: {
        id: true,
      },
    });
    redirect(`/chats/${room.id}`);
  };

  const handleToggleSold = async () => {
    "use server";
    await toggleSoldStatus(productId);
  };

  return (
    <div className="relative">
      <BackButton fallbackUrl="/products" position="right" />
      <ProductImageSlider
        images={images}
        representativeIndex={product.representativePhotoIndex || 0}
        productId={productId}
        isOwner={isOwner}
      />

      <div className="p-5 flex flex-col gap-3 border-b border-gray-200 dark:border-neutral-700">
        <div className="size-10 overflow-hidden rounded-full bg-white flex items-center justify-center">
          {product.user.avater ? (
            <Image
              src={product.user.avater}
              width={40}
              height={40}
              alt={product.user.username}
              className="w-full h-full object-cover"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          ) : (
            <UserIcon className="w-6 h-6 text-gray-600" />
          )}
        </div>
        <div>
          <h3 className="text-black dark:text-white">
            {product.user.username}
          </h3>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-semibold text-black dark:text-white">
            {product.title}
          </h1>
          {product.sold && (
            <span className="bg-red-500 text-white text-sm px-2 py-1 rounded">
              판매 완료
            </span>
          )}
        </div>
        <p className="mt-3 text-gray-700 dark:text-neutral-300">
          {product.description}
        </p>
      </div>
      <div
        className="fixed w-full bottom-0 left-0 p-5 lb-10 
      bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-neutral-700 flex justify-between items-center"
      >
        <span className="font-semibold text-lg text-orange-500">
          {formatToWon(product.price)}원
        </span>
        <div className="flex gap-2">
          {isOwner ? (
            <form action={handleToggleSold}>
              <button
                className={`px-5 py-2.5 rounded-md text-white font-semibold transition-colors ${
                  product.sold
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
                }`}
              >
                {product.sold ? "판매 취소" : "판매 완료"}
              </button>
            </form>
          ) : (
            !product.sold && (
              <form action={createChatRoom}>
                <button
                  className="bg-orange-500 px-5 py-2.5 rounded-md
                 text-white font-semibold hover:bg-orange-600 transition-colors"
                >
                  채팅하기
                </button>
              </form>
            )
          )}
        </div>
      </div>
    </div>
  );
}
