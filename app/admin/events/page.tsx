import { getAdminEvents, toggleEventActive } from "@/lib/actions/admin";
import { deleteEvent } from "@/lib/actions/delete";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import Image from "next/image";
import Link from "next/link";

// 관리자 이벤트 삭제 액션
async function adminDeleteEvent(eventId: number) {
  "use server";

  try {
    const result = await deleteEvent(eventId);
    if (result.success) {
      return { success: true, message: "이벤트가 삭제되었습니다." };
    } else {
      return {
        success: false,
        message: result.error || "이벤트 삭제에 실패했습니다.",
      };
    }
  } catch (error) {
    console.error("이벤트 삭제 오류:", error);
    return { success: false, message: "이벤트 삭제에 실패했습니다." };
  }
}

// 관리자 이벤트 활성화/비활성화 토글 액션
async function adminToggleEvent(eventId: number) {
  "use server";

  try {
    return await toggleEventActive(eventId);
  } catch (error) {
    console.error("이벤트 상태 변경 오류:", error);
    return { success: false, message: "이벤트 상태 변경에 실패했습니다." };
  }
}

export default async function AdminEventsPage() {
  const { events, totalEvents } = await getAdminEvents(0, 20);

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white">
            이벤트 관리
          </h1>
          <p className="text-sm lg:text-base text-neutral-400">
            총 {totalEvents}개의 이벤트가 등록되어 있습니다
          </p>
        </div>
        <Link
          href="/add-event"
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
        >
          새 이벤트 추가
        </Link>
      </div>

      {/* 데스크톱 테이블 뷰 */}
      <div className="hidden lg:block bg-neutral-800 shadow-lg rounded-lg border border-neutral-700">
        <div className="px-6 py-4 border-b border-neutral-700">
          <h3 className="text-lg font-medium text-white">이벤트 목록</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-700">
            <thead className="bg-neutral-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  이벤트
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  기간
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  생성자
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  상태
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  생성일
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-300 uppercase tracking-wider">
                  액션
                </th>
              </tr>
            </thead>
            <tbody className="bg-neutral-800 divide-y divide-neutral-700">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <Image
                          src={event.image || "/placeholder-image.png"}
                          alt={event.title}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">
                          {event.title}
                        </div>
                        <div className="text-sm text-neutral-400">
                          {event.description?.substring(0, 50)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">
                      {new Date(event.start_date).toLocaleDateString("ko-KR")}
                    </div>
                    <div className="text-sm text-neutral-400">
                      ~ {new Date(event.end_date).toLocaleDateString("ko-KR")}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-white">
                      {event.user.username}
                    </div>
                    <div className="text-sm text-neutral-400">
                      {event.user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        event.isActive
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {event.isActive ? "활성" : "비활성"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {formatDistanceToNow(new Date(event.created_at), {
                      addSuffix: true,
                      locale: ko,
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      href={`/events/${event.id}`}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      보기
                    </Link>
                    <form
                      action={adminToggleEvent.bind(null, event.id)}
                      className="inline"
                    >
                      <button
                        type="submit"
                        className="text-orange-400 hover:text-orange-300 transition-colors"
                      >
                        {event.isActive ? "비활성화" : "활성화"}
                      </button>
                    </form>
                    <form
                      action={adminDeleteEvent.bind(null, event.id)}
                      className="inline"
                    >
                      <button
                        type="submit"
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        삭제
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 모바일 카드 뷰 */}
      <div className="lg:hidden space-y-3">
        <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700">
          <h3 className="text-base font-medium text-white mb-3">이벤트 목록</h3>
        </div>
        {events.map((event) => (
          <div
            key={event.id}
            className="bg-neutral-800 rounded-lg p-4 border border-neutral-700"
          >
            <div className="flex gap-3 mb-3">
              <div className="flex-shrink-0">
                <Image
                  src={event.image || "/placeholder-image.png"}
                  alt={event.title}
                  width={60}
                  height={60}
                  className="w-15 h-15 rounded-lg object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="text-sm font-medium text-white truncate">
                    {event.title}
                  </h4>
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ml-2 ${
                      event.isActive
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {event.isActive ? "활성" : "비활성"}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mb-1">
                  {event.description?.substring(0, 60)}...
                </p>
                <div className="text-xs text-neutral-400">
                  {new Date(event.start_date).toLocaleDateString("ko-KR")} ~{" "}
                  {new Date(event.end_date).toLocaleDateString("ko-KR")}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-neutral-700 rounded p-2">
                <div className="text-xs text-neutral-400">생성자</div>
                <div className="text-sm text-white">{event.user.username}</div>
                <div className="text-xs text-neutral-400 truncate">
                  {event.user.email}
                </div>
              </div>
              <div className="bg-neutral-700 rounded p-2">
                <div className="text-xs text-neutral-400">생성일</div>
                <div className="text-sm text-white">
                  {formatDistanceToNow(new Date(event.created_at), {
                    addSuffix: true,
                    locale: ko,
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Link
                href={`/events/${event.id}`}
                className="px-3 py-1 text-xs font-medium bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
              >
                보기
              </Link>
              <form
                action={adminToggleEvent.bind(null, event.id)}
                className="inline"
              >
                <button
                  type="submit"
                  className="px-3 py-1 text-xs font-medium bg-orange-500 hover:bg-orange-600 text-white rounded transition-colors"
                >
                  {event.isActive ? "비활성화" : "활성화"}
                </button>
              </form>
              <form
                action={adminDeleteEvent.bind(null, event.id)}
                className="inline"
              >
                <button
                  type="submit"
                  className="px-3 py-1 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded transition-colors"
                >
                  삭제
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
