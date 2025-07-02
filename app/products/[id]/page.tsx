import db from "@/lib/db";
import getSession from "@/lib/seeeion";
import { formatToWon } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/16/solid";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { deleteProductAction } from "./actions";
import BackButton from "@/components/back-button";

async function getIsOwner(userId: number) {
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
  const resolvedParams = await params;
  const product = await getProduct(Number(resolvedParams.id));
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
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);
  if (isNaN(id)) {
    return notFound();
  }
  const product = await getProduct(id);
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
      <div className=" relative aspect-square">
        <Image
          fill
          className="object-cover"
          src={`${product.photo}/public`}
          alt={product.title}
        />
      </div>
      <div className="p-5 flex flex-col gap-3 border-b border-neutral-700">
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
        {isOwner ? (
          <form
            action={async () => {
              "use server";
              await deleteProductAction(product.id);
            }}
          >
            <button
              className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold"
              type="submit"
            >
              삭제하기
            </button>
          </form>
        ) : null}
        <form action={createChatRoom}>
          <button
            className="bg-orange-500 px-5 py-2.5 rounded-md
           text-white font-semibold"
          >
            채팅하기
          </button>
        </form>
        <BackButton />
      </div>
    </div>
  );
}
