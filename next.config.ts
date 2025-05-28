import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
  typescript: {
    // !! 경고: 타입 체크를 건너뛰므로 권장되지 않습니다
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
