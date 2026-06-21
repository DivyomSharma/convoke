"use client";

import { motion } from "framer-motion";

export function HeroLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: [0, -6, 0] }}
      transition={{ opacity: { duration: 0.7 }, y: { duration: 6.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" } }}
      whileHover={{ scale: 1.01 }}
      className="relative flex h-[550px] w-[550px] max-w-full items-center justify-center"
    >
      <motion.div
        className="select-none font-serif leading-none tracking-[-0.11em] text-transparent bg-clip-text"
        style={{
          fontSize: "22rem",
          backgroundImage:
            "radial-gradient(circle at 46% 38%, #ffffff47, #0000 14%), linear-gradient(#ffffff24, #0000 76%)",
        }}
        animate={{ filter: ["blur(0px)", "blur(0.3px)", "blur(0px)"] }}
        transition={{ duration: 5.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <span>C</span>
        <span className="mb-[0.05em]">.</span>
      </motion.div>
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 50% 46%, rgba(255,255,255,0.09), transparent 12%), radial-gradient(circle at 50% 50%, rgba(255,255,255,0.04), transparent 28%)",
        }}
      />
    </motion.div>
  );
}
