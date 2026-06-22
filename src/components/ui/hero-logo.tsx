"use client";

import { motion } from "framer-motion";

export function HeroLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: [0, -6, 0] }}
      transition={{ opacity: { duration: 0.7 }, y: { duration: 6.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" } }}
      className="relative flex h-[550px] w-[550px] max-w-full items-center justify-center"
    >
      <motion.div
        className="select-none font-serif leading-none tracking-[-0.11em] text-transparent bg-clip-text bg-[radial-gradient(circle_at_46%_38%,rgba(0,0,0,0.08),transparent_14%),linear-gradient(rgba(0,0,0,0.04),transparent_76%)] dark:bg-[radial-gradient(circle_at_46%_38%,#ffffff47,#0000_14%),linear-gradient(#ffffff24,#0000_76%)]"
        style={{ fontSize: "22rem" }}
        animate={{ filter: ["blur(0px)", "blur(0.2px)", "blur(0px)"] }}
        transition={{ duration: 5.8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      >
        <span>C</span>
        <span className="mb-[0.05em]">.</span>
      </motion.div>
    </motion.div>
  );
}
