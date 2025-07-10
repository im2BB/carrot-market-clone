import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import BackButton from "@/components/back-button";

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
  const product = await getProduct(Number(id));
  return {
    title: product?.title,
  };
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
  const product = await getProduct(productId);
  if (!product) {
    return notFound();
  }
  const isOwner = await getIsOwner(product.userId);
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
  return (
    <div>
      <div className="relative aspect-square bg-white">
        <Image
          fill
          className="object-contain"
          src={`${product.photo}/public`}
          alt={product.title}
        />
      </div>
      <div className="p-5 flex flex-col gap-3 border-b border-neutral-700">
        <div className="size-10 overflow-hidden rounded-full bg-white flex items-center justify-center">
          {product.user.avater ? (
            <Image
              src={product.user.avater}
              width={40}
              height={40}
              alt={product.user.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <UserIcon className="w-6 h-6 text-gray-600" />
          )}
        </div>
        <div>
          <h3>{product.user.username}</h3>
        </div>
      </div>

      <div className="p-5">
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <p>{product.description}</p>
      </div>
      <div
        className="fixed w-full bottom-0 left-0 p-5 lb-10 
      bg-neutral-800 flex justify-between items-center"
      >
        <span className="font-semibold test-lg">
          {formatToWon(product.price)}원
        </span>
        <form action={createChatRoom}>
          <button
            className="bg-orange-500 px-5 py-2.5 rounded-md
           text-white font-semibold"
          >
            채팅하기
          </button>
        </form>
        <BackButton fallbackUrl="/products" />
      </div>
    </div>
  );
}
