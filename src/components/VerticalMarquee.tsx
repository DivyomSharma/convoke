"use client";

import React from "react";
import { motion } from "framer-motion";

interface VerticalMarqueeProps {
  className?: string;
  duration?: number;
  text?: string;
  repeat?: number;
}

export function VerticalMarquee({ 
  className = "", 
  duration = 40,
  text = "CONVOKE • FOR PEOPLE BUILDING THE FUTURE • ",
  repeat = 10
}: VerticalMarqueeProps) {
  
  // Create an array of text segments to repeat
  const content = Array(repeat).fill(text).join(" ");

  return (
    <div className={`relative flex overflow-hidden ${className}`}>
      <motion.div
        animate={{ y: [0, "-50%"] }}
        transition={{ repeat: Infinity, duration: duration, ease: "linear" }}
        className="flex flex-col whitespace-nowrap"
      >
        <span className="mono text-[11px] tracking-[0.24em] uppercase font-medium text-[var(--brand)] opacity-40 py-2 rotate-180" style={{ writingMode: "vertical-rl" }}>
          {content}
        </span>
        <span className="mono text-[11px] tracking-[0.24em] uppercase font-medium text-[var(--brand)] opacity-40 py-2 rotate-180" style={{ writingMode: "vertical-rl" }}>
          {content}
        </span>
      </motion.div>
    </div>
  );
}
