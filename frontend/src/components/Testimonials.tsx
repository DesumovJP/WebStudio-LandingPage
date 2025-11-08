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

  const nextTestimonial = React.useCallback(() => {
    setIsAnimating(false);
    setProgress(0);
    setTimeout(() => {
      setIndex((i) => (i + 1) % testimonials.length);
      setIsAnimating(true);
    }, 300); // Small delay for smooth transition
  }, [testimonials.length]);

  React.useEffect(() => {
    if (testimonials.length === 0 || !isAnimating) return;
    
    const duration = 5000; // 5 seconds
    const interval = 16; // ~60fps
    const increment = (100 / duration) * interval;
    
    const timer = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + increment;
        if (nextProgress >= 100) {
          nextTestimonial();
          return 0;
        }
        return nextProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isAnimating, nextTestimonial, testimonials.length]);

  // Reset progress when index changes
  React.useEffect(() => {
    setProgress(0);
    setIsAnimating(true);
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
            width: `${progress}%`,
            transition: isAnimating ? 'width 0.1s linear' : 'none'
          }}
        />
      </div>
    </Box>
  );
});

export default Testimonials;


