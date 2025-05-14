import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts.jsx,tsx,mdx}",
    "./componets/**/*.{js,ts.jsx,tsx,mdx}",
    "./app/**/*.{js,ts.jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
  plugins: [],
};

export default config;
