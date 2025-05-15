import FormInput from "@/components/Input";
import FormBtn from "@/components/button";

export default function SMSLogIn() {
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS 로그인</h1>
        <h2 className="text-xl">핸드폰 번호를 입력하세요</h2>
      </div>
      <form className="flex flex-col gap-3">
        <FormInput
          type="number"
          placeholder="번호를 입력하세요"
          required
          errors={["email 형식이 아닙니다"]}
        />
        <FormInput
          type="number"
          placeholder="인증번호를 입력하세요"
          required
          errors={["비밀번호가 너무 짧습니다"]}
        />

        <FormBtn loading={false} text={"인증번호 확인"} />
      </form>
    </div>
  );
}
