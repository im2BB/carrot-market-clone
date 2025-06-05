"use client";

import { InitialChatMessages } from "@/app/chats/[id]/page";
import { formatToTimeAgo } from "@/lib/utils";
import { use, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowUpCircleIcon } from "@heroicons/react/24/solid";
import { createClient } from "@supabase/supabase-js";

const SUPERBAES_PUBLIC_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6Z2psdG9hZGZlY29qZ25xdHFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwOTg3MTAsImV4cCI6MjA2NDY3NDcxMH0.LeiHr9Nn6LlV7nZxUiLw-SYE3kWVTNlEAq1z2NQvraU";
const SUPERBASES_URL = "https://zzgjltoadfecojgnqtql.supabase.co";

interface ChatMessagesListProps {
  initialMessages: InitialChatMessages;
  userId: number;
  chatRoomId: string;
}

export default function ChatMessagesList({
  initialMessages,
  userId,
  chatRoomId,
}: ChatMessagesListProps) {
  const [messsages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setMessage(value);
  };
  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessages((prevMsgs) => [
      ...prevMsgs,
      {
        id: Date.now(),
        payload: message,
        created_at: new Date(),
        userId,
        user: {
          username: "string",
          avater: "xxxx",
        },
      },
    ]);
    setMessage("");
  };
  useEffect(() => {
    const client = createClient(SUPERBAES_PUBLIC_KEY, SUPERBASES_URL);
    const channel = client.channel(`room-${chatRoomId}`);
    channel.on("broadcast", { event: "message" } (payload));
  }, []);
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
      <form className="flex relative w-full" onSubmit={onSubmit}>
        보낼 메시지
        <input
          required
          onChange={onChange}
          value={message}
          className="bg-transparent rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition ring-neutral-200 focus:ring-neutral-50 border-none placeholder:text-neutral-400"
          type="text"
          name="message"
          placeholder="메시지를 입력하세요..."
        />
        <button className="absolute right-0">
          <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
        </button>
      </form>
    </div>
  );
}
