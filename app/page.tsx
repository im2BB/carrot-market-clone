import Image from "next/image";

export default function Home() {
  return (
    <main
      className="bg-gray-100 sm:bg-red-200 h-screen md:bg-green-200 
      lg:bg-blue-200 xl:bg-orange-100 2xl:bg-purple-100  
    flex items-center justify-center p-5"
      //테일윈드는 소형기기를 메인으로 잡는다 그리고 각 크기마다 지정한 값을 줄수있다
    >
      <div
        className="bg-white shadow-lg p-5 rounded-3xl w-full 
      max-w-screen-sm flex md:flex-row flex-col gap-5 *:outline-none
      ring ring-transparent transition-shadow
      has-[:invalid]:bg-red-100 has-[:invalid]"
        //*를 사용하면하위에 있는 자식 컨테이너들은 기본 값으로 적용됌
        //has를 사용하게되면 hsa뒤에 있는 값이 있는 하위 자식 컨테이너들에게 전부 적용
      >
        <input
          className="w-full rounded-full h-10 
          ring-3 ring-transparent focus:ring-green-500 focus:ring-offset-2
          transition-shadow
          placeholder:drop-shadow invalid:focus:ring-red-200 peer"
          //여기서 h로 값을 지정할수있지만 또 py로 위아래 패딩값을 줘 크기를 지정할수있음
          //invalid값도 따로 지정해 설정할수있어서 타입값이 다르면 required을 사용해 invalid로 경고성 색상을 출력가능
          //또한 invalid 뒤에 focus등을 넣어 추가로 기능을 활성화 할수있음
          //peer는 형제관계처럼 연결해줄수있음
          type="email"
          required
          placeholder="이메일을 입력하시오"
        />
        <span className="text-red-500 font-medium hidden peer-invalid:block">
          e-mail 값 입력은 필수입니다
        </span>
        <button
          className="text-white py-4 rounded-2xl 
          focus:scale-90 md:w-20
          bg-gray-600/50
          peer-required::bg-green-500
          "
          //bg-gradient-to-tr from-cyan-500 via-red-300 to-purple-400 그라데이션 주는 방법
        >
          로그인
        </button>
      </div>
    </main>
  );
}
