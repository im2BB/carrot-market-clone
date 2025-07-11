"use server";

import { z } from "zod";
import db from "@/lib/db";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const productSchema = z.object({
  photos: z.array(z.string()).min(1, "최소 1장의 사진을 넣어주세요."),
  title: z.string({
    required_error: "제목을 입력해주세요.",
  }),
  description: z.string({
    required_error: "내용을 입력해주세요.",
  }),
  price: z.coerce.number({
    required_error: "가격을 입력해주세요.",
  }),
  representativePhotoIndex: z.coerce.number().default(0),
});

export async function uploadProduct(_: any, formData: FormData) {
  const photos = formData.getAll("photos");
  const data = {
    photos: photos,
    title: formData.get("title"),
    price: formData.get("price"),
    description: formData.get("description"),
    representativePhotoIndex: formData.get("representativePhotoIndex") || 0,
  };

  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const product = await db.product.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
          photo: result.data.photos[0], // 기존 photo 필드에 첫 번째 이미지 저장 (호환성)
          photos: result.data.photos,
          representativePhotoIndex: result.data.representativePhotoIndex,
          user: {
            connect: {
              id: session.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
      redirect(`/products/${product.id}`);
    }
  }
}

export async function getUploadUrl() {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
      },
    }
  );
  const data = await response.json();
  return data;
}
