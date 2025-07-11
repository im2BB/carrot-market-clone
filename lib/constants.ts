export const PASSWORD_MIN_LENGTH = 4;
export const PASSWORD_REGEX = new RegExp(
  /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[#?!@$%^&*-]).+$/
);
export const PASSWORD_REGEX_ERROR =
  "비밀번호에는 영문(대소문자 무관), 숫자, 특수문자가 각각 1개 이상 포함되어야 합니다.";
