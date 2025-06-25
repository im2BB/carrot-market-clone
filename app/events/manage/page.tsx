import { getEvents } from "@/app/events/action";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import BackButton from "@/components/back-button";

export const metadata = {
  title: "이벤트 관리",
};

export default async function EventManagePage() {
  const events = await getEvents();

  const getEventStatus = (startDate: Date, endDate: Date) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return { status: "예정", color: "bg-blue-500" };
    if (now > end) return { status: "종료", color: "bg-red-500" };
    return { status: "진행중", color: "bg-green-500" };
  };

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
        // Cloudflare Images URL이 이미 완전한 형태인지 확인
        if (src.includes("/public")) {
          return src; // 이미 완전한 URL이면 그대로 사용
        }
        // 기존 형식에 width/height 추가
        return `${src}/width=300,height=300`;
      }
      if (url.protocol === "http:" || url.protocol === "https:") return src;
    } catch {
      return DEFAULT_IMAGE;
    }
    return DEFAULT_IMAGE;
  }

  return (
    <div className="p-7 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">이벤트 관리</h1>
        <Link
          href="/add-event"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          새 이벤트 등록
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-400 text-lg mb-4">
            등록된 이벤트가 없습니다.
          </p>
          <Link
            href="/add-event"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            첫 번째 이벤트 등록하기
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {events.map((event) => {
            const eventStatus = getEventStatus(
              event.start_date,
              event.end_date
            );
            const imgSrc = getSafeImageSrc(event.image);
            return (
              <div
                key={event.id}
                className="bg-neutral-800 rounded-lg p-6 border border-neutral-700"
              >
                <div className="flex items-start gap-6">
                  <div className="relative w-32 h-32 flex-shrink-0">
                    <img
                      src={imgSrc}
                      alt={event.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold">{event.title}</h3>
                      <span
                        className={`${eventStatus.color} text-white px-3 py-1 rounded-full text-sm font-medium`}
                      >
                        {eventStatus.status}
                      </span>
                    </div>
                    <p className="text-neutral-300 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-neutral-400 mb-4">
                      <div>
                        <span className="text-orange-400 font-medium">
                          기간:
                        </span>{" "}
                        {format(
                          new Date(event.start_date),
                          "yyyy년 MM월 dd일 HH:mm",
                          { locale: ko }
                        )}{" "}
                        ~{" "}
                        {format(
                          new Date(event.end_date),
                          "yyyy년 MM월 dd일 HH:mm",
                          { locale: ko }
                        )}
                      </div>
                      <div>
                        <span className="text-orange-400 font-medium">
                          등록일:
                        </span>{" "}
                        {format(
                          new Date(event.created_at),
                          "yyyy년 MM월 dd일",
                          { locale: ko }
                        )}
                      </div>
                    </div>
                    {event.link && (
                      <div className="text-sm text-neutral-400 mb-4">
                        <span className="text-orange-400 font-medium">
                          링크:
                        </span>
                        <a
                          href={event.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 underline ml-2"
                        >
                          {event.link}
                        </a>
                      </div>
                    )}
                    <div className="flex gap-3">
                      <Link
                        href={`/events/manage/${event.id}/edit`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        수정
                      </Link>
                      <Link
                        href={`/events/manage/${event.id}/delete`}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        삭제
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <BackButton />
    </div>
  );
}
