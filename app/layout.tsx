import type { Metadata } from "next";
import { Sunflower } from "next/font/google";
import "./globals.css";

const SunflowerKR = Sunflower({
  subsets: ["latin"],
  weight: ["300", "500", "700"],
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
        className={`${SunflowerKR.className} bg-neutral-900 text-white max-w-screen-sm mx-auto`}
      >
        {children}
      </body>
    </html>
  );
}
