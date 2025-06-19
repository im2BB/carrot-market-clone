export default async function home() {
  return (
    <div className="p-7">
      <div className="p-8 flex justify-center items-center">
        <p className="text-6xl">당근이려나</p>
      </div>
      <div className="flex justify-center items-center gap-3">
        <input
          className="bg-transparent rounded-md w-full
            h-10 foucus:outline-none ring-2 focus:ring-4
            transition
            ring-neutral-200 focus:ring-orange-500 border-none
            "
          placeholder="검색어를 입력하세요"
        />
        <button
          className="primary-btn h-10 w-12
    disabled:bg-neutral-400 disabled:text-neutral-300
    disabled:cursor-not-allowed"
        >
          검색
        </button>
      </div>
      <div className=" p-10 flex justify-center items-center">
        <p>이벤트 슬라이드</p>
      </div>
      <div className="p-10 flex justify-center items-center">
        <p>최근 등록 상품</p>
      </div>
    </div>
  );
}
