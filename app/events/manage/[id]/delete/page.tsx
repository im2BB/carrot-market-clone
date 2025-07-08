import { getEventByIdAction } from "@/app/events/action";
import { notFound } from "next/navigation";
import DeleteEventForm from "./DeleteEventForm";

export const metadata = {
  title: "이벤트 삭제",
};

<<<<<<< HEAD
export default async function DeleteEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventByIdAction(+id);
=======
export default async function DeleteEventPage({ params }: { params: any }) {
  const event = await getEventByIdAction(+params.id);
>>>>>>> 0962e3e95f3bb7baf2113dfc6b88adf2c668d0d1
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
