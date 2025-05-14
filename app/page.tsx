import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-gray-100 h-screen flex items-center justify-center p-5">
      <div
        className="bg-white shadow-lg p-5 rounded-3xl w-full 
      max-w-screen-sm flex flex-col gap-5"
      >
        <input
          className="w-full rounded-full h-10 
          bg-gray-100 pl-5 outline-none
          ring-3 ring-transparent focus:ring-orange-500 focus:ring-offset-2
          transition-shadow
          placeholder:drop-shadow"
          //여기서 h로 값을 지정할수있지만 또 py로 위아래 패딩값을 줘 크기를 지정할수있음
          type="text"
          placeholder="검색어를 입력하세요"
        />
        <button
          className="bg-gray-900/50 text-white py-2 rounded-full 
          focus:scale-90
          active:scale-90 transition-transform font-medium outline-none"
        >
          검색
        </button>
      </div>
    </main>
  );
}
