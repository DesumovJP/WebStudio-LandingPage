import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizations
  compress: true,
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
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
  
  // Production source maps (optional, disable for smaller builds)
  productionBrowserSourceMaps: false,
};

export default nextConfig;
