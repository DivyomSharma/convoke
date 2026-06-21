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
      className="relative flex items-center justify-center w-full max-w-[320px] aspect-square md:max-w-[420px] rounded-[32px] bg-[#0c0c0c] border border-white/5 overflow-hidden shadow-2xl cursor-crosshair group perspective-1000"
    >
      {/* Background radial torch */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-500"
        style={{
          background: useMotionTemplate`radial-gradient(350px circle at ${mouseX}px ${mouseY}px, rgba(0, 178, 255, 0.15), transparent 80%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      
      {/* Subdued background text/pattern */}
      <div className="absolute inset-0 opacity-[0.03] flex items-center justify-center mix-blend-screen pointer-events-none">
        <div className="serif text-[20rem] text-white">C.</div>
      </div>

      {/* 3D Content - Front text */}
      <motion.div 
        style={{ translateZ: 60 }}
        className="relative z-10 flex flex-col items-center justify-center pointer-events-none"
      >
        <h1 className="serif text-9xl md:text-[14rem] text-white leading-none tracking-tighter drop-shadow-2xl font-normal">
          C.
        </h1>
      </motion.div>

      {/* Top highlight to mimic glass edge */}
      <div className="absolute inset-0 rounded-[32px] border-t border-white/20 pointer-events-none mix-blend-overlay" />
    </motion.div>
  );
}
