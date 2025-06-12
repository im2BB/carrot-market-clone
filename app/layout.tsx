import type { Metadata } from "next";
import { Jua, Gamja_Flower } from "next/font/google";
import "./globals.css";

const jua = Jua({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  variable: "--jua-text",
});

const gamja = Gamja_Flower({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  variable: "--gamja-text",
});

export const metadata: Metadata = {
  title: "당근당근!",
  description: "당근당근? 당근!!",
};

export default function RootLayout({
  children,
}: //@ts-ignore

Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`s ${jua.className}  bg-neutral-900 text-white max-w-screen-sm mx-auto`}
      >
        {children}
      </body>
    </html>
  );
}
