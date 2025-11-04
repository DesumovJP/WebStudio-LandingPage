import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizations
  compress: true,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-backend.up.railway.app', // ← заміни на свій Strapi backend
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
