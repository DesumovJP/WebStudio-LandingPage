#!/usr/bin/env node

/**
 * Generate Strapi secret keys for Railway
 * Usage: node generate-secrets.js
 */

const crypto = require('crypto');

function generateSecret() {
  return crypto.randomBytes(32).toString('base64');
}

console.log('🔐 Strapi Secret Keys Generator\n');
console.log('Copy these values to Railway → Settings → Variables:\n');
console.log('─'.repeat(60));

// Generate APP_KEYS (4 keys)
const appKeys = Array.from({ length: 4 }, () => generateSecret());
console.log('\nAPP_KEYS=' + appKeys.join(','));

// Generate other secrets
console.log('\nADMIN_AUTH_SECRET=' + generateSecret());
console.log('\nJWT_SECRET=' + generateSecret());
console.log('\nAPI_TOKEN_SALT=' + generateSecret());
console.log('\nTRANSFER_TOKEN_SALT=' + generateSecret());
console.log('\nENCRYPTION_KEY=' + generateSecret());

console.log('\n' + '─'.repeat(60));
console.log('\n✅ Copy all values above to Railway → Settings → Variables');
console.log('⚠️  Keep these secrets secure! Do not commit them to git.\n');

