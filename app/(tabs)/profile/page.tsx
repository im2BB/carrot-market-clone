import { getProfile } from "@/app/(tabs)/profile/action";
import { UserIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSafeAvatarSrc, DEFAULT_AVATAR } from "@/lib/utils";

export const metadata = {
  title: "내 정보",
};

// 동적 렌더링 강제
export const dynamic = "force-dynamic";

export default async function Profile() {
  const user = await getProfile();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <p className="text-gray-400 text-center">로그인이 필요합니다</p>
      </div>
    );
  }

  const logOut = async () => {
    "use server";
    const cookieStore = await cookies();
    cookieStore.set("delicious-karrot", "", { maxAge: 0, path: "/" });
    redirect("/login");
  };

  const avatarSrc = getSafeAvatarSrc(user.avater);

  return (
    <div className="p-5 gap-5">
      <div className="flex justify-between">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden">
            {avatarSrc !== DEFAULT_AVATAR ? (
              <Image
                src={avatarSrc}
                alt={user.username}
                width={64}
                height={64}
                className="w-full h-full object-cover"
                unoptimized={avatarSrc.includes("imagedelivery.net")}
              />
            ) : (
              <UserIcon className="w-8 h-8 text-gray-600" />
            )}
          </div>
          <div>
            <h3 className="text-white font-medium text-lg">{user.username}</h3>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>
        <div className="p-3">
          {" "}
          <a
            href="/profile/edit"
            className="primary-btn h-8 w-24 flex items-center justify-center"
          >
            프로필 수정
          </a>
        </div>
      </div>
      <div className="flex gap-4 text-center border-y border-neutral-800 py-4">
        <Link
          href="/profile/my-products"
          className="flex-1 hover:bg-neutral-800 rounded-lg p-2 transition-colors"
        >
          <span className="text-white font-medium block">
            {user._count.products}
          </span>
          <span className="text-sm text-gray-400">판매상품</span>
        </Link>
        <Link
          href="/profile/my-posts"
          className="flex-1 hover:bg-neutral-800 rounded-lg p-2 transition-colors"
        >
          <span className="text-white font-medium block">
            {user._count.posts}
          </span>
          <span className="text-sm text-gray-400">게시글</span>
        </Link>
      </div>
      <div className="flex p-5 gap-5 items-center justify-center border-y border-neutral-800">
        <a
          href="/add-event"
          className="primary-btn h-8 w-24 flex items-center justify-center mt-2"
        >
          이벤트 등록
        </a>
        <a
          href="/events/manage"
          className="primary-btn h-8 w-24 flex items-center justify-center mt-2"
        >
          이벤트 관리
        </a>
      </div>
      <form
        className="gap-2 p-8 flex justify-center items-center"
        action={logOut}
      >
        <button
          className="
          primary-btn h-8 w-1/2 
          disabled:bg-neutral-400 disabled:text-neutral-300
          disabled:cursor-not-allowed"
        >
          로그 아웃
        </button>
      </form>
    </div>
  );
}
