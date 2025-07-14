import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/actions/admin";
import Link from "next/link";

const adminMenuItems = [
  { href: "/admin/users", label: "사용자 관리", icon: "👥" },
  { href: "/admin/products", label: "상품 관리", icon: "📦" },
  { href: "/admin/posts", label: "게시글 관리", icon: "📝" },
  { href: "/admin/events", label: "이벤트 관리", icon: "🎉" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminCheck = await isAdmin();

  if (!adminCheck) {
    redirect("/login");
  }

  return (
    <div className="h-full w-full justify-center items-center bg-neutral-900">
      <div className="flex flex-col min-h-screen">
        {/* 상단 헤더 */}
        <header className="bg-neutral-800 shadow-sm border-b border-neutral-700">
          <div className="px-4 lg:px-6 py-4">
            <div className="flex items-center justify-between">
              <Link
                href="/admin"
                className="flex items-center gap-3 hover:text-orange-500 transition-colors"
              >
                <span className="text-xl lg:text-2xl">🥕</span>
                <h1 className="text-lg lg:text-xl font-bold text-white">
                  당근마켓 관리자
                </h1>
              </Link>
              <Link
                href="/"
                className="text-neutral-400 hover:text-orange-500 transition-colors text-sm lg:text-base"
              >
                <span className="mr-2">←</span>
                <span className="hidden sm:inline">메인 사이트로 돌아가기</span>
                <span className="sm:hidden">메인</span>
              </Link>
            </div>
          </div>
        </header>

        {/* 상단 네비게이션 */}
        <nav className="bg-neutral-800 border-b border-neutral-700">
          <div className="px-4 lg:px-6">
            <div className="flex space-x-1 overflow-x-auto">
              {adminMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-4 py-3 text-neutral-300 hover:bg-neutral-700 hover:text-orange-500 transition-colors rounded-t whitespace-nowrap text-sm lg:text-base"
                >
                  <span className="text-sm lg:text-base mr-2">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 p-4 lg:p-6 bg-neutral-900">{children}</main>
      </div>
    </div>
  );
}
