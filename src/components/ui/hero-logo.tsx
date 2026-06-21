"use client";

import { motion } from "framer-motion";

export function HeroLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: [0, -10, 0] }}
      transition={{ duration: 6.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      className="group relative flex h-[550px] w-[550px] max-w-full items-center justify-center"
    >
      <motion.div
        className="relative flex select-none items-end gap-[0.08em] font-serif text-[22rem] leading-none tracking-[-0.11em] text-transparent bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,255,255,0.45)_42%,rgba(255,255,255,0.92)_68%,rgba(214,229,255,0.72))] bg-clip-text drop-shadow-[0_0_22px_rgba(255,255,255,0.2)]"
        animate={{ filter: ["blur(0px)", "blur(0.4px)", "blur(0px)"] }}
        transition={{ duration: 5.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        whileHover={{ scale: 1.03 }}
      >
        <span className="transition-transform duration-300 group-hover:-translate-y-1">C</span>
        <span className="mb-[0.05em] transition-transform duration-300 group-hover:-translate-y-1">.</span>
      </motion.div>
      <div className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.16),transparent_55%)]" />
    </motion.div>
  );
}
