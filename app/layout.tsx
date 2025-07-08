import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["normal"],
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
    <html lang="kr">
      <body
        className={`${notoSansKR.className} bg-neutral-900 text-white max-w-screen-sm mx-auto`}
      >
        {children}
      </body>
    </html>
  );
}
