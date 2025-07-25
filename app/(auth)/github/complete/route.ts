import db from "@/lib/db";
import loginUser from "@/lib/login";
import { NextRequest } from "next/server";
import { redirect } from "next/navigation";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  console.log(
    "GitHub OAuth callback received, code:",
    code ? "exists" : "missing"
  );

  if (!code) {
    console.error("GitHub OAuth: No code received");
    return new Response(null, {
      status: 400,
    });
  }

  try {
    // 환경 변수 확인
    if (!process.env.GITHUB_CLIENT_ID || !process.env.GITHUB_CLIENT_SECRET) {
      console.error("GitHub OAuth: Missing environment variables");
      throw new Error("GitHub OAuth configuration is missing");
    }

    console.log("GitHub OAuth: Exchanging code for access token");
    const accessTokenParams = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }).toString();

    const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
    const accessTokenResponse = await fetch(accessTokenURL, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    });

    console.log(
      "GitHub OAuth: Access token response status:",
      accessTokenResponse.status
    );
    const { error, access_token } = await accessTokenResponse.json();

    if (error) {
      console.error("GitHub OAuth: Access token error:", error);
      return new Response(null, {
        status: 400,
      });
    }

    if (!access_token) {
      console.error("GitHub OAuth: No access token received");
      throw new Error("Failed to get access token");
    }

    console.log("GitHub OAuth: Getting user profile");
    const userProfileResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-cache",
    });

    console.log(
      "GitHub OAuth: User profile response status:",
      userProfileResponse.status
    );
    const { id, avatar_url, login } = await userProfileResponse.json();
    console.log("GitHub OAuth: User profile received for:", login);

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
      console.log("GitHub OAuth: Existing user found, logging in");
      await loginUser(user);
      console.log("GitHub OAuth: User logged in successfully");
      redirect("/home");
    } else {
      console.log("GitHub OAuth: Creating new user");
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
      console.log("GitHub OAuth: New user created with ID:", newUser.id);
      await loginUser(newUser);
      console.log("GitHub OAuth: New user logged in successfully");
      redirect("/home");
    }
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    console.error(
      "GitHub OAuth error stack:",
      error instanceof Error ? error.stack : "No stack trace"
    );
    redirect("/login?error=github_auth_failed");
  }
}
