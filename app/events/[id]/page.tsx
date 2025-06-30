import { getEventByIdAction } from "@/app/events/action";
import { notFound } from "next/navigation";
import Image from "next/image";
import BackButton from "@/components/back-button";

export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEventByIdAction(+params.id);

  if (!event) {
    notFound();
  }

  const DEFAULT_IMAGE = "/기본사용자.jpg";
  function getSafeImageSrc(src?: string) {
    if (!src || typeof src !== "string" || src.trim() === "")
      return DEFAULT_IMAGE;
    if (src.startsWith("data:image")) return src;
    if (src.startsWith("/")) return src;

    try {
      const url = new URL(src);
      if (
        url.hostname.includes("imagedelivery.net") ||
        url.hostname.includes("cloudflare")
      ) {
        if (src.includes("/public")) {
          return src;
        }
        return `${src}/width=800,height=600`;
      }
      if (url.protocol === "http:" || url.protocol === "https:") return src;
    } catch {
      return DEFAULT_IMAGE;
    }
    return DEFAULT_IMAGE;
  }

  const imgSrc = getSafeImageSrc(event.image);
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  const now = new Date();
  const isActive = now >= startDate && now <= endDate;
  const isUpcoming = now < startDate;
  const isEnded = now > endDate;

  return (
    <div className="p-7 flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-5">
        <BackButton />
        <h1 className="text-2xl font-bold">이벤트 상세</h1>
      </div>

      <div className="bg-neutral-800 rounded-lg  overflow-hidden">
        <div className="relative h-96  w-full">
          {imgSrc.startsWith("data:image") ||
          imgSrc.startsWith("/") ||
          imgSrc.startsWith("http") ? (
            <Image
              src={imgSrc}
              alt={event.title}
              fill
              className="object-cover bg-white"
              unoptimized={imgSrc.includes("imagedelivery.net")}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              No Image
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">{event.title}</h1>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                isActive
                  ? "bg-orange-400 text-white"
                  : isUpcoming
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-600 text-white"
              }`}
            >
              {isActive ? "진행중" : isUpcoming ? "예정" : "종료"}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-orange-500 mb-2">
                이벤트 설명
              </h3>
              <p className="text-neutral-300 whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            <div className="flex gap-5  ">
              <div className="flex gap-5 ">
                <h3 className="text-lg font-semibold text-orange-500 mb-2">
                  시작일
                </h3>
                <p className="text-neutral-300">
                  {startDate.toLocaleDateString("ko-KR")}{" "}
                  {startDate.toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <p>~</p>
              <div className="flex gap-4">
                <h3 className="text-lg font-semibold text-orange-500 mb-2">
                  종료일
                </h3>
                <p className="text-neutral-300">
                  {endDate.toLocaleDateString("ko-KR")}{" "}
                  {endDate.toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <hr className="border-neutral-700" />
            <div className="flex gap-4  *:text-xs ">
              <div className="flex gap-5">
                <h3 className=" text-neutral-500">등록자</h3>
                <p className="text-neutral-300">{event.user.username}</p>
              </div>
              <div className="flex gap-5">
                <h3 className="text-neutral-500">등록일</h3>
                <p className="text-neutral-300">
                  {new Date(event.created_at).toLocaleDateString("ko-KR")}
                </p>
              </div>
              {event.link && (
                <div>
                  <h3 className="text-lg font-semibold text-orange-500 mb-2">
                    관련 링크
                  </h3>
                  <a
                    href={event.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-neutral-500 hover:text-neutral-600 underline break-all"
                  >
                    {event.link}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
