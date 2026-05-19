import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { useState } from "react";

const nav = [
  ["Discover", "/discover"],
  ["Communities", "/communities/north-grid"],
  ["Events", "/events/summit-zero"],
  ["Opportunities", "/opportunities"],
  ["Organize", "/workspace"],
  ["Merch", "/merch"],
  ["Profile", "/u/arya-sen"],
];

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/[0.08] bg-background/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="Convoke home">
          <span className="grid size-8 place-items-center rounded-[8px] border border-bronze/40 bg-bronze/10 text-sm font-semibold text-bronze">
            C
          </span>
          <span className="text-sm font-semibold tracking-[0.18em] text-foreground">
            CONVOKE
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-accent"
            aria-label="Open mobile menu"
          >
            {/* Hamburger icon */}
            <svg className="h-5 w-5 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-7 text-sm text-muted">
            {nav.map(([label, href]) => (
              <Link key={href} href={href} className="transition hover:text-foreground">
                {label}
              </Link>
            ))}
          </nav>
          
          {/* Desktop buttons */}
          <div className="hidden md:flex items-center gap-2">
            <ButtonLink href="/auth/sign-in" variant="ghost">
              Sign in
            </ButtonLink>
            <ButtonLink href="/workspace">Start Organizing</ButtonLink>
          </div>
        </div>
      </div>
      
      {/* Mobile menu drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 bg-background/80 backdrop-blur-md z-50">
          <nav className="mx-auto max-w-7xl space-y-6 py-6 px-5">
            {nav.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                className="block text-lg font-medium text-foreground hover:text-accent transition"
              >
                {label}
              </Link>
            ))}
            <div className="space-y-4">
              <ButtonLink href="/auth/sign-in" variant="ghost" className="w-full">
                Sign in
              </ButtonLink>
              <ButtonLink href="/workspace" className="w-full">
                Start Organizing
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
