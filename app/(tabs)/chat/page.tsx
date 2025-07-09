import ChatList from "@/components/chat-list";

export const metadata = {
  title: "채팅",
};

// 동적 렌더링 강제
export const dynamic = "force-dynamic";

export default function Chat() {
  return (
    <div>
      <ChatList />
    </div>
  );
}
