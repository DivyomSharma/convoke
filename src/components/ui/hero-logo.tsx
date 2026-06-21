"use client";
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState, useRef } from "react";

export function HeroLogo() {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(y, [-200, 200], [15, -15]);
  const rotateY = useTransform(x, [-200, 200], [-15, 15]);

  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const width = rect.width;
    const height = rect.height;

    const mouseXPos = event.clientX - rect.left;
    const mouseYPos = event.clientY - rect.top;

    const xPos = mouseXPos - width / 2;
    const yPos = mouseYPos - height / 2;

    x.set(xPos);
    y.set(yPos);
    mouseX.set(mouseXPos);
    mouseY.set(mouseYPos);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: useSpring(rotateX, { stiffness: 150, damping: 20 }),
        rotateY: useSpring(rotateY, { stiffness: 150, damping: 20 }),
        transformStyle: "preserve-3d",
      }}
      className="relative flex aspect-square w-full max-w-[190px] items-center justify-center overflow-hidden rounded-[34px] border border-g3 bg-ink shadow-[0_24px_90px_rgba(0,0,0,0.18)] cursor-crosshair group perspective-1000 dark:max-w-[240px] dark:border-white/10 dark:bg-[#070707] lg:max-w-[250px] xl:max-w-[280px]"
    >
      {/* Background radial torch */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
        style={{
          background: useMotionTemplate`radial-gradient(320px circle at ${mouseX}px ${mouseY}px, color-mix(in srgb, var(--brand) 20%, transparent), transparent 78%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      
      {/* Subdued background text/pattern */}
      <div className="absolute inset-0 opacity-[0.04] flex items-center justify-center mix-blend-screen pointer-events-none">
        <div className="serif text-[13rem] text-white lg:text-[16rem]">C.</div>
      </div>

      {/* 3D Content - Front text */}
      <motion.div 
        style={{ translateZ: 60 }}
        className="relative z-10 flex flex-col items-center justify-center pointer-events-none"
      >
        <h1 className="serif text-[7.8rem] leading-none tracking-tighter text-white drop-shadow-2xl font-normal lg:text-[10.5rem]">
          C.
        </h1>
      </motion.div>

      <div className="absolute inset-x-5 top-3 h-px bg-white/35 pointer-events-none" />
      <div className="absolute inset-0 rounded-[34px] border-t border-white/25 pointer-events-none mix-blend-overlay" />
    </motion.div>
  );
}
