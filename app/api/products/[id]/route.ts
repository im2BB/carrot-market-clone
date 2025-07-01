import { getProductById } from "@/lib/actions/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }) {
  try {
    const product = await getProductById(+params.id);

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
