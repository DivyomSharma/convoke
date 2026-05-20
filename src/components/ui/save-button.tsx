"use client";

import { useState, useTransition } from "react";
import { Bookmark, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { toggleBookmark } from "@/app/actions";

type SaveButtonProps = {
  iconOnly?: boolean;
  eventId?: string;
  opportunityId?: string;
  organizationId?: string;
  initialSaved?: boolean;
};

export function SaveButton({
  iconOnly = false,
  eventId,
  opportunityId,
  organizationId,
  initialSaved = false,
}: SaveButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={(event) => {
        event.preventDefault();
        startTransition(async () => {
          const next = !saved;
          setSaved(next);
          try {
            const result = await toggleBookmark({ eventId, opportunityId, organizationId });
            setSaved(result.saved);
          } catch {
            setSaved(!next);
          }
        });
      }}
      className={`group flex w-full items-center justify-center gap-2 rounded-full border transition-colors ${
        iconOnly ? "size-10 px-0" : "h-9 px-4 text-sm"
      } ${
        saved
          ? "border-bronze/50 bg-bronze/10 text-bronze"
          : "border-line bg-white/[0.02] text-muted hover:bg-white/[0.05] hover:text-foreground"
      }`}
      disabled={isPending}
    >
      <div className="relative size-4">
        {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
        {!isPending ? (
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
        ) : null}
        {!isPending ? (
          <Bookmark
            className={`size-4 transition-opacity ${
              saved ? "opacity-0" : "opacity-100 group-hover:opacity-80"
            }`}
          />
        ) : null}
      </div>
      {!iconOnly && (saved ? "Saved" : "Save")}
    </button>
  );
}
