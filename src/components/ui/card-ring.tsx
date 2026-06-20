"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface CardRingProps {
  text?: string;
  className?: string;
  size?: number;
}

export function CardRing({ 
  text = "CONVOKE • FOR PEOPLE BUILDING THE FUTURE • ",
  className = "",
  size = 600
}: CardRingProps) {
  const shouldReduceMotion = useReducedMotion();
  const radius = size / 2;
  const pathRadius = radius - 10;

  // Render text with accent dots
  const renderText = () => {
    const parts = text.split("•");
    return parts.map((part, index) => {
      if (index === parts.length - 1) return <React.Fragment key={index}>{part}</React.Fragment>;
      return (
        <React.Fragment key={index}>
          {part}<tspan className="fill-[#00B2FF]"> • </tspan>
        </React.Fragment>
      );
    });
  };

  return (
    <div 
      className={`relative flex items-center justify-center pointer-events-none mix-blend-screen transition-opacity duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] ${className}`}
      style={{ width: size, height: size, perspective: "1000px" }}
    >
      <motion.div
        animate={shouldReduceMotion ? {} : { rotate: 360 }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`} 
          className="fill-[var(--brand)]"
        >
          <path
            id="cardRingPath"
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
            <textPath href="#cardRingPath" startOffset="0%">
              {renderText()}
              {renderText()}
              {renderText()}
              {renderText()}
              {renderText()}
            </textPath>
          </text>
        </svg>
      </motion.div>
    </div>
  );
}
