/**
 * URL utilities
 * Centralized URL management for images and assets
 */

import { env } from '@/config/env';
import { fixStrapiUrl } from '@/utils/fixStrapiUrl';

/**
 * Get Strapi upload URL
 */
export function getStrapiUrl(path: string): string {
  if (!path) return '';
  
  // If path is already a full URL, normalize and return
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return fixStrapiUrl(path);
  }
  
  // If path already starts with /uploads/, just prepend API_URL
  if (path.startsWith('/uploads/')) {
    return fixStrapiUrl(`${env.API_URL}${path}`);
  }
  
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Construct full URL and normalize
  return fixStrapiUrl(`${env.API_URL}/uploads/${cleanPath}`);
}

/**
 * Get image URL with fallback
 */
export function getImageUrl(path: string | undefined, fallback?: string): string {
  if (!path) return fallback || '/landing-placeholder.svg';
  
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return fixStrapiUrl(path);
  }
  
  // If path starts with /uploads/, it's a Strapi upload, not a local asset
  if (path.startsWith('/uploads/')) {
    return getStrapiUrl(path);
  }
  
  // Other paths starting with / are local public assets
  if (path.startsWith('/')) {
    return path;
  }
  
  // Relative paths are treated as Strapi uploads
  return getStrapiUrl(path);
}

