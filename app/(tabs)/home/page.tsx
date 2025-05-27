import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma";
import { PlusIcon } from "@heroicons/react/24/solid";
import { unstable_cache as nextCache, revalidatePath } from "next/cache";
import Link from "next/link";

const getCachedProducts = nextCache(getInitialProducts, ["home-products"], {
  //revalidate: 60, 60초 마다가 아닌 유저가 들어온후 60초 후 새로고침을 하게되면 새로운 캐쉬를 받음
});

export const metadata = {
  title: "Home",
};

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },

    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>;

export default async function Products() {
  const initialProducts = await getCachedProducts();
  const revalidate = async () => {
    "use server";
    revalidatePath("/home");
  };
  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <form action={revalidate}>
        <button>검증</button>
      </form>
      <Link
        href="/add-products"
        className="bg-orange-500 flex items-center
      justify-center rounded-full size-12 fixed 
      bottom-24 right-8 text-white transition-colors 
      hover:bg-orange-400"
      >
        <PlusIcon className="size-8" />
      </Link>
    </div>
  );
}
