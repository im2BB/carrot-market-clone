"use client";

import { InitialChatMessages } from "@/app/(tabs)/chats/[id]/page";
import { formatToTimeAgo } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpCircleIcon, UserIcon } from "@heroicons/react/24/solid";
import { RealtimeChannel, createClient } from "@supabase/supabase-js";
import { saveMessageAction } from "@/app/(tabs)/chats/actions";
import BackButton from "./back-button";
import { ArrowLeftIcon } from "@heroicons/react/16/solid";

const SUPABASE_PUBLIC_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6Z2psdG9hZGZlY29qZ25xdHFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwOTg3MTAsImV4cCI6MjA2NDY3NDcxMH0.LeiHr9Nn6LlV7nZxUiLw-SYE3kWVTNlEAq1z2NQvraU";
const SUPABASE_URL = "https://zzgjltoadfecojgnqtql.supabase.co";

interface ChatMessageListProps {
  initialMessages: InitialChatMessages;
  userId: number;
  chatRoomId: string;
  username: string;
  avater: string;
}
export default function ChatMessagesList({
  initialMessages,
  userId,
  chatRoomId,
  username,
  avater,
}: ChatMessageListProps) {
  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");
  const channel = useRef<RealtimeChannel | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = event;
    setMessage(value);
  };
  const onSubmit = async (event: React.FormEvent) => {
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
          avater: "xxx",
        },
      },
    ]);
    channel.current?.send({
      type: "broadcast",
      event: "message",
      payload: {
        id: Date.now(),
        created_at: new Date(),
        payload: message,
        userId,
        user: {
          username,
          avater,
        },
      },
    });
    await saveMessageAction(message, chatRoomId);
    setMessage("");
  };
  // 메시지 스크롤을 맨 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const client = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);
    channel.current = client.channel(`room-${chatRoomId}`);
    channel.current
      .on("broadcast", { event: "message" }, (payload) => {
        setMessages((prevMsgs) => [...prevMsgs, payload.payload]);
      })
      .subscribe();
    return () => {
      channel.current?.unsubscribe();
    };
  }, [chatRoomId]);
  return (
    <div className="flex flex-col h-screen">
      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-24 scrollbar-hide">
        <div className="flex flex-col gap-5">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 items-start ${
                message.userId === userId ? "justify-end" : ""
              }`}
            >
              {message.userId === userId ? null : (
                <div className="size-8 rounded-full bg-gray-200 dark:bg-neutral-600 flex items-center justify-center overflow-hidden">
                  {message.user.avater && message.user.avater.trim() !== "" ? (
                    <Image
                      src={message.user.avater}
                      alt={message.user.username}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                      placeholder="blur"
                      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                    />
                  ) : (
                    <UserIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  )}
                </div>
              )}
              <div
                className={`flex flex-col gap-1 ${
                  message.userId === userId ? "items-end" : ""
                }`}
              >
                <span
                  className={`${
                    message.userId === userId
                      ? "bg-orange-500 text-white"
                      : "bg-gray-200 dark:bg-neutral-600 text-black dark:text-white"
                  } p-2.5 rounded-md`}
                >
                  {message.payload}
                </span>
                <span className="text-xs text-gray-500 dark:text-neutral-400">
                  {formatToTimeAgo(message.created_at.toString())}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 입력창 - 탭바 위에 고정 */}
      <div className="fixed bottom-16 mb-6 left-0 right-0 bg-white dark:bg-neutral-900 border-t border-gray-200 dark:border-neutral-700 p-4 sm:p-6 lg:p-8">
        <form
          className="flex relative max-w-screen-sm sm:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl mx-auto"
          onSubmit={onSubmit}
        >
          <input
            required
            onChange={onChange}
            value={message}
            className="bg-white dark:bg-neutral-800 rounded-full w-full h-10 focus:outline-none px-5 ring-2 focus:ring-4 transition ring-gray-200 dark:ring-neutral-200 focus:ring-orange-300 dark:focus:ring-neutral-50 border border-gray-300 dark:border-none placeholder:text-gray-500 dark:placeholder:text-neutral-400 text-black dark:text-white"
            type="text"
            name="message"
            placeholder="메시지를 입력하세요"
          />
          <button className="absolute right-0">
            <ArrowUpCircleIcon className="size-10 text-orange-500 transition-colors hover:text-orange-300" />
          </button>
        </form>
      </div>
    </div>
  );
}
