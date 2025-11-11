"use client";

import { useEffect } from 'react';

/**
 * Fix viewport height for mobile browsers and in-app browsers (like Telegram)
 * This prevents content jumping when browser UI appears/disappears
 */
export default function ViewportFixer() {
  useEffect(() => {
    const setVH = () => {
      // Get the actual viewport height
      const vh = window.innerHeight * 0.01;
      // Set CSS custom property
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Set on initial load
    setVH();

    // Update on resize (debounced)
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(setVH, 100);
    };

    // Update on orientation change
    const handleOrientationChange = () => {
      setTimeout(setVH, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Telegram WebApp specific fixes
    if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
      const telegram = (window as any).Telegram.WebApp;
      telegram.ready();
      telegram.expand();
      
      // Listen to viewport changes in Telegram
      telegram.onEvent('viewportChanged', setVH);
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return null; // This component doesn't render anything
}

