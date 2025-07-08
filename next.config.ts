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
  experimental: {
    serverComponentsExternalPackages: [],
  },
  output: "standalone",
  distDir: ".next",
};

export default nextConfig;
