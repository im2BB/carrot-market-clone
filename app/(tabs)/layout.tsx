import TabBar from "@/components/tab-bar";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

export default async function TabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session.id) {
    redirect("/");
  }

  return (
    <div className="relative flex flex-col min-h-screen pb-16">
      {children}
      <div className="fixed  bottom-0  w-full max-w-screen-sm mx-auto ">
        <TabBar />
      </div>
    </div>
  );
}
