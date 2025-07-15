import { getHomePageData } from "@/lib/actions/database";

// 홈페이지 데이터를 한번에 가져오는 최적화된 액션 (임시로 캐시 우회)
export async function getHomePageDataAction() {
  console.log("홈페이지 데이터 로딩 중...");
  const result = await getHomePageData();
  console.log("홈페이지 데이터 결과:", result);
  return result;
}
