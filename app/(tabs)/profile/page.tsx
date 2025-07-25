import { getProfile } from "@/app/(tabs)/profile/action";
import { UserIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { getSafeAvatarSrc, DEFAULT_AVATAR } from "@/lib/utils";
import { isAdmin } from "@/lib/actions/admin";
import LogoutButton from "@/components/LogoutButton";

export const metadata = {
  title: "내 정보",
};

// 동적 렌더링 강제
export const dynamic = "force-dynamic";

export default async function Profile() {
  const user = await getProfile();
  const adminCheck = await isAdmin();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          로그인이 필요합니다
        </p>
      </div>
    );
  }

  const productCount = user._count?.products || 0;
  const postCount = user._count?.posts || 0;

  return (
    <div className="space-y-6 pt-5">
      <div className="px-5 flex items-center gap-3">
        <Image
          width={60}
          height={60}
          src={getSafeAvatarSrc(user.avater)}
          alt={user.username}
          className="size-14 rounded-full bg-white object-cover"
        />
        <div className="flex flex-col">
          <span className="text-lg font-semibold text-black dark:text-white">
            {user.username}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {user.email}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-center">
        <Link
          href="/profile/my-products"
          className="flex flex-col items-center p-3 transition-colors hover:bg-orange-400 rounded-lg text-black dark:text-white group"
        >
          <span className="text-2xl font-bold text-orange-500 group-hover:text-white transition-colors">
            {productCount}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-white transition-colors">
            상품
          </span>
        </Link>
        <Link
          href="/profile/my-posts"
          className="flex flex-col items-center p-3 transition-colors hover:bg-orange-400 rounded-lg text-black dark:text-white group"
        >
          <span className="text-2xl font-bold text-orange-500 group-hover:text-white transition-colors">
            {postCount}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-white transition-colors">
            게시글
          </span>
        </Link>
      </div>
      <div className="flex p-5 gap-5 items-center justify-center border-y border-gray-200 dark:border-neutral-800">
        <Link
          href="/add-products"
          className="primary-btn h-8 w-24 flex items-center justify-center mt-2"
        >
          상품 등록
        </Link>
        <Link
          href="/add-post"
          className="primary-btn h-8 w-24 flex items-center justify-center mt-2"
        >
          게시글 작성
        </Link>
      </div>
      <div className="space-y-3 px-5">
        <Link
          href="/profile/edit"
          className="flex items-center justify-between p-3 transition-colors hover:bg-orange-400 rounded-lg text-black dark:text-white group"
        >
          <span className="group-hover:text-white transition-colors">
            프로필 수정
          </span>
          <UserIcon className="size-5 text-gray-500 dark:text-gray-400 group-hover:text-white transition-colors" />
        </Link>
        <LogoutButton />
      </div>
    </div>
  );
}
