import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

const nav = [
  ["Discover", "/discover"],
  ["Communities", "/communities/north-grid"],
  ["Events", "/events/summit-zero"],
  ["Organize", "/workspace"],
  ["Merch", "/merch"],
  ["Profile", "/u/arya-sen"],
];

export function SiteHeader() {
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
        <nav className="hidden items-center gap-7 text-sm text-muted md:flex">
          {nav.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-foreground">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ButtonLink href="/auth/sign-in" variant="ghost" className="hidden md:inline-flex">
            Sign in
          </ButtonLink>
          <ButtonLink href="/workspace">Start Organizing</ButtonLink>
        </div>
      </div>
    </header>
  );
}
