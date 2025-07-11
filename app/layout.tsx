import type { Metadata } from "next";
import { Sunflower } from "next/font/google";
import "./globals.css";
import AutoLogout from "@/components/auto-logout";
import InstallPrompt from "@/components/install-prompt";
import PWAStatus from "@/components/pwa-status";

const SunflowerKR = Sunflower({
  subsets: ["latin"],
  weight: ["300", "500", "700"],
  style: ["normal"],
});

export const metadata: Metadata = {
  title: "당근당근!",
  description: "당근마켓 클론 - 중고 거래 플랫폼",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "당근당근",
    startupImage: [
      {
        url: "/pwa-icon.svg",
        media:
          "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/pwa-icon.svg",
        media:
          "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "당근당근",
    title: "당근당근 마켓",
    description: "당근마켓 클론 - 중고 거래 플랫폼",
    images: [
      {
        url: "/pwa-icon.svg",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "당근당근 마켓",
    description: "당근마켓 클론 - 중고 거래 플랫폼",
    images: ["/pwa-icon.svg"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/pwa-icon.svg", type: "image/svg+xml" },
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🥕</text></svg>",
        type: "image/svg+xml",
      },
    ],
    shortcut: "/pwa-icon.svg",
    apple: [
      { url: "/pwa-icon.svg", sizes: "180x180", type: "image/svg+xml" },
      { url: "/pwa-icon.svg", sizes: "192x192", type: "image/svg+xml" },
      { url: "/pwa-icon.svg", sizes: "512x512", type: "image/svg+xml" },
    ],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f97316" },
    { media: "(prefers-color-scheme: dark)", color: "#1f2937" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="당근당근" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#f97316" />
        <meta name="msapplication-tap-highlight" content="no" />
        <link rel="apple-touch-icon" href="/pwa-icon.svg" />
        <link rel="icon" type="image/svg+xml" href="/pwa-icon.svg" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/pwa-icon.svg" color="#f97316" />
        <link rel="shortcut icon" href="/pwa-icon.svg" />
      </head>
      <body
        className={`${SunflowerKR.className} bg-neutral-900 text-white max-w-screen-sm mx-auto`}
      >
        <AutoLogout />
        <PWAStatus />
        <InstallPrompt />
        {children}
      </body>
    </html>
  );
}
