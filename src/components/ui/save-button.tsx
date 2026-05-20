"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SaveButton({ iconOnly = false }: { iconOnly?: boolean }) {
  const [saved, setSaved] = useState(false);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        setSaved(!saved);
      }}
      className={`group flex w-full justify-center items-center gap-2 rounded-full border transition-colors ${
        iconOnly ? "size-10 px-0" : "h-9 px-4 text-sm"
      } ${
        saved
          ? "border-bronze/50 bg-bronze/10 text-bronze"
          : "border-line bg-white/[0.02] text-muted hover:bg-white/[0.05] hover:text-foreground"
      }`}
    >
      <div className="relative size-4">
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-0"
            >
              <Bookmark className="size-4 fill-current" />
            </motion.div>
          )}
        </AnimatePresence>
        <Bookmark className={`size-4 transition-opacity ${saved ? "opacity-0" : "opacity-100 group-hover:opacity-80"}`} />
      </div>
      {!iconOnly && (saved ? "Saved" : "Save")}
    </button>
  );
}
