import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV !== 'production';

const nextConfig: NextConfig = {
  // ✅ Production optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  experimental: {
    optimizeCss: true, // Optimize CSS in production
  },

  // ✅ Image optimization
  images: {
    // Development: дозволяємо localhost для локального Strapi
    // Production: тільки production домени
    domains: isDevelopment
      ? [
          'localhost',
          '127.0.0.1',
          'webstudio-landingpage-production.up.railway.app',
          'webbie-tau.vercel.app',
          'res.cloudinary.com',
        ]
      : [
          'webstudio-landingpage-production.up.railway.app',
          'webbie-tau.vercel.app',
          'res.cloudinary.com',
        ],
    remotePatterns: [
      // Development: localhost для локального Strapi
      ...(isDevelopment
        ? [
            {
              protocol: 'http' as const,
              hostname: 'localhost',
              port: '1337',
              pathname: '/uploads/**',
            },
            {
              protocol: 'http' as const,
              hostname: '127.0.0.1',
              port: '1337',
              pathname: '/uploads/**',
            },
          ]
        : []),
      // Production: Railway та інші домени
      {
        protocol: 'https' as const,
        hostname: 'webstudio-landingpage-production.up.railway.app',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https' as const,
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
    formats: ['image/webp'], // ❌ прибрано 'image/avif' для стабільності
  },
};

export default nextConfig;
