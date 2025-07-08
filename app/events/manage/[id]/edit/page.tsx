import { getEventByIdAction } from "@/app/events/action";
import { notFound } from "next/navigation";
import EditEventForm from "./EditEventForm";

export const metadata = {
  title: "이벤트 수정",
};

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventByIdAction(+id);
  if (!event) {
    notFound();
  }

  return (
    <div className="p-7 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">이벤트 수정</h1>
        <p className="text-neutral-400">이벤트 정보를 수정하세요.</p>
      </div>
      <EditEventForm event={event} />
    </div>
  );
}
