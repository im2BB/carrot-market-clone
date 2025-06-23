import FloatingButton from "@/components/floating-button";
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
  title: "쇼핑",
};

// export const dynamic = "force-dynamic";  정직인 페이지를 동적인 페이지로 변경
export const revalidate = 60; //정적인 페이지 이지만 60초후 페이지 정보 다시 받아오게 변경

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
  const initialProducts = await getInitialProducts();
  const revalidate = async () => {
    "use server";
    revalidatePath("/product");
  };
  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      {/* <form action={revalidate}>
        <button>검증</button>
      </form> */}
      <FloatingButton href="/add-products">
        <PlusIcon className="size-8" />
      </FloatingButton>
    </div>
  );
}
