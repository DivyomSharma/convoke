"use client";

interface AmbientGlowProps {
  className?: string;
  color?: string;
}

export function AmbientGlow({ className = "", color = "var(--brand)" }: AmbientGlowProps) {
  return (
    <div
      className={`absolute rounded-full blur-[100px] pointer-events-none ${className}`}
      style={{
        backgroundColor: color,
        transform: 'translate3d(0,0,0)', // Hardware acceleration
      }}
    />
  );
}
