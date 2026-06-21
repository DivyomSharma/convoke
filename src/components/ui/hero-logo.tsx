"use client";

import { motion } from "framer-motion";

export function HeroLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex h-[550px] w-[550px] max-w-full items-center justify-center"
    >
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.18),transparent_22%),radial-gradient(circle_at_50%_50%,rgba(0,178,255,0.12),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))] blur-[2px]" />
      <div className="absolute inset-0 rounded-full border border-white/10 bg-white/5 backdrop-blur-3xl" />
      <motion.div
        animate={{ opacity: [0.12, 0.2, 0.12], scale: [0.98, 1.02, 0.98] }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/10 blur-3xl"
      />
      <div className="relative flex select-none items-end gap-[0.08em] font-serif text-[22rem] leading-none tracking-[-0.11em] text-white/90">
        <span>C</span>
        <span className="mb-[0.05em]">.</span>
      </div>
    </motion.div>
  );
}
