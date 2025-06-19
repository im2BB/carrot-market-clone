import Button from "@/components/button";
import db from "@/lib/db";
import getSession from "@/lib/seeeion";
import { UserIcon } from "@heroicons/react/24/outline";
import { redirect } from "next/navigation";

export default async function Profile() {
  const session = await getSession();

  if (!session.id) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <p className="text-gray-400 text-center">로그인이 필요합니다</p>
      </div>
    );
  }

  const user = await db.user.findUnique({
    where: {
      id: session.id,
    },
    include: {
      _count: {
        select: {
          products: true,
          posts: true,
        },
      },
    },
  });

  if (!user) return null;

  const logOut = async () => {
    "use server";
    const session = await getSession();
    await session.destroy();
    redirect("/");
  };

  return (
    <div className="p-5 gap-5">
      <div className="flex justify-between">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-white" />
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
        <div className="flex-1">
          <span className="text-white font-medium block">
            {user._count.products}
          </span>
          <span className="text-sm text-gray-400">판매상품</span>
        </div>
        <div className="flex-1">
          <span className="text-white font-medium block">
            {user._count.posts}
          </span>
          <span className="text-sm text-gray-400">게시글</span>
        </div>
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
