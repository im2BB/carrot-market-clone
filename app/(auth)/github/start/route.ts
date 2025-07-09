import { redirect } from "next/navigation";

export function GET() {
  const baseURL = "https://github.com/login/oauth/authorize";

  // Vercel 환경에서의 올바른 URL 설정
  const getRedirectUri = () => {
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}/github/complete`;
    }
    if (process.env.NEXTAUTH_URL) {
      return `${process.env.NEXTAUTH_URL}/github/complete`;
    }
    return "http://localhost:3000/github/complete";
  };

  const params = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    scope: "read:user,user:email",
    allow_signup: "true",
    redirect_uri: getRedirectUri(),
  };

  const formattedParams = new URLSearchParams(params).toString();
  const finalUrl = `${baseURL}?${formattedParams}`;
  return redirect(finalUrl);
}
