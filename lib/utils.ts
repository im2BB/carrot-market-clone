export function formatToTimeAgo(date: string) {
  const dayInMs = 1000 * 60 * 60 * 24;
  const time = new Date(date).getTime();
  const now = new Date().getTime();
  const diff = Math.round((time - now) / dayInMs);

  const formatter = new Intl.RelativeTimeFormat("ko");
  //Intl.RelativeTimeFormat 날짜 변환기

  return formatter.format(diff, "days");
}

export function formatToWon(price: number) {
  return price.toLocaleString("ko-KR");
}

// 공통 기본 아바타 이미지 상수
export const DEFAULT_AVATAR = "/기본사용자.jpg";

// 아바타/프로필 이미지 안전 처리 함수
export function getSafeAvatarSrc(src?: string | null): string {
  if (!src || typeof src !== "string" || src.trim() === "") {
    return DEFAULT_AVATAR;
  }
  if (src.startsWith("data:image")) return src;
  if (src.startsWith("/")) return src;

  try {
    const url = new URL(src);
    if (
      url.hostname.includes("imagedelivery.net") ||
      url.hostname.includes("cloudflare")
    ) {
      if (src.includes("/public")) {
        return src;
      }
      return `${src}/width=200,height=200`;
    }
    if (url.protocol === "http:" || url.protocol === "https:") return src;
  } catch {
    return DEFAULT_AVATAR;
  }
  return DEFAULT_AVATAR;
}
