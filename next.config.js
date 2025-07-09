/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "imagedelivery.net",
      "cloudflare.com",
      "avatars.githubusercontent.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imagedelivery.net",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cloudflare.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  serverExternalPackages: ["@prisma/client"],
};

module.exports = nextConfig;
