"use client";

import React from "react";

type RevealProps = {
  children: React.ReactNode;
  threshold?: number;
  durationMs?: number;
};

export default React.memo(function Reveal({ children, threshold = 0.1, durationMs = 450 }: RevealProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = React.useState(false);
  const observerRef = React.useRef<IntersectionObserver | null>(null);
  const [isMobile, setIsMobile] = React.useState(false);

  // Detect mobile for optimized settings
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
        (typeof window !== 'undefined' && window.innerWidth < 768)
      );
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  React.useEffect(() => {
    if (!ref.current) return;
    const node = ref.current;
    
    // Use native CSS animation instead of MUI Fade for better performance
    if (visible) {
      node.style.opacity = '1';
      node.style.transform = 'translateY(0)';
      return;
    }

    // Optimized IntersectionObserver with larger rootMargin on mobile for earlier trigger
    const rootMargin = isMobile ? '200px' : '50px';
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (observerRef.current) {
              observerRef.current.disconnect();
              observerRef.current = null;
            }
          }
        });
      },
      { 
        threshold,
        rootMargin, // Larger margin on mobile for content to appear before scrolling into view
      }
    );
    
    observerRef.current.observe(node);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [threshold, visible, isMobile]);

  // Faster animation on mobile for snappier feel
  const duration = (isMobile ? Math.min(durationMs * 0.7, 300) : durationMs) / 1000;

  return (
    <div 
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(2rem)',
        transition: `opacity ${duration}s cubic-bezier(0.4, 0, 0.2, 1), transform ${duration}s cubic-bezier(0.4, 0, 0.2, 1)`,
        willChange: visible ? 'auto' : 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
});


