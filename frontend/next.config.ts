import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ Production optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,

  // ✅ Image optimization
  images: {
    domains: [
      'webstudio-landingpage-production.up.railway.app',
      'webbie-tau.vercel.app',
      'res.cloudinary.com',
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
    formats: ['image/webp'], // ❌ прибрано 'image/avif' для стабільності
  },
};

export default nextConfig;
