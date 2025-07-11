declare module "next-pwa" {
  import { NextConfig } from "next";

  interface PWAConfig {
    dest?: string;
    register?: boolean;
    skipWaiting?: boolean;
    runtimeCaching?: any[];
    fallbacks?: {
      image?: string;
      document?: string;
      font?: string;
      audio?: string;
      video?: string;
    };
    cacheOnFrontEndNav?: boolean;
    reloadOnOnline?: boolean;
    sw?: string;
    publicExcludes?: string[];
    buildExcludes?: (string | RegExp)[];
    dynamicStartUrl?: boolean;
    dynamicStartUrlRedirect?: string;
    cacheStartUrl?: boolean;
    cleanupOutdatedCaches?: boolean;
    disable?: boolean;
  }

  function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;

  export default withPWA;
}
