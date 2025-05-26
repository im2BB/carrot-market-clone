import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={` bg-neutral-900 text-white max-w-screen-sm mx-auto`}>
        {children}
      </body>
    </html>
  );
}
