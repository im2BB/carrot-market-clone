import Image from "next/image";
import Link from "next/link";
import { formatToTimeAgo, getSafeAvatarSrc } from "@/lib/utils";
import db from "@/lib/db";
import getSession from "@/lib/session";
import DeleteChatButton from "./delete-chat-button";
import { UserIcon } from "@heroicons/react/24/solid";

async function getChatList() {
  const session = await getSession();
  if (!session.id) return [];

  const chats = await db.chatRoom.findMany({
    where: {
      users: {
        some: {
          id: session.id,
        },
      },
    },
    include: {
      users: {
        where: {
          NOT: {
            id: session.id,
          },
        },
        select: {
          username: true,
          avater: true,
        },
      },
      messages: {
        orderBy: {
          created_at: "desc",
        },
        take: 1,
      },
    },
    orderBy: {
      update_at: "desc",
    },
  });
  return chats;
}

export default async function ChatList() {
  const chats = await getChatList();

  return (
    <div className="flex flex-col gap-4 p-4">
      {chats.length > 0 ? (
        chats.map((chat) => {
          const otherUser = chat.users[0];
          const lastMessage = chat.messages[0];
          const avatarSrc = getSafeAvatarSrc(otherUser?.avater);

          return (
            <Link
              href={`/chats/${chat.id}`}
              key={chat.id}
              className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-md hover:bg-orange-50 dark:hover:bg-neutral-800 group transition-colors"
            >
              <div className="relative size-12 bg-gray-200 dark:bg-neutral-600 rounded-full overflow-hidden flex items-center justify-center">
                {avatarSrc && avatarSrc !== "/기본사용자.jpg" ? (
                  <Image
                    fill
                    src={avatarSrc}
                    alt={otherUser?.username || "사용자"}
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxAAPwCdABmX/9k="
                  />
                ) : (
                  <UserIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-black dark:text-white">
                    {otherUser?.username || "알 수 없는 사용자"}
                  </span>
                  <div className="flex items-center gap-2">
                    {lastMessage && (
                      <span className="text-sm text-gray-500 dark:text-neutral-500">
                        {formatToTimeAgo(lastMessage.created_at.toString())}
                      </span>
                    )}
                    <DeleteChatButton chatRoomId={chat.id} />
                  </div>
                </div>
                {lastMessage && (
                  <p className="text-sm text-gray-600 dark:text-neutral-400 truncate">
                    {lastMessage.payload}
                  </p>
                )}
              </div>
            </Link>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center pt-64 gap-4">
          <p className="text-gray-500 dark:text-neutral-400 text-lg">
            채팅 내역이 없습니다
          </p>
          <p className="text-gray-400 dark:text-neutral-500 text-sm">
            상품 상세 페이지에서 채팅을 시작해보세요
          </p>
        </div>
      )}
    </div>
  );
}
