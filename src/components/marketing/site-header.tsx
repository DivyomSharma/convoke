"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";

const nav = [
  ["Discover", "/discover"],
  ["Communities", "/communities"],
  ["Events", "/events"],
  ["Opportunities", "/opportunities"],
  ["Organize", "/workspace"],
  ["Merch", "/merch"],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/[0.08] bg-background/75 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="Convoke home"
            onClick={() => setOpen(false)}
          >
            <span className="grid size-8 place-items-center rounded-[8px] border border-bronze/40 bg-bronze/10 text-sm font-semibold text-bronze">
              C
            </span>
            <span className="text-sm font-semibold tracking-[0.18em] text-foreground">
              CONVOKE
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
            {nav.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "transition hover:text-foreground",
                  pathname === href ? "text-foreground" : undefined,
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <ButtonLink href="/auth/sign-in" variant="ghost">
              Sign in
            </ButtonLink>
            <ButtonLink href="/workspace">Start Organizing</ButtonLink>
          </div>

          <button
            onClick={() => setOpen((value) => !value)}
            className="grid size-10 place-items-center rounded-[8px] border border-white/[0.08] bg-white/[0.02] text-foreground md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed bottom-0 right-0 top-0 z-50 flex w-[85vw] max-w-sm flex-col border-l border-line bg-background/95 backdrop-blur-2xl md:hidden"
            >
              <div className="flex h-16 items-center justify-between border-b border-line px-5">
                <span className="text-sm font-semibold tracking-[0.18em] text-foreground">
                  MENU
                </span>
                <button
                  onClick={() => setOpen(false)}
                  className="grid size-10 place-items-center rounded-full border border-line"
                  aria-label="Close menu"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-8">
                <div className="space-y-1">
                  {nav.map(([label, href], index) => (
                    <motion.div
                      key={href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <Link
                        href={href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-4 py-4 text-lg font-medium transition hover:bg-white/[0.06]",
                          pathname === href ? "text-bronze" : "text-foreground",
                        )}
                      >
                        {label}
                        <ArrowRight className="size-4 text-muted" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="my-8 h-px bg-line" />
              </div>

              <div className="space-y-3 border-t border-line p-5">
                <ButtonLink
                  href="/auth/sign-in"
                  variant="secondary"
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Sign in
                </ButtonLink>
                <ButtonLink href="/workspace" className="w-full" onClick={() => setOpen(false)}>
                  Start Organizing
                </ButtonLink>
              </div>
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
