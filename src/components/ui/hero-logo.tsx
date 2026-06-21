"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

export function HeroLogo() {
  const mouseX = useMotionValue(260);
  const mouseY = useMotionValue(130);

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
      className="relative flex h-[250px] w-[430px] max-w-full items-center justify-center overflow-visible"
    >
      <motion.div
        className="pointer-events-none absolute inset-[-120px] hidden opacity-70 blur-3xl dark:block"
        style={{
          background: useMotionTemplate`radial-gradient(360px circle at ${mouseX}px ${mouseY}px, color-mix(in srgb, var(--brand) 30%, transparent), transparent 68%)`,
        }}
      />
      <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-ink/10 to-transparent dark:via-white/14" />
      <div className="absolute left-1/2 top-1/2 h-[220px] w-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/0 blur-2xl dark:bg-brand/12" />
      <div className="relative select-none font-serif text-[15rem] leading-none tracking-[-0.1em] text-ink/[0.075] dark:text-white/[0.06]">
        C.
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-serif text-[15rem] leading-none tracking-[-0.1em] text-transparent bg-[radial-gradient(circle_at_48%_42%,rgba(255,255,255,0.42),transparent_15%),linear-gradient(180deg,color-mix(in_srgb,var(--ink)_18%,transparent),transparent_72%)] bg-clip-text dark:bg-[radial-gradient(circle_at_48%_42%,rgba(255,255,255,0.34),transparent_15%),linear-gradient(180deg,rgba(255,255,255,0.16),transparent_74%)]">
          C.
        </span>
      </div>
    </motion.div>
  );
}
