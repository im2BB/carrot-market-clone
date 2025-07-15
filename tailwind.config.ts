import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts.jsx,tsx,mdx}",
    "./components/**/*.{js,ts.jsx,tsx,mdx}",
    "./app/**/*.{js,ts.jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sunflower: ["Sunflower", "sans-serif"],
      },
      margin: {
        "top-a-lot": "120px",
      },
      borderRadius: {
        "sexy-name": "11.11px",
      },
    },
  },
  //이런식으로 테마에 각 값을 지정하는 커스터마이징을 할수있음
  //테일윈드는 컴파일러기 때문에 각 클래스 네임에 입력한 값을 그때 그때 생성
  //현재 v4는 개발도구론 ok 배포 단계라면 X 아직 완벽하지 않고 호환 문제가 발생할수 있음
  plugins: [require("@tailwindcss/forms")],
};

export default config;
