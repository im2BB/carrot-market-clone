import FormInput from "@/components/form-input";
import FormBtn from "@/components/from-btn";
import SocialLogin from "@/components/social-login";


export default function LogIn() {
  // const handleForm = async () => {
  // }; 로 해도 되고
  async function handleForm(formdata: FormData) {
    "use server";
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log("Here I'm baby");
  }

 
  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">로그인 시 이메일과 비밀번호를 입력하세요</h2>
      </div>
      <form action={handleForm} className="flex flex-col gap-3">
        <FormInput
          name="email"
          type="email"
          placeholder="e-mail"
          required
          errors={["email 형식이 아닙니다"]}
        />
        <FormInput
          name="password"
          type="password"
          placeholder="비밀번호"
          required
          errors={["비밀번호가 너무 짧습니다"]}
        />
        <FormBtn text={"로그인"} />
      </form>
      <SocialLogin text={" 로그인"} />
    </div>
  );
}
