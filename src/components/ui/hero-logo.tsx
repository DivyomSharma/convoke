"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

export function HeroLogo() {
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  return (
    <motion.div
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        mouseX.set(event.clientX - rect.left);
        mouseY.set(event.clientY - rect.top);
      }}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex h-[240px] w-[520px] max-w-full items-center justify-center overflow-visible"
    >
      <motion.div
        className="pointer-events-none absolute inset-[-90px] opacity-80 blur-2xl dark:opacity-70"
        style={{
          background: useMotionTemplate`radial-gradient(360px circle at ${mouseX}px ${mouseY}px, color-mix(in srgb, var(--brand) 26%, transparent), transparent 68%)`,
        }}
      />
      <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-ink/18 to-transparent dark:via-white/16" />
      <div className="relative select-none font-sans text-[8rem] font-black uppercase leading-none tracking-[-0.115em] text-ink/10 [text-shadow:0_1px_0_rgba(255,255,255,0.08)] dark:text-white/[0.055] sm:text-[10rem]">
        Convoke
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="font-sans text-[8rem] font-black uppercase leading-none tracking-[-0.115em] text-transparent sm:text-[10rem]">
          <span className="bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.42),transparent_18%),linear-gradient(180deg,color-mix(in_srgb,var(--ink)_24%,transparent),transparent_70%)] bg-clip-text dark:bg-[radial-gradient(circle_at_50%_42%,rgba(255,255,255,0.32),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.13),transparent_72%)]">
            Convoke
          </span>
        </div>
      </div>
    </motion.div>
  );
}
