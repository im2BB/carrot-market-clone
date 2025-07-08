import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Page() {
  const cookieStore = await cookies();
  const session = cookieStore.get("delicious-karrot");

  // 로그인된 사용자는 home으로, 로그인되지 않은 사용자는 auth 페이지로
  if (session?.value) {
    redirect("/home");
  } else {
    // 로그인되지 않은 사용자는 auth 페이지로
    redirect("/login");
  }
}
