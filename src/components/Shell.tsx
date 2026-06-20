"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { Avatar } from "./Avatar";
import { portraits } from "@/lib/photos";

const nav = [
  { href: "/explore", label: "Explore" },
  { href: "/spaces", label: "Spaces" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/workspace", label: "Workspace" },
] as const;

export function Shell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  const pathname = usePathname();
  const [k, setK] = useState(false);

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
          <nav className="hidden md:flex items-center gap-6 text-[14px] text-g5">
            {nav.map((n) => {
              const isActive = pathname === n.href;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`transition-colors ${isActive ? "text-ink" : "hover:text-ink"}`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <button
            onClick={() => setK(true)}
            className="ml-auto hidden md:flex items-center gap-3 h-8 px-3 hairline rounded-md text-[13px] text-g5 hover:text-ink hover:border-g5 transition-colors min-w-[220px]"
          >
            <span>Search people, spaces, drops…</span>
            <span className="ml-auto mono text-[11px] text-g4">⌘K</span>
          </button>
          <div className="flex items-center gap-4 ml-auto md:ml-0">
            <Link href="/notifications" className="text-g5 hover:text-ink text-[14px]" aria-label="Notifications">
              <NotifGlyph />
            </Link>
            <Link href="/messages" className="text-g5 hover:text-ink text-[14px]" aria-label="Messages">
              <MailGlyph />
            </Link>
            <Link href="/profile/leo">
              <Avatar src={portraits[0]} name="Leo Carrillo" size={28} />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="hairline-t mt-24">
        <div className={"mx-auto px-5 sm:px-8 py-10 flex flex-wrap items-baseline gap-x-8 gap-y-3 text-[13px] text-g5 " + (wide ? "max-w-[1440px]" : "max-w-[1240px]")}>
          <span className="serif text-ink text-lg">Convoke</span>
          <span>Where ambitious people gather.</span>
          <Link href="/spaces" className="hover:text-ink">Spaces</Link>
          <Link href="/opportunities" className="hover:text-ink">Opportunities</Link>
          <Link href="/explore" className="hover:text-ink">Explore</Link>
          <Link href="/settings" className="hover:text-ink">Settings</Link>
          <span className="ml-auto mono text-[11px] text-g4">© {new Date().getFullYear()}</span>
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
