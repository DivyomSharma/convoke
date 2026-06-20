"use client";

import React from "react";
import { motion } from "framer-motion";

interface CircularMarqueeProps {
  className?: string;
  size?: number;
  duration?: number;
  text?: string;
}

export function CircularMarquee({ 
  className = "", 
  size = 400, 
  duration = 25,
  text = "CONVOKE • FOR PEOPLE BUILDING THE FUTURE • "
}: CircularMarqueeProps) {
  
  // Calculate SVG paths based on size
  const radius = size / 2;
  const pathRadius = radius - 10; // inset slightly

  return (
    <div 
      className={`relative flex items-center justify-center ${className}`} 
      style={{ width: size, height: size, perspective: "1000px" }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: duration, ease: "linear" }}
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`} 
          className="fill-[var(--brand)] opacity-80"
        >
          <path
            id="textPath"
            d={`
              M ${radius}, ${radius}
              m -${pathRadius}, 0
              a ${pathRadius},${pathRadius} 0 1,1 ${pathRadius * 2},0
              a ${pathRadius},${pathRadius} 0 1,1 -${pathRadius * 2},0
            `}
            fill="none"
          />
          <text 
            className="mono text-[11px] md:text-[13px] tracking-[0.2em] uppercase font-medium"
          >
            <textPath href="#textPath" startOffset="0%">
              {text.repeat(3)}
            </textPath>
          </text>
        </svg>
      </motion.div>
    </div>
  );
}
