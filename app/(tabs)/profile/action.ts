import { getUserProfile } from "@/lib/actions/database";

// 프로필 정보 불러오기
export async function getProfile() {
  return await getUserProfile();
}
