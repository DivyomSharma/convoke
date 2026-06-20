"use client";

import { useEffect, useState } from "react";

type ArtShape = "circle" | "squiggle" | "star" | "dots";

export function FloatingArt({
  shape = "circle",
  className = "",
  color = "var(--brand)",
}: {
  shape?: ArtShape;
  className?: string;
  color?: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  switch (shape) {
    case "circle":
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" stroke={color} strokeWidth="2" strokeDasharray="6 6" />
        </svg>
      );
    case "squiggle":
      return (
        <svg viewBox="0 0 200 50" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 25 Q 30 5, 55 25 T 105 25 T 155 25 T 195 25" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 5 L61 38 L95 38 L67 59 L78 92 L50 71 L22 92 L33 59 L5 38 L39 38 Z" fill={color} />
        </svg>
      );
    case "dots":
      return (
        <svg viewBox="0 0 100 100" className={className} fill={color} xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="4" />
          <circle cx="50" cy="10" r="4" />
          <circle cx="90" cy="10" r="4" />
          <circle cx="10" cy="50" r="4" />
          <circle cx="50" cy="50" r="4" />
          <circle cx="90" cy="50" r="4" />
          <circle cx="10" cy="90" r="4" />
          <circle cx="50" cy="90" r="4" />
          <circle cx="90" cy="90" r="4" />
        </svg>
      );
    default:
      return null;
  }
}
