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
    <div className="min-h-screen bg-neutral-900 text-white">
      <main className="pb-20 pwa-safe-area">{children}</main>
      <TabBar />
    </div>
  );
}
