import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

//middleware는 모든 페이지에서 전부 실행됨
//middleware는 다른 이름으로  설정할수없음 config등도 마찬가지

interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
  "/": true,
  "/login": true,
  "/create-account": true,
  "/github/start": true,
  "/github/complete": true,
};

export async function middleware(request: NextRequest) {
  // 미들웨어를 일시적으로 비활성화
  return NextResponse.next();

  // try {
  //   const session = await getSession();
  //   const isPublicPage = publicOnlyUrls[request.nextUrl.pathname];

  //   // 로그인하지 않은 사용자
  //   if (!session.id) {
  //     // 비공개 페이지에 접근하려고 하면 초기 페이지로 리다이렉트
  //     if (!isPublicPage) {
  //       return NextResponse.redirect(new URL("/", request.url));
  //     }
  //   } else {
  //     // 로그인한 사용자가 공개 페이지(로그인, 회원가입 등)에 접근하면 홈으로 리다이렉트
  //     if (isPublicPage) {
  //       return NextResponse.redirect(new URL("/home", request.url));
  //     }
  //   }
  // } catch (error) {
  //   console.error("Middleware session error:", error);
  //   // 세션 오류가 발생하면 요청을 그대로 통과시킴
  //   return NextResponse.next();
  // }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
