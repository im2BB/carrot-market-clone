import { redirect } from "next/navigation";

export function GET() {
  const baseURL = "https://github.com/login/oauth/authorize";

  // 현재 배포된 URL 사용
  const getRedirectUri = () => {
    // Vercel에서 자동으로 제공하는 URL 사용
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL}/github/complete`;
    }
    // 수동으로 설정된 URL 사용
    if (process.env.NEXTAUTH_URL) {
      return `${process.env.NEXTAUTH_URL}/github/complete`;
    }
    // 알려진 배포 URL 사용
    return "https://carrot-market-clone-5oxroi5ea-im-2bs-projects.vercel.app/github/complete";
  };

  const params = {
    client_id: process.env.GITHUB_CLIENT_ID!,
    scope: "read:user,user:email",
    allow_signup: "true",
    redirect_uri: getRedirectUri(),
  };

  console.log("GitHub OAuth redirect_uri:", getRedirectUri());

  const formattedParams = new URLSearchParams(params).toString();
  const finalUrl = `${baseURL}?${formattedParams}`;
  return redirect(finalUrl);
}
