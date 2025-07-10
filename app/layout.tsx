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
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🥕</text></svg>",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/favicon.svg",
    apple: [{ url: "/favicon.svg", sizes: "180x180", type: "image/svg+xml" }],
  },
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
