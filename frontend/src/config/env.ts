/**
 * Environment configuration
 * Centralized environment variables with defaults
 * 
 * Development: використовує localhost для API та Site URL
 * Production: використовує змінні середовища з Vercel/Railway
 */

const isDevelopment = process.env.NODE_ENV !== 'production';

export const env = {
  // API & Backend
  // Development: локальний Strapi на порту 1337
  // Production: Railway Strapi URL з NEXT_PUBLIC_API_URL або fallback на production Railway
  API_URL: 
    process.env.NEXT_PUBLIC_API_URL || 
    process.env.STRAPI_URL || 
    (isDevelopment 
      ? 'http://localhost:1337' 
      : 'https://webstudio-landingpage-production.up.railway.app'),
  
  // Resend Email
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  CONTACT_EMAIL: process.env.CONTACT_EMAIL || 'shimakunjp@gmail.com',
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: !isDevelopment,
  IS_DEVELOPMENT: isDevelopment,
  
  // Site URL
  // Development: локальний Next.js на порту 3000
  // Production: Vercel URL з NEXT_PUBLIC_SITE_URL
  SITE_URL: 
    process.env.NEXT_PUBLIC_SITE_URL || 
    (isDevelopment ? 'http://localhost:3000' : ''),
} as const;

// Validation
if (env.IS_PRODUCTION && !env.RESEND_API_KEY) {
  console.warn('⚠️ RESEND_API_KEY is not set in production');
}

if (env.IS_PRODUCTION && !env.API_URL) {
  console.warn('⚠️ NEXT_PUBLIC_API_URL is not set in production');
}

export default env;

