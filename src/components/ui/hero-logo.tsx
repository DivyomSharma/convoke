"use client";

import { motion } from "framer-motion";

export function HeroLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: [0, -8, 0] }}
      transition={{ opacity: { duration: 0.8 }, y: { duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" } }}
      whileHover={{ scale: 1.01 }}
      className="relative flex h-[550px] w-[550px] max-w-full items-center justify-center"
    >
      <motion.div
        className="relative select-none font-serif leading-none tracking-[-0.11em] text-transparent bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,0.52)_44%,rgba(225,231,242,0.88)_72%,rgba(255,255,255,0.7))] bg-clip-text drop-shadow-[0_0_18px_rgba(255,255,255,0.14)]"
        style={{ fontSize: "22rem" }}
        animate={{ filter: ["blur(0px)", "blur(0.35px)", "blur(0px)"] }}
        transition={{ duration: 5.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <span className="transition-transform duration-300 group-hover:-translate-y-1">C</span>
        <span className="mb-[0.05em] transition-transform duration-300 group-hover:-translate-y-1">.</span>
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 54% 42%, rgba(255,255,255,0.28), transparent 18%), radial-gradient(circle at 52% 48%, rgba(255,255,255,0.12), transparent 34%)",
        }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-100"
        style={{
          background:
            "radial-gradient(circle at 52% 48%, rgba(0,178,255,0.08), transparent 32%)",
        }}
      />
    </motion.div>
  );
}
