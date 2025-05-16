"use server";

import { z } from "zod";
import validator from "validator";

const phoneSchema = z.string().trim().refine(validator.isMobilePhone);

const tokenSchema = z.coerce.number().min(100000).max(999999);
//coerce를 사용하면 변환을 할수 있음
// coerce.number 이런식이라면 문자열로 들어온다면 넘버로 변환

export async function smsLogin(prevState: any, formData: FormData) {
  console.log(typeof formData.get("token"));
  console.log(typeof tokenSchema.parse(formData.get("token")));
}
