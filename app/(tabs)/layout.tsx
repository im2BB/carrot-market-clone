import TabBar from "@/components/tab-bar";

export default function TabLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col min-h-screen pb-16">
      {children}
      <div className="fixed  bottom-0  w-full max-w-screen-sm mx-auto ">
        <TabBar />
      </div>
    </div>
  );
}
