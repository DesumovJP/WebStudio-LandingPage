/**
 * Environment configuration
 * Centralized environment variables with defaults
 */

export const env = {
  // API & Backend
  API_URL: process.env.NEXT_PUBLIC_API_URL || process.env.STRAPI_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:1337'),
  
  // Resend Email
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  CONTACT_EMAIL: process.env.CONTACT_EMAIL || 'shimakunjp@gmail.com',
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  
  // Site URL for production
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000'),
} as const;

// Validation
if (env.IS_PRODUCTION && !env.RESEND_API_KEY) {
  console.warn('⚠️ RESEND_API_KEY is not set in production');
}

export default env;

