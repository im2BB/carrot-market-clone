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
  try {
    console.log("uploadProduct 시작");

    const photos = formData.getAll("photos");
    const data = {
      photos: photos,
      title: formData.get("title"),
      price: formData.get("price"),
      description: formData.get("description"),
      representativePhotoIndex: formData.get("representativePhotoIndex") || 0,
    };

    console.log("상품 데이터:", data);

    const result = productSchema.safeParse(data);
    if (!result.success) {
      console.error("상품 데이터 검증 실패:", result.error.flatten());
      return result.error.flatten();
    }

    const session = await getSession();
    if (!session.id) {
      console.error("사용자 세션이 없습니다.");
      return {
        fieldErrors: {
          title: ["로그인이 필요합니다."],
        },
      };
    }

    console.log("세션 확인됨:", session.id);

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

    console.log("상품이 성공적으로 생성되었습니다:", product.id);
    redirect(`/products/${product.id}`);
  } catch (error) {
    console.error("상품 업로드 중 오류 발생:", error);

    // redirect가 실패했을 경우를 대비한 처리
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error; // redirect는 그대로 전파
    }

    return {
      fieldErrors: {
        title: ["상품 등록 중 오류가 발생했습니다. 다시 시도해주세요."],
      },
    };
  }
}

// 이미지 없이 상품 등록하는 임시 함수
export async function uploadProductWithoutImage(_: any, formData: FormData) {
  try {
    console.log("uploadProductWithoutImage 시작");

    const data = {
      title: formData.get("title"),
      price: formData.get("price"),
      description: formData.get("description"),
    };

    console.log("이미지 없는 상품 데이터:", data);

    if (!data.title || !data.price || !data.description) {
      return {
        fieldErrors: {
          title: ["모든 필드를 입력해주세요."],
        },
      };
    }

    const session = await getSession();
    if (!session.id) {
      console.error("사용자 세션이 없습니다.");
      return {
        fieldErrors: {
          title: ["로그인이 필요합니다."],
        },
      };
    }

    console.log("세션 확인됨:", session.id);

    // 기본 이미지 URL 사용
    const defaultImageUrl =
      "https://imagedelivery.net/yaj69MDVrIu8_HJDUNcGIg/default-product-image";

    const product = await db.product.create({
      data: {
        title: data.title as string,
        description: data.description as string,
        price: Number(data.price),
        photo: defaultImageUrl,
        photos: [defaultImageUrl],
        representativePhotoIndex: 0,
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

    console.log("상품이 성공적으로 생성되었습니다:", product.id);
    redirect(`/products/${product.id}`);
  } catch (error) {
    console.error("상품 업로드 중 오류 발생:", error);

    // redirect가 실패했을 경우를 대비한 처리
    if (error instanceof Error && error.message.includes("NEXT_REDIRECT")) {
      throw error; // redirect는 그대로 전파
    }

    return {
      fieldErrors: {
        title: ["상품 등록 중 오류가 발생했습니다. 다시 시도해주세요."],
      },
    };
  }
}

export async function getUploadUrl() {
  try {
    console.log("getUploadUrl 시작");

    // 환경 변수 확인
    if (!process.env.CLOUDFLARE_ACCOUNT_ID || !process.env.CLOUDFLARE_API_KEY) {
      console.error("Cloudflare 환경 변수가 설정되지 않았습니다.");
      return {
        success: false,
        error: "이미지 업로드 서비스가 설정되지 않았습니다.",
      };
    }

    console.log("Cloudflare API 호출 시작");
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/images/v2/direct_upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.CLOUDFLARE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Cloudflare API 응답 상태:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "Cloudflare API 응답 오류:",
        response.status,
        response.statusText,
        errorText
      );
      return {
        success: false,
        error: `이미지 업로드 URL을 가져오는데 실패했습니다. (${response.status})`,
      };
    }

    const data = await response.json();
    console.log("Cloudflare API 응답 데이터:", data);

    if (data.success) {
      return {
        success: true,
        result: data.result,
      };
    } else {
      console.error("Cloudflare API 오류:", data.errors);
      return {
        success: false,
        error: "이미지 업로드 서비스에 문제가 있습니다.",
      };
    }
  } catch (error) {
    console.error("getUploadUrl 오류:", error);
    return {
      success: false,
      error: "이미지 업로드 서비스에 연결할 수 없습니다.",
    };
  }
}
