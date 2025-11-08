"use client";

import React from "react";

interface DecorativeSpiderProps {
  size?: number;
  opacity?: number;
  className?: string;
  animated?: boolean;
}

export default function DecorativeSpider({ 
  size = 24, 
  opacity = 0.25,
  className = "",
  animated = true
}: DecorativeSpiderProps) {
  return (
    <div 
      className={`decorative-spider ${className} ${animated ? 'animated' : ''}`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        opacity
      }}
    >
      <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Spider abdomen - larger rounded body */}
        <ellipse cx="12" cy="14" rx="4.5" ry="5.5" fill="currentColor" />
        {/* Spider cephalothorax (head+thorax) - smaller and connected */}
        <circle cx="12" cy="7.5" r="2.8" fill="currentColor" />
        
        {/* Spider legs - 8 legs, more spider-like positioning */}
        {/* Left side legs - 4 legs */}
        <path d="M9.5 7.5L5 3M9.5 7.5L4 2" 
              stroke="currentColor" 
              strokeWidth="2.2" 
              strokeLinecap="round" />
        <path d="M8.5 9L3.5 6M8.5 9L2.5 5" 
              stroke="currentColor" 
              strokeWidth="2.2" 
              strokeLinecap="round" />
        <path d="M8.5 13L3.5 16M8.5 13L2.5 17" 
              stroke="currentColor" 
              strokeWidth="2.2" 
              strokeLinecap="round" />
        <path d="M9.5 15.5L5 20M9.5 15.5L4 21" 
              stroke="currentColor" 
              strokeWidth="2.2" 
              strokeLinecap="round" />
        
        {/* Right side legs - 4 legs */}
        <path d="M14.5 7.5L19 3M14.5 7.5L20 2" 
              stroke="currentColor" 
              strokeWidth="2.2" 
              strokeLinecap="round" />
        <path d="M15.5 9L20.5 6M15.5 9L21.5 5" 
              stroke="currentColor" 
              strokeWidth="2.2" 
              strokeLinecap="round" />
        <path d="M15.5 13L20.5 16M15.5 13L21.5 17" 
              stroke="currentColor" 
              strokeWidth="2.2" 
              strokeLinecap="round" />
        <path d="M14.5 15.5L19 20M14.5 15.5L20 21" 
              stroke="currentColor" 
              strokeWidth="2.2" 
              strokeLinecap="round" />
        
        {/* Eyes - 8 eyes arranged in typical spider pattern */}
        {/* Main pair - larger */}
        <circle cx="10.5" cy="6.5" r="0.9" fill="white" />
        <circle cx="13.5" cy="6.5" r="0.9" fill="white" />
        {/* Secondary pair */}
        <circle cx="9" cy="7.5" r="0.7" fill="white" />
        <circle cx="15" cy="7.5" r="0.7" fill="white" />
        {/* Smaller eyes */}
        <circle cx="9.5" cy="8.5" r="0.5" fill="white" />
        <circle cx="14.5" cy="8.5" r="0.5" fill="white" />
        <circle cx="10" cy="9" r="0.4" fill="white" />
        <circle cx="14" cy="9" r="0.4" fill="white" />
        
        {/* Eye pupils */}
        <circle cx="10.5" cy="6.5" r="0.5" fill="currentColor" />
        <circle cx="13.5" cy="6.5" r="0.5" fill="currentColor" />
        <circle cx="9" cy="7.5" r="0.4" fill="currentColor" />
        <circle cx="15" cy="7.5" r="0.4" fill="currentColor" />
        <circle cx="9.5" cy="8.5" r="0.3" fill="currentColor" />
        <circle cx="14.5" cy="8.5" r="0.3" fill="currentColor" />
        <circle cx="10" cy="9" r="0.25" fill="currentColor" />
        <circle cx="14" cy="9" r="0.25" fill="currentColor" />
      </svg>
    </div>
  );
}

