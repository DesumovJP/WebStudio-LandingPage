/**
 * URL utilities
 * Centralized URL management for images and assets
 */

import { env } from '@/config/env';

/**
 * Get Strapi upload URL
 */
export function getStrapiUrl(path: string): string {
  if (!path) return '';
  
  // If path is already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Construct full URL
  return `${env.API_URL}/uploads/${cleanPath}`;
}

/**
 * Get image URL with fallback
 */
export function getImageUrl(path: string | undefined, fallback?: string): string {
  if (!path) return fallback || '/landing-placeholder.svg';
  
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) {
    return path;
  }
  
  return getStrapiUrl(path);
}

