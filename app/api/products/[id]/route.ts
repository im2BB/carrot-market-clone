import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import getSession from "@/lib/session";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = Number(id);
    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }
    const product = await db.product.findUnique({
      where: { id: productId },
      include: {
        user: {
          select: {
            username: true,
            avater: true,
          },
        },
      },
    });
    if (!product) {
      return NextResponse.json(null, { status: 404 });
    }
    // 대표 이미지 처리
    let representativePhoto = product.photo;
    if (Array.isArray(product.photos) && product.photos.length > 0) {
      const index =
        typeof product.representativePhotoIndex === "number"
          ? product.representativePhotoIndex
          : 0;
      representativePhoto = product.photos[index] || product.photos[0];
    }
    return NextResponse.json({ ...product, photo: representativePhoto });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = Number(id);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const session = await getSession();
    if (!session.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { representativePhotoIndex } = body;

    if (
      typeof representativePhotoIndex !== "number" ||
      representativePhotoIndex < 0
    ) {
      return NextResponse.json(
        { error: "Invalid representative photo index" },
        { status: 400 }
      );
    }

    // 상품 소유자 확인
    const product = await db.product.findUnique({
      where: { id: productId },
      select: { userId: true, photos: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.userId !== session.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 대표 이미지 인덱스가 유효한지 확인
    if (product.photos && representativePhotoIndex >= product.photos.length) {
      return NextResponse.json(
        { error: "Invalid representative photo index" },
        { status: 400 }
      );
    }

    // 대표 이미지 인덱스 업데이트
    const updatedProduct = await db.product.update({
      where: { id: productId },
      data: { representativePhotoIndex },
      select: { id: true, representativePhotoIndex: true },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Error updating representative photo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
