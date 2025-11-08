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

  React.useEffect(() => {
    if (!ref.current) return;
    const node = ref.current;
    
    // Use native CSS animation instead of MUI Fade for better performance
    if (visible) {
      node.style.opacity = '1';
      node.style.transform = 'translateY(0)';
      return;
    }

    // Optimized IntersectionObserver with rootMargin for earlier trigger
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
        rootMargin: '50px', // Start animation earlier for smoother experience
      }
    );
    
    observerRef.current.observe(node);
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
    };
  }, [threshold, visible]);

  const duration = durationMs / 1000; // Convert to seconds

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


