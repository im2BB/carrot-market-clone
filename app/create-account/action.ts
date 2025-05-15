"use server";
import { z } from "zod";

const usernameSchema = z.string().min(5).max(10);

const checkUesrname = (uesrname: string) => !uesrname.includes("potato");
const checkPassword = ({
  password,
  comfirm_Password,
}: {
  password: string;
  comfirm_Password: string;
}) => password === comfirm_Password;

const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "문자로만 가능해요!",
        required_error: "닉네임을 입력해주세요",
      })
      .min(3, "닉네임이 너무 짧아요~")
      .max(10, "닉네임이 너무 길어요~~~~~")
      .refine(checkUesrname, "potato는 안되요~"),

    email: z
      .string({
        invalid_type_error: "이메일을 입력해주세요",
        required_error: "이메일을 입력해주세요",
      })
      .email("이메일을 입력해주세요"),
    password: z
      .string({
        invalid_type_error: "특수문자는 불가능해요!",
        required_error: "비밀번호를 입력해주세요",
      })
      .min(10, "비밀번호가 너무 짧아요"),
    comfirm_Password: z
      .string({
        invalid_type_error: "특수문자는 불가능해요!",
        required_error: "비밀번호를 입력해주세요",
      })
      .min(10, "비밀번호가 너무 짧아요"),
  })
  .refine(checkPassword, {
    message: "비밀번호 틀렸습니다, 다시 한번 확인해주세요.",
    path: ["comfirm_Password"],
  });

export async function createAccount(prevState: any, formData: FormData) {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    comfirm_Password: formData.get("comfirm_Password"),
  };
  const result = formSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  }
}
