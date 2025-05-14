export default function Home() {
  return (
    <main className="h-screen bg-gray-100 flex items-center justify-center p-5">
      <div
        className="bg-white shadow-lg p-5 rounded-3xl w-full 
      max-w-screen-sm flex flex-col gap-3"
      >
        {["2B", "Me", "You", "Yourself"].map((person, index) => (
          <div
            key={index}
            className="flex items-center gap-5 group
          " //odd는 홀수 위치에 even 은 짝수 예)odd:bg-gray-200 even:bg-cyan-100
            //last는 마지막값을 지정해 줄수있음 반대로 first로 하면 첫번째 값 예)last:border-0
          >
            <div className="size-10 bg-blue-400 rounded-full" />
            <span
              className="text-lg font-medium group-hover:text-red-500
            empty:w-24 empty:h-5 empty:rounded-full empty:animate-pulse empty:bg-gray-300"
              //empty로 값이 비워져 있을때 상태를 따로 설정해줄수 있음
              //group은 부모에 주고 그 아래 자식 에 group을 이용해 각 상태에 값을 지정해줄수 있음
              //px 값으로 설정하고 싶다면 예)h-[101.569px] 이런식으로 입력 가능
              //색상값도 bg[#7d45b4] 이런식으로 값을 주면 됌
            >
              {person}
            </span>
            <div
              className="size-6  bg-red-500 text-white flex 
            items-center justify-center rounded-full relative"
              //animate을 줄수있음 씨바꺼 존나게 간단하네 예) animate-bounce
              //그리고 스켈레톤을 만들때 animate-pulse 쓰면 깜빡이는 효과를 한번에 끝!!!!
            >
              <span className="z-10">{index}</span>
              <div className="size-6 bg-red-500 rounded-full absolute animate-ping" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
