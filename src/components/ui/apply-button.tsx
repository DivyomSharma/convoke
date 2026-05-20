"use client";

import { useState } from "react";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ApplyButtonProps {
  label?: string;
  className?: string;
}

export function ApplyButton({ label = "Apply Now", className = "" }: ApplyButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "applied">("idle");

  const handleApply = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (status !== "idle") return;
    
    setStatus("loading");
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setStatus("applied");
  };

  return (
    <button
      onClick={handleApply}
      disabled={status !== "idle"}
      className={`group relative flex h-10 w-full items-center justify-center gap-2 overflow-hidden rounded-full font-medium transition-all ${
        status === "applied"
          ? "bg-bronze/20 text-bronze border border-bronze/30 cursor-default"
          : "bg-bronze text-black hover:bg-bronze/90 active:scale-[0.98]"
      } ${className}`}
    >
      <AnimatePresence mode="wait">
        {status === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2"
          >
            <span>{label}</span>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </motion.div>
        )}
        {status === "loading" && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="size-4 animate-spin" />
            <span>Processing...</span>
          </motion.div>
        )}
        {status === "applied" && (
          <motion.div
            key="applied"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2"
          >
            <Check className="size-4" />
            <span>Applied Successfully</span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
