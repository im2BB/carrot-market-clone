import type { NextConfig } from "next";
// import withPWA from "next-pwa";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "avatars.githubusercontent.com",
      },
      {
        hostname: "imagedelivery.net",
      },
    ],
  },
  output: "standalone",
  // Windows 환경에서 빌드 최적화
  swcMinify: true,
  // 정적 자산 최적화
  compress: true,
  // 프로덕션 빌드 최적화
  productionBrowserSourceMaps: false,
  // 모든 페이지를 동적으로 렌더링
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
    forceSwcTransforms: true,
  },
  async headers() {
    return [
      {
        source: "/github/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
