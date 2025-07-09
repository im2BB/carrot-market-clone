import db from "@/lib/db";
import loginUser from "@/lib/login";
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const accessTokenParams = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID!,
      client_secret: process.env.GITHUB_CLIENT_SECRET!,
      code,
    }).toString();
    const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
    const accessTokenResponse = await fetch(accessTokenURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    });
    const { error, access_token } = await accessTokenResponse.json();
    if (error) {
      return new Response(null, {
        status: 400,
      });
    }
    const userProfileResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-cache",
    });
    const { id, avatar_url, login } = await userProfileResponse.json();

    // 기존 사용자 확인
    const user = await db.user.findUnique({
      where: {
        github_id: id + "",
      },
      select: {
        id: true,
      },
    });

    if (user) {
      await loginUser(user);
      redirect("/home");
    } else {
      // 새 사용자 생성
      const newUser = await db.user.create({
        data: {
          username: login,
          github_id: id + "",
          avater: avatar_url,
        },
        select: {
          id: true,
        },
      });
      await loginUser(newUser);
      redirect("/home");
    }
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    redirect("/login?error=github_auth_failed");
  }
}
