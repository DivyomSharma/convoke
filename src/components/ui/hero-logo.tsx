"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";

export function HeroLogo() {
  const mouseX = useMotionValue(260);
  const mouseY = useMotionValue(130);
  const smoothX = useSpring(mouseX, { stiffness: 78, damping: 24, mass: 0.9 });
  const smoothY = useSpring(mouseY, { stiffness: 78, damping: 24, mass: 0.9 });

  return (
    <motion.div
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        mouseX.set(event.clientX - rect.left);
        mouseY.set(event.clientY - rect.top);
      }}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.25, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex h-[430px] w-[680px] max-w-full cursor-crosshair items-center justify-center overflow-visible"
    >
      <div className="absolute inset-0 rounded-[42px] border border-g3/70 bg-[linear-gradient(145deg,color-mix(in_srgb,var(--paper-card)_88%,transparent),color-mix(in_srgb,var(--paper-card)_42%,transparent))] shadow-[0_28px_90px_rgba(0,0,0,0.08)] backdrop-blur-2xl" />
      <div className="absolute inset-0 rounded-[42px] bg-[radial-gradient(circle_at_40%_28%,rgba(255,255,255,0.7),transparent_20%),radial-gradient(circle_at_70%_70%,color-mix(in_srgb,var(--brand)_22%,transparent),transparent_30%),radial-gradient(circle_at_50%_50%,transparent_42%,rgba(255,255,255,0.18)_100%)] opacity-80 mix-blend-screen dark:opacity-100" />
      <motion.div
        className="pointer-events-none absolute inset-[-140px] hidden opacity-55 blur-[88px] dark:block"
        style={{
          background: useMotionTemplate`radial-gradient(280px circle at ${smoothX}px ${smoothY}px, color-mix(in srgb, var(--brand) 20%, transparent), transparent 72%)`,
        }}
      />
      <motion.div
        animate={{ opacity: [0.12, 0.2, 0.12], scale: [0.98, 1.02, 0.98] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/0 blur-3xl dark:bg-brand/10"
      />
      <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-ink/8 to-transparent dark:via-white/12" />
      <div className="relative flex select-none items-end gap-[0.08em] font-serif text-[22rem] leading-none tracking-[-0.11em] text-ink/[0.07] dark:text-white/[0.055]">
        <span>C</span>
        <span className="mb-[0.05em]">.</span>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex items-end gap-[0.08em] font-serif text-[22rem] leading-none tracking-[-0.11em] text-transparent bg-[radial-gradient(circle_at_46%_38%,rgba(255,255,255,0.55),transparent_14%),linear-gradient(180deg,color-mix(in_srgb,var(--ink)_18%,transparent),transparent_74%)] bg-clip-text dark:bg-[radial-gradient(circle_at_46%_38%,rgba(255,255,255,0.32),transparent_14%),linear-gradient(180deg,rgba(255,255,255,0.14),transparent_76%)]">
          <span>C</span>
          <span className="mb-[0.05em]">.</span>
        </span>
      </div>
      <div className="pointer-events-none absolute inset-x-10 bottom-10 h-12 rounded-full bg-black/10 blur-3xl opacity-70" />
    </motion.div>
  );
}
