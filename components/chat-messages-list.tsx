"use client";

import { InitialChatMessages } from "@/app/chats/[id]/page";
import { formatToTimeAgo } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";

interface ChatMessagesListProps {
  initialMessages: InitialChatMessages;
  userId: number;
}

export default function ChatMessagesList({
  initialMessages,
  userId,
}: ChatMessagesListProps) {
  const [messsages, setMesssages] = useState(initialMessages);
  return (
    <div className="p-5 flex flex-col gap-5 min-h-screen justify-end">
      {messsages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-4 items-star 
            ${message.userId === userId ? "justify-end" : ""}`}
        >
          {message.userId === userId ? null : (
            <Image
              src={message.user.avater!}
              alt={message.user.username}
              width={50}
              height={50}
              className="size-8 rounded-full"
            />
          )}
          <div
            className={`flex flex-col gap-1 ${
              message.userId === userId ? "items-end" : ""
            }`}
          >
            <span
              className={`${
                message.userId === userId ? "bg-neutral-500" : "bg-orange-500"
              }  p-2.5 rounded-md`}
            >
              {message.payload}
            </span>
            <span className="text-xs">
              {formatToTimeAgo(message.created_at.toString())}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
