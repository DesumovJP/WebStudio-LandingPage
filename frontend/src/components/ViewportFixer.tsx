"use client";

import { useEffect } from 'react';

/**
 * Fix viewport height for mobile browsers and in-app browsers (like Telegram)
 * This prevents content jumping when browser UI appears/disappears
 */
export default function ViewportFixer() {
  useEffect(() => {
    // Detect Telegram WebView
    const isTelegramWebView = typeof window !== 'undefined' && (
      (window as any).Telegram?.WebApp ||
      navigator.userAgent.includes('Telegram')
    );

    const setVH = () => {
      // Get the actual viewport height
      const vh = window.innerHeight * 0.01;
      // Set CSS custom property
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Set on initial load
    setVH();

    // Apply Telegram-specific fixes
    if (isTelegramWebView) {
      document.documentElement.classList.add('telegram-webview');
      
      // Disable overscroll for stable scrolling in Telegram
      document.body.style.overscrollBehavior = 'none';
      
      // Prevent elastic scroll bounce
      document.body.style.position = 'relative';
      document.body.style.overflow = 'auto';
      
      // Force min-height for stability
      document.documentElement.style.minHeight = '100%';
      document.body.style.minHeight = '100%';
    }

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

    // Prevent scroll jumping during resize
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setVH();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Telegram WebApp specific API
    if ((window as any).Telegram?.WebApp) {
      const telegram = (window as any).Telegram.WebApp;
      telegram.ready();
      telegram.expand();
      telegram.disableVerticalSwipes(); // Prevent swipe-to-close
      
      // Listen to viewport changes in Telegram
      telegram.onEvent('viewportChanged', () => {
        setVH();
        // Force reflow to prevent jumps
        document.body.offsetHeight;
      });
    }

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return null; // This component doesn't render anything
}

