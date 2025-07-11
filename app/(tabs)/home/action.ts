import {
  getRecentProducts,
  getEvents,
  getRecentPosts,
} from "@/lib/actions/database";

// 최근 등록 상품 불러오기
export async function getRecentProductsAction() {
  return await getRecentProducts(9);
}

// 이벤트 목록 불러오기
export async function getEventsAction() {
  return await getEvents();
}

// 최근 게시물 불러오기
export async function getRecentPostsAction() {
  return await getRecentPosts(5);
}
