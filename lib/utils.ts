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
