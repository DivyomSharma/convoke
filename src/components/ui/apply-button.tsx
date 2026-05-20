"use client";

import { useState, useTransition } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { applyToOpportunity, registerForEvent } from "@/app/actions";

interface ApplyButtonProps {
  label?: string;
  className?: string;
  opportunityId?: string;
  eventId?: string;
  ticketTypeId?: string;
  initialApplied?: boolean;
  mode?: "apply" | "register";
}

export function ApplyButton({
  label = "Apply Now",
  className = "",
  opportunityId,
  eventId,
  ticketTypeId,
  initialApplied = false,
  mode = "apply",
}: ApplyButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "done">(
    initialApplied ? "done" : "idle",
  );
  const [isPending, startTransition] = useTransition();

  const doneLabel = mode === "register" ? "Registered" : "Applied";

  return (
    <button
      onClick={(event) => {
        event.preventDefault();
        if (status !== "idle") return;

        startTransition(async () => {
          setStatus("loading");
          try {
            if (mode === "register" && eventId) {
              await registerForEvent({ eventId, ticketTypeId });
            }
            if (mode === "apply" && opportunityId) {
              await applyToOpportunity({ opportunityId });
            }
            setStatus("done");
          } catch {
            setStatus("idle");
          }
        });
      }}
      disabled={status !== "idle" || isPending}
      className={`group relative flex h-10 w-full items-center justify-center gap-2 overflow-hidden rounded-full font-medium transition-all ${
        status === "done"
          ? "border border-bronze/30 bg-bronze/20 text-bronze"
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
            <span>{mode === "register" ? "Registering..." : "Applying..."}</span>
          </motion.div>
        )}
        {status === "done" && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2"
          >
            <Check className="size-4" />
            <span>{doneLabel}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
