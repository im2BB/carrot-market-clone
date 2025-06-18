export default async function home() {
  return (
    <div className="p-7">
      <div className="p-8 flex justify-center items-center">
        <p className="text-6xl">당근이려나</p>
      </div>
      <div className="flex justify-center items-center gap-2">
        <input
          className="w-96 bg-neutral-400 rounded-lg text-white"
          placeholder="검색어를 입력하세요"
        />
        <button className="w-45 p-2  rounded-lg bg-orange-500">Serch</button>
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
