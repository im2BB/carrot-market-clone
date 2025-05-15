"use severe";
//"use client"; 내에선 사용 불가 그럴떈 따로 만들어어 사용 가능
// const handleForm = async () => {
// }; 로 해도 되고
export async function handleForm(prevState: any, formData: FormData) {
  console.log(prevState);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // redirect("/");
  return {
    errors: ["비밀번호가 틀렸습니다", "비밀번호가 너무 짧습니다"],
  };
}
