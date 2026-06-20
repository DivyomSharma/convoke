"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { Avatar } from "./Avatar";
import { portraits } from "@/lib/photos";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { ThemeToggle } from "./ThemeToggle";

import { ChevronDown, Briefcase, Calendar, Code, LayoutGrid, Building2, FlaskConical, LayoutTemplate } from "lucide-react";

const mainNav = [
  { href: "/explore", label: "Explore" },
  { href: "/spaces", label: "Spaces" },
  { href: "/events", label: "Events" },
  { href: "/hackathons", label: "Hackathons" },
  { href: "/opportunities", label: "Opportunities" },
] as const;

const moreNav = [
  { href: "/projects", label: "Projects", icon: LayoutGrid },
  { href: "/organizations", label: "Organizations", icon: Building2 },
  { href: "/research", label: "Research", icon: FlaskConical },
] as const;

export function Shell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  const pathname = usePathname();
  const [k, setK] = useState(false);
  const { isSignedIn } = useUser();

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setK((v) => !v);
      }
      if (e.key === "Escape") setK(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <header className="sticky top-0 z-30 bg-paper/85 backdrop-blur hairline-b">
        <div className={"mx-auto flex items-center gap-8 px-5 sm:px-8 h-14 " + (wide ? "max-w-[1440px]" : "max-w-[1240px]")}>
          <Link href="/" className="serif text-[22px] leading-none tracking-tight">
            Convoke<span className="text-g4">.</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-6 text-[14px] text-g5">
            {mainNav.map((n) => {
              const isActive = pathname === n.href;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`transition-colors ${isActive ? "text-ink font-medium" : "hover:text-ink"}`}
                >
                  {n.label}
                </Link>
              );
            })}
            
            {/* More Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 hover:text-ink transition-colors h-14">
                More <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute top-14 left-0 w-56 bg-paper border border-g3 rounded-xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50 overflow-hidden">
                <div className="p-2 flex flex-col gap-1">
                  {moreNav.map((n) => {
                    const Icon = n.icon;
                    return (
                      <Link key={n.href} href={n.href} className="flex items-center gap-3 px-3 py-2 hover:bg-g1 rounded-lg text-ink transition-colors">
                        <Icon size={16} className="text-g5" />
                        <span className="text-[14px]">{n.label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </nav>
          <button
            onClick={() => setK(true)}
            className="ml-auto hidden md:flex items-center gap-3 h-8 px-3 hairline rounded-md text-[13px] text-g5 hover:text-ink hover:border-g5 transition-colors min-w-[220px]"
          >
            <span>Search people, spaces, drops…</span>
            <span className="ml-auto mono text-[11px] text-g4">⌘K</span>
          </button>
          <div className="flex items-center gap-4 ml-auto md:ml-0">
            <ThemeToggle />
            {isSignedIn ? (
              <>
                <Link href="/workspace" className="text-g5 hover:text-ink text-[14px] hidden sm:block" aria-label="Workspace">
                  <LayoutTemplate size={18} strokeWidth={1.5} />
                </Link>
                <Link href="/notifications" className="text-g5 hover:text-ink text-[14px]" aria-label="Notifications">
                  <NotifGlyph />
                </Link>
                <Link href="/messages" className="text-g5 hover:text-ink text-[14px]" aria-label="Messages">
                  <MailGlyph />
                </Link>
                <UserButton 
                  appearance={{ 
                    elements: { 
                      userButtonAvatarBox: "w-7 h-7",
                      userButtonPopoverCard: "shadow-lg bg-paper border border-g3 rounded-lg overflow-hidden",
                      userButtonPopoverActionButton: "hover:bg-g1 text-ink font-sans text-sm px-4 py-2",
                      userButtonPopoverActionButtonIcon: "text-ink",
                      userButtonPopoverActionButtonText: "text-ink font-medium",
                      userButtonPopoverFooter: "hidden",
                      userPreviewMainIdentifier: "text-ink font-medium",
                      userPreviewSecondaryIdentifier: "text-g5 text-xs",
                      userButtonPopoverMain: "bg-paper",
                    } 
                  }} 
                />
              </>
            ) : (
              <SignInButton mode="modal">
                <button className="text-[13px] font-medium bg-ink text-paper px-4 py-1.5 rounded-full hover:bg-ink-2 transition-colors">
                  Log in
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="hairline-t mt-24 bg-paper">
        <div className={"mx-auto px-5 sm:px-8 py-16 " + (wide ? "max-w-[1440px]" : "max-w-[1240px]")}>
          <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-10">
            <div className="col-span-1 md:col-span-2 lg:col-span-2">
              <Link href="/" className="serif text-2xl text-ink tracking-tight">Convoke.</Link>
              <p className="mt-4 text-[14px] text-g5 max-w-[30ch] leading-relaxed">
                The network for ambitious builders. A quiet place to gather, build, and invent the future together.
              </p>
            </div>
            
            <div>
              <h4 className="eyebrow mb-4 text-ink">Platform</h4>
              <ul className="space-y-3 text-[14px] text-g5">
                <li><Link href="/explore" className="hover:text-ink transition-colors">Explore Feed</Link></li>
                <li><Link href="/spaces" className="hover:text-ink transition-colors">Spaces Directory</Link></li>
                <li><Link href="/opportunities" className="hover:text-ink transition-colors">Opportunities</Link></li>
                <li><Link href="/workspace" className="hover:text-ink transition-colors">Workspace</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="eyebrow mb-4 text-ink">Company</h4>
              <ul className="space-y-3 text-[14px] text-g5">
                <li><Link href="/about" className="hover:text-ink transition-colors">About Us</Link></li>
                <li><Link href="/changelog" className="hover:text-ink transition-colors">Changelog</Link></li>
                <li><Link href="/guidelines" className="hover:text-ink transition-colors">Community Guidelines</Link></li>
                <li><Link href="https://twitter.com/convoke" className="hover:text-ink transition-colors">Twitter (X)</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="eyebrow mb-4 text-ink">Legal</h4>
              <ul className="space-y-3 text-[14px] text-g5">
                <li><Link href="/privacy" className="hover:text-ink transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-ink transition-colors">Terms of Service</Link></li>
                <li><a href="mailto:hello@convoke.com" className="hover:text-ink transition-colors">Contact Support</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 hairline-t flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-g4 mono">
            <span>© {new Date().getFullYear()} Convoke, Inc. All rights reserved.</span>
            <div className="flex gap-4">
              <span>Designed in California.</span>
              <span className="hidden sm:inline">·</span>
              <span>Built on the Internet.</span>
            </div>
          </div>
        </div>
      </footer>

      {k && <CommandK onClose={() => setK(false)} />}
    </div>
  );
}

import { globalSearch, type SearchResult } from "@/app/actions/search";

function CommandK({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const staticItems = [
    { type: "Page", title: "Explore feed", subtitle: "", href: "/explore", id: "p1" },
    { type: "Page", title: "Spaces directory", subtitle: "", href: "/spaces", id: "p2" },
    { type: "Page", title: "Opportunities", subtitle: "", href: "/opportunities", id: "p3" },
    { type: "Page", title: "Workspace", subtitle: "", href: "/workspace", id: "p4" },
  ];

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    let active = true;
    setLoading(true);
    const timeoutId = setTimeout(() => {
      globalSearch(query).then((res) => {
        if (active) {
          setResults(res);
          setLoading(false);
        }
      });
    }, 250);
    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [query]);

  const displayItems = query.length < 2 ? staticItems : results;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-ink/40" />
      <div
        className="relative w-full max-w-xl bg-paper hairline rounded-md shadow-[0_8px_30px_rgba(0,0,0,0.12)] rise"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Jump to anything…"
          className="w-full px-5 h-14 bg-transparent text-[15px] outline-none placeholder:text-g4 hairline-b"
        />
        <ul className="max-h-[60vh] overflow-auto py-2">
          {loading && query.length >= 2 && results.length === 0 && (
            <li className="px-5 py-4 text-[13px] text-g5">Searching...</li>
          )}
          {!loading && query.length >= 2 && results.length === 0 && (
             <li className="px-5 py-4 text-[13px] text-g5">No results found for "{query}"</li>
          )}
          {displayItems.map((it) => (
            <li key={it.id}>
              <Link
                href={it.href}
                onClick={onClose}
                className="flex items-center justify-between px-5 py-2.5 hover:bg-g1 text-[14px]"
              >
                <div>
                  <div>{it.title}</div>
                  {it.subtitle && <div className="text-[12px] text-g5">{it.subtitle}</div>}
                </div>
                <span className="mono text-[10px] text-g4">{it.type}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="hairline-t px-5 py-2.5 flex items-center justify-between text-[11px] text-g4 mono">
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}

function NotifGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Z" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </svg>
  );
}
function MailGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
