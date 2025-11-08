/**
 * Performance utilities
 * Detects device capabilities and applies optimizations
 */

/**
 * Detect if device is low-end based on hardware concurrency and memory
 */
export function isLowEndDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check for hardware concurrency (CPU cores)
  const cores = navigator.hardwareConcurrency || 4;
  
  // Check for device memory (if available)
  const memory = (navigator as any).deviceMemory || 4;
  
  // Check for connection (if available)
  const connection = (navigator as any).connection;
  const slowConnection = connection && (
    connection.effectiveType === 'slow-2g' || 
    connection.effectiveType === '2g' ||
    connection.saveData === true
  );
  
  // Low-end if: < 4 cores OR < 4GB RAM OR slow connection
  return cores < 4 || memory < 4 || slowConnection === true;
}

/**
 * Check if backdrop-filter is supported and performant
 */
export function shouldUseBackdropFilter(): boolean {
  if (typeof window === 'undefined') return true;
  
  // Disable backdrop-filter on low-end devices
  if (isLowEndDevice()) return false;
  
  // Check for backdrop-filter support
  if (typeof CSS !== 'undefined' && CSS.supports) {
    return CSS.supports('backdrop-filter', 'blur(1px)') || 
           CSS.supports('-webkit-backdrop-filter', 'blur(1px)');
  }
  
  return true;
}

/**
 * Get reduced motion preference
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Throttle function for performance
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function(this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function(this: any, ...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

