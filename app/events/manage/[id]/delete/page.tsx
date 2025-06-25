import db from "@/lib/db";
import { notFound } from "next/navigation";
import DeleteEventForm from "./DeleteEventForm";

export const metadata = {
  title: "이벤트 삭제",
};

async function getEvent(id: string) {
  try {
    const event = await db.event.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    return event;
  } catch (error) {
    console.error("이벤트 조회 중 오류 발생:", error);
    return null;
  }
}

export default async function DeleteEventPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEvent(params.id);

  if (!event) {
    notFound();
  }

  return (
    <div className="p-7 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-red-500">이벤트 삭제</h1>
        <p className="text-neutral-400">이벤트를 삭제하시겠습니까?</p>
      </div>
      <DeleteEventForm event={event} />
    </div>
  );
} 