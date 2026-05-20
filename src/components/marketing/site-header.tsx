"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const nav = [
  ["Discover", "/discover"],
  ["Communities", "/communities/north-grid"],
  ["Events", "/events/summit-zero"],
  ["Opportunities", "/opportunities"],
  ["Organize", "/workspace"],
  ["Merch", "/merch"],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-background/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Convoke home">
            <span className="grid size-8 place-items-center rounded-[8px] border border-bronze/40 bg-bronze/10 text-sm font-semibold text-bronze">
              C
            </span>
            <span className="text-sm font-semibold tracking-[0.18em] text-foreground">
              CONVOKE
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-7 text-sm text-muted lg:flex">
            {nav.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "transition hover:text-foreground",
                  pathname === href && "text-foreground"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop buttons */}
          <div className="hidden items-center gap-2 lg:flex">
            <ButtonLink href="/auth/sign-in" variant="ghost">
              Sign in
            </ButtonLink>
            <ButtonLink href="/workspace">Start Organizing</ButtonLink>
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="grid size-10 place-items-center rounded-full border border-line text-foreground lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </header>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.nav
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed bottom-0 right-0 top-0 z-50 flex w-[85vw] max-w-sm flex-col border-l border-line bg-background/95 backdrop-blur-2xl lg:hidden"
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
                  {nav.map(([label, href], i) => (
                    <motion.div
                      key={href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.3 }}
                    >
                      <Link
                        href={href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center justify-between rounded-xl px-4 py-4 text-lg font-medium transition hover:bg-white/[0.06]",
                          pathname === href ? "text-bronze" : "text-foreground"
                        )}
                      >
                        {label}
                        <ArrowRight className="size-4 text-muted" />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className="my-8 h-px bg-line" />

                <Link
                  href="/u/arya-sen"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-4 py-4 transition hover:bg-white/[0.06]"
                >
                  <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-bronze to-rust text-sm font-semibold text-black">
                    A
                  </span>
                  <div>
                    <p className="text-sm font-medium">Arya Sen</p>
                    <p className="text-xs text-muted">View profile</p>
                  </div>
                </Link>
              </div>

              <div className="space-y-3 border-t border-line p-5">
                <ButtonLink href="/auth/sign-in" variant="secondary" className="w-full">
                  Sign in
                </ButtonLink>
                <ButtonLink href="/workspace" className="w-full">
                  Start Organizing
                </ButtonLink>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
