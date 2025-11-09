"use client";

import React from "react";
import { Box } from "@mui/material";
import { useDict } from "@/i18n/DictContext";
import StrapiImage from "@/components/StrapiImage";

const Testimonials = React.memo(function Testimonials() {
  const { dict } = useDict();
  const testimonials = (dict?.testimonials ?? []) as Array<{
    quote: string;
    author: string;
    role: string;
    avatar?: string;
  }>;

  const [index, setIndex] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [isAnimating, setIsAnimating] = React.useState(true);
  const animationFrameRef = React.useRef<number | null>(null);
  const startTimeRef = React.useRef<number | null>(null);
  const lastUpdateRef = React.useRef<number>(0);
  const isMobileRef = React.useRef<boolean>(false);

  // Detect mobile device for performance optimization
  React.useEffect(() => {
    isMobileRef.current = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                          (typeof window !== 'undefined' && window.innerWidth < 768);
  }, []);

  const nextTestimonial = React.useCallback(() => {
    setIsAnimating(false);
    setProgress(0);
    startTimeRef.current = null;
    lastUpdateRef.current = 0;
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setTimeout(() => {
      setIndex((i) => (i + 1) % testimonials.length);
      setIsAnimating(true);
    }, 300); // Small delay for smooth transition
  }, [testimonials.length]);

  // Optimized animation using requestAnimationFrame with throttling for mobile
  React.useEffect(() => {
    if (testimonials.length === 0 || !isAnimating) return;
    
    const duration = 5000; // 5 seconds
    // Throttle updates on mobile (update every 2 frames instead of every frame)
    const throttleInterval = isMobileRef.current ? 2 : 1;
    let frameCount = 0;
    
    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
        lastUpdateRef.current = timestamp;
      }
      
      const elapsed = timestamp - startTimeRef.current;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      
      // Throttle updates on mobile for better performance
      frameCount++;
      if (frameCount % throttleInterval === 0 || newProgress >= 100) {
        setProgress(newProgress);
        lastUpdateRef.current = timestamp;
      }
      
      if (newProgress >= 100) {
        nextTestimonial();
      } else {
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isAnimating, nextTestimonial, testimonials.length]);

  // Reset progress when index changes
  React.useEffect(() => {
    setProgress(0);
    setIsAnimating(true);
    startTimeRef.current = null;
  }, [index]);

  if (testimonials.length === 0) return null;

  const t = testimonials[index];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Box className="glass" sx={{ borderRadius: "2rem", position: "relative" }}>
      <div className="testimonial">
        <div key={index} className="testimonial-content">
          <div className="testimonial-avatar">
            <StrapiImage src={t.avatar} alt={t.author} width={112} height={112} />
          </div>
          <p className="testimonial-quote">"{t.quote}"</p>
          <p className="testimonial-author">— {t.author}<span className="testimonial-role"> -  {t.role}</span></p>
        </div>
      </div>
      {/* Progress bar */}
      <div className="testimonial-progress-container">
        <div 
          className="testimonial-progress-bar"
          style={{ 
            transform: `scaleX(${progress / 100})`,
            transformOrigin: 'left',
          }}
        />
      </div>
    </Box>
  );
});

export default Testimonials;


