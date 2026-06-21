"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

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
}: CircularMarqueeProps) {
  const shouldReduceMotion = useReducedMotion();
  const radius = size / 2;
  const pathRadius = radius - 10;

  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        width: size,
        height: size,
        perspective: "1200px",
        transform: "rotateX(65deg) rotateY(-15deg)",
      }}
    >
      <motion.div
        animate={shouldReduceMotion ? {} : { rotate: 360 }}
        transition={{ repeat: Infinity, duration, ease: "linear" }}
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="opacity-90">
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
          <text className="mono text-[14px] font-medium uppercase tracking-[0.25em] md:text-[18px]">
            <textPath href="#textPath" startOffset="0%">
              {Array.from({ length: 6 }).map((_, i) => (
                <React.Fragment key={i}>
                  <tspan fill="var(--brand)">CONVOKE</tspan>
                  <tspan fill="currentColor" className="text-ink-muted dark:text-g5">
                    {" • FOR PEOPLE BUILDING THE FUTURE • "}
                  </tspan>
                </React.Fragment>
              ))}
            </textPath>
          </text>
        </svg>
      </motion.div>
    </div>
  );
}
