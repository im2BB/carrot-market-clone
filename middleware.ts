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
  const seeeion = await getSession();
  const extists = publicOnlyUrls[request.nextUrl.pathname];
  if (!seeeion.id) {
    if (!extists) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    if (extists) {
      return NextResponse.redirect(new URL("/home", request.url));
    }
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
