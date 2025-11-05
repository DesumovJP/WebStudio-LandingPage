import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizations
  compress: true,

  // Image optimization
  images: {
    domains: [
      'webstudio-landingpage-production.up.railway.app',
      'webbie-tau.vercel.app',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'webstudio-landingpage-production.up.railway.app',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/uploads/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Performance optimizations
  poweredByHeader: false,

  // React strict mode
  reactStrictMode: true,

  // Source maps (disable for smaller builds)
  productionBrowserSourceMaps: false,
};

export default nextConfig;
