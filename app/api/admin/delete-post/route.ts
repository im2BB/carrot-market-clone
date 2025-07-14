import { deletePost } from "@/lib/actions/delete";
import { isAdmin } from "@/lib/actions/admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // 관리자 권한 확인
    const adminCheck = await isAdmin();
    if (!adminCheck) {
      return NextResponse.json(
        { error: "관리자 권한이 필요합니다." },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const postId = formData.get("postId") as string;

    if (!postId) {
      return NextResponse.json(
        { error: "게시글 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const result = await deletePost(parseInt(postId));

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "게시글이 삭제되었습니다.",
      });
    } else {
      return NextResponse.json(
        { error: result.error || "게시글 삭제에 실패했습니다." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("게시글 삭제 API 오류:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
