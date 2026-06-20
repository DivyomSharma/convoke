"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface ConvokeLoaderProps {
  size?: 96 | 128 | 192;
  className?: string;
}

export function ConvokeLoader({ size = 128, className = "" }: ConvokeLoaderProps) {
  const shouldReduceMotion = useReducedMotion();
  const radius = size / 2;
  const pathRadius = radius - 12;

  // Dot color #00B2FF
  const textContent = (
    <React.Fragment>
      CONVOKE <tspan className="fill-[#00B2FF]">•</tspan> CONVOKE <tspan className="fill-[#00B2FF]">•</tspan> CONVOKE <tspan className="fill-[#00B2FF]">•</tspan> CONVOKE <tspan className="fill-[#00B2FF]">•</tspan>{" "}
    </React.Fragment>
  );

  return (
    <div 
      className={`relative flex items-center justify-center opacity-85 ${className}`}
      style={{ width: size, height: size }}
    >
      <motion.div
        animate={shouldReduceMotion ? {} : { rotate: 360 }}
        transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
        className="absolute inset-0"
      >
        <svg 
          width={size} 
          height={size} 
          viewBox={`0 0 ${size} ${size}`} 
          className="fill-white"
        >
          <path
            id="loaderTextPath"
            d={`
              M ${radius}, ${radius}
              m -${pathRadius}, 0
              a ${pathRadius},${pathRadius} 0 1,1 ${pathRadius * 2},0
              a ${pathRadius},${pathRadius} 0 1,1 -${pathRadius * 2},0
            `}
            fill="none"
          />
          <text 
            className="mono uppercase tracking-[0.35em] font-medium"
            style={{ fontSize: size === 192 ? '14px' : size === 128 ? '10px' : '8px' }}
          >
            <textPath href="#loaderTextPath" startOffset="0%">
              {textContent}
            </textPath>
          </text>
        </svg>
      </motion.div>
      
      {/* Center Logo */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span 
          className="serif text-white opacity-95"
          style={{ fontSize: size === 192 ? '36px' : size === 128 ? '24px' : '18px' }}
        >
          C.
        </span>
      </div>
    </div>
  );
}
