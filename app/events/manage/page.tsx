import { getEventsAction } from "@/app/events/action";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import BackButton from "@/components/back-button";
import { isAdmin } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "이벤트 관리",
};

export default async function EventManagePage() {
  const events = await getEventsAction();
  const adminCheck = await isAdmin();

  const getEventStatus = (startDate: Date, endDate: Date) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return { text: "예정", color: "bg-blue-500" };
    } else if (now > end) {
      return { text: "종료", color: "bg-gray-500" };
    } else {
      return { text: "진행중", color: "bg-green-500" };
    }
  };

  function getSafeImageSrc(src?: string) {
    if (!src) return DEFAULT_IMAGE;

    // 절대 URL인지 확인
    if (src.startsWith("http://") || src.startsWith("https://")) {
      return src;
    }

    // 상대 경로라면 기본 이미지 반환
    if (src.startsWith("/") || src.startsWith("./") || src.startsWith("../")) {
      return DEFAULT_IMAGE;
    }

    // Cloudflare Images URL 형식 확인
    if (src.includes("imagedelivery.net") || src.includes("cloudflare")) {
      return src;
    }

    // 알 수 없는 형식이면 기본 이미지 반환
    return DEFAULT_IMAGE;
  }

  return (
    <div className="p-7 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">이벤트 관리</h1>
        {adminCheck && (
          <Link
            href="/add-event"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            새 이벤트 등록
          </Link>
        )}
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-neutral-400 text-lg mb-4">
            등록된 이벤트가 없습니다.
          </p>
          {adminCheck && (
            <Link
              href="/add-event"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              첫 번째 이벤트 등록하기
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-6">
          {events.map((event) => {
            const eventStatus = getEventStatus(
              event.start_date,
              event.end_date
            );

            return (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="flex">
                  <div className="w-48 h-32">
                    <img
                      src={getSafeImageSrc(event.image)}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-semibold">{event.title}</h2>
                      <span
                        className={`${eventStatus.color} text-white px-3 py-1 rounded-full text-sm`}
                      >
                        {eventStatus.text}
                      </span>
                    </div>
                    <p className="text-neutral-600 mb-3 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="text-sm text-neutral-500 mb-4">
                      <p>
                        시작:{" "}
                        {format(new Date(event.start_date), "PPP", {
                          locale: ko,
                        })}
                      </p>
                      <p>
                        종료:{" "}
                        {format(new Date(event.end_date), "PPP", {
                          locale: ko,
                        })}
                      </p>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <Link
                          href={`/events/${event.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          상세 보기
                        </Link>
                        {adminCheck && (
                          <>
                            <span className="text-neutral-300">|</span>
                            <Link
                              href={`/events/manage/${event.id}/edit`}
                              className="text-orange-600 hover:text-orange-800 font-medium"
                            >
                              수정
                            </Link>
                            <span className="text-neutral-300">|</span>
                            <Link
                              href={`/events/manage/${event.id}/delete`}
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              삭제
                            </Link>
                          </>
                        )}
                      </div>
                      {event.link && (
                        <a
                          href={event.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-4 py-2 rounded font-medium transition-colors"
                        >
                          링크 열기
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8">
        <BackButton />
      </div>
    </div>
  );
}

const DEFAULT_IMAGE = "/placeholder-image.png";
