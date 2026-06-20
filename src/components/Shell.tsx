"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { ThemeToggle } from "./ThemeToggle";
import { globalSearch, type SearchResult } from "@/app/actions/search";
import {
  Bell,
  ChevronDown,
  FlaskConical,
  LayoutGrid,
  LayoutTemplate,
  Building2,
  Mail,
  Search,
  Sparkles,
} from "lucide-react";

const mainNav = [
  { href: "/explore", label: "Explore" },
  { href: "/spaces", label: "Spaces" },
  { href: "/events", label: "Events" },
  { href: "/challenges", label: "Challenges" },
  { href: "/opportunities", label: "Opportunities" },
] as const;

const moreNav = [
  { href: "/projects", label: "Projects", icon: LayoutGrid },
  { href: "/organizations", label: "Organizations", icon: Building2 },
  { href: "/research", label: "Research", icon: FlaskConical },
] as const;

export function Shell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  const pathname = usePathname();
  const [commandOpen, setCommandOpen] = useState(false);
  const { isSignedIn } = useUser();

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setCommandOpen((current) => !current);
      }
      if (event.key === "Escape") setCommandOpen(false);
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  const widthClass = wide ? "max-w-[1440px]" : "max-w-[1240px]";

  return (
    <div className="min-h-screen bg-paper text-ink">
      <div className="fixed inset-x-0 top-0 z-0 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(201,161,109,0.14),transparent_58%)]" />
      <header className="sticky top-0 z-30 border-b border-g3/80 bg-paper/75 backdrop-blur-2xl">
        <div className={`mx-auto flex h-16 items-center gap-5 px-5 sm:px-8 ${widthClass}`}>
          <Link href="/" className="serif text-[24px] tracking-tight text-ink">
            Convoke<span className="text-[var(--brand)]">.</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-2 rounded-full border border-g3/80 bg-g1/70 p-1 text-[13px] text-g5">
            {mainNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 transition ${
                    isActive
                      ? "bg-paper text-ink shadow-[0_10px_24px_-18px_rgba(0,0,0,0.35)]"
                      : "hover:bg-g2 hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="relative group">
              <button className="flex items-center gap-1.5 rounded-full px-4 py-2 transition hover:bg-g2 hover:text-ink">
                More
                <ChevronDown size={14} className="transition-transform duration-300 group-hover:rotate-180" />
              </button>
              <div className="pointer-events-none absolute left-0 top-12 z-50 w-60 translate-y-2 rounded-[22px] border border-g3 bg-paper-card p-2 opacity-0 shadow-[0_28px_64px_-34px_rgba(0,0,0,0.55)] backdrop-blur-2xl transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
                <div className="grid gap-1">
                  {moreNav.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 rounded-2xl px-3 py-3 text-[14px] text-ink transition hover:bg-g1"
                      >
                        <Icon size={16} className="text-[var(--brand)]" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </nav>

          <button
            onClick={() => setCommandOpen(true)}
            className="ml-auto hidden min-w-[260px] items-center gap-3 rounded-full border border-g3 bg-paper-card px-4 py-2 text-left text-[13px] text-g5 transition hover:border-g4 hover:text-ink md:flex"
          >
            <Search size={14} className="text-[var(--brand)]" />
            <span>Search people, spaces, roles, events</span>
            <span className="ml-auto mono text-[11px] text-g4">Cmd K</span>
          </button>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <ThemeToggle />
            {isSignedIn ? (
              <>
                <Link
                  href="/workspace"
                  className="hidden h-10 w-10 items-center justify-center rounded-full border border-g3 bg-paper-card text-g5 transition hover:border-g4 hover:text-ink sm:inline-flex"
                  aria-label="Workspace"
                >
                  <LayoutTemplate size={18} strokeWidth={1.6} />
                </Link>
                <Link
                  href="/notifications"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-g3 bg-paper-card text-g5 transition hover:border-g4 hover:text-ink"
                  aria-label="Notifications"
                >
                  <Bell size={17} strokeWidth={1.7} />
                </Link>
                <Link
                  href="/messages"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-g3 bg-paper-card text-g5 transition hover:border-g4 hover:text-ink"
                  aria-label="Messages"
                >
                  <Mail size={17} strokeWidth={1.7} />
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "h-9 w-9",
                      userButtonPopoverCard: "border border-g3 bg-paper-card shadow-[0_32px_80px_-40px_rgba(0,0,0,0.65)] backdrop-blur-2xl rounded-[22px] overflow-hidden",
                      userButtonPopoverActionButton: "hover:bg-g1 text-ink font-sans text-sm px-4 py-3",
                      userButtonPopoverActionButtonIcon: "text-[var(--brand)]",
                      userButtonPopoverActionButtonText: "text-ink font-medium",
                      userButtonPopoverFooter: "hidden",
                      userPreviewMainIdentifier: "text-ink font-medium",
                      userPreviewSecondaryIdentifier: "text-g5 text-xs",
                      userButtonPopoverMain: "bg-transparent",
                    },
                  }}
                />
              </>
            ) : (
              <SignInButton mode="modal">
                <button className="ink-button px-5 text-[13px] font-medium">Log in</button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10">{children}</main>

      <footer className="relative z-10 mt-24 border-t border-g3 bg-paper/85">
        <div className={`mx-auto px-5 sm:px-8 py-16 ${widthClass}`}>
          <div className="grid gap-10 md:grid-cols-4 lg:grid-cols-5">
            <div className="md:col-span-2 lg:col-span-2">
              <Link href="/" className="serif text-2xl tracking-tight text-ink">
                Convoke.
              </Link>
              <p className="mt-4 max-w-[34ch] text-[14px] leading-relaxed text-g5">
                The operating system for student builders, ambitious founders, creator communities, and opportunity-led ecosystems.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-g3 bg-paper-card px-3 py-2 text-[11px] text-g5">
                <Sparkles size={12} className="text-[var(--brand)]" />
                Built for daily momentum, not brochure traffic.
              </div>
            </div>

            <div>
              <h4 className="eyebrow mb-4 text-ink">Platform</h4>
              <ul className="space-y-3 text-[14px] text-g5">
                <li><Link href="/explore" className="hover:text-ink transition-colors">Explore Feed</Link></li>
                <li><Link href="/spaces" className="hover:text-ink transition-colors">Spaces Directory</Link></li>
                <li><Link href="/events" className="hover:text-ink transition-colors">Events</Link></li>
                <li><Link href="/opportunities" className="hover:text-ink transition-colors">Opportunities</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="eyebrow mb-4 text-ink">Identity</h4>
              <ul className="space-y-3 text-[14px] text-g5">
                <li><Link href="/projects" className="hover:text-ink transition-colors">Projects</Link></li>
                <li><Link href="/research" className="hover:text-ink transition-colors">Research</Link></li>
                <li><Link href="/organizations" className="hover:text-ink transition-colors">Organizations</Link></li>
                <li><Link href="/workspace" className="hover:text-ink transition-colors">Workspace</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="eyebrow mb-4 text-ink">Company</h4>
              <ul className="space-y-3 text-[14px] text-g5">
                <li><Link href="/about" className="hover:text-ink transition-colors">About</Link></li>
                <li><Link href="/guidelines" className="hover:text-ink transition-colors">Guidelines</Link></li>
                <li><Link href="/privacy" className="hover:text-ink transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-ink transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-g3 pt-8 text-[12px] text-g4 mono md:flex-row">
            <span>{new Date().getFullYear()} Convoke. All rights reserved.</span>
            <div className="flex gap-4">
              <span>Midnight campus theme.</span>
              <span className="hidden sm:inline">/</span>
              <span>Built for India-first ambition.</span>
            </div>
          </div>
        </div>
      </footer>

      {commandOpen ? <CommandK onClose={() => setCommandOpen(false)} /> : null}
    </div>
  );
}

function CommandK({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const staticItems = [
    { type: "Page", title: "Explore", subtitle: "Live discovery feed", href: "/explore", id: "page-explore" },
    { type: "Page", title: "Events", subtitle: "Upcoming and live gatherings", href: "/events", id: "page-events" },
    { type: "Page", title: "Spaces", subtitle: "Communities and collectives", href: "/spaces", id: "page-spaces" },
    { type: "Page", title: "Workspace", subtitle: "Your private operating surface", href: "/workspace", id: "page-workspace" },
  ];

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    const timeoutId = setTimeout(() => {
      globalSearch(query).then((response) => {
        if (!active) return;
        setResults(response);
        setLoading(false);
      });
    }, 240);

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [query]);

  const displayItems = query.length < 2 ? staticItems : results;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/45 px-4 pt-[12vh]" onClick={onClose}>
      <div
        className="premium-card campus-frame relative w-full max-w-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-g3 px-5 py-4">
          <Search size={16} className="text-[var(--brand)]" />
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Jump into people, spaces, events, opportunities"
            className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-g4"
          />
          <span className="mono text-[11px] text-g4">Esc</span>
        </div>

        <ul className="max-h-[60vh] overflow-auto px-2 py-2">
          {loading && query.length >= 2 ? (
            <li className="px-4 py-4 text-[13px] text-g5">Searching...</li>
          ) : null}

          {!loading && query.length >= 2 && results.length === 0 ? (
            <li className="px-4 py-4 text-[13px] text-g5">No results found for "{query}"</li>
          ) : null}

          {displayItems.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                onClick={onClose}
                className="flex items-center justify-between rounded-[18px] px-4 py-3 text-[14px] transition hover:bg-g1"
              >
                <div>
                  <div className="text-ink">{item.title}</div>
                  {item.subtitle ? <div className="mt-1 text-[12px] text-g5">{item.subtitle}</div> : null}
                </div>
                <span className="mono text-[10px] uppercase tracking-[0.18em] text-g4">{item.type}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between border-t border-g3 px-5 py-3 text-[11px] text-g4 mono">
          <span>Enter to open</span>
          <span>Cmd K to reopen</span>
        </div>
      </div>
    </div>
  );
}
