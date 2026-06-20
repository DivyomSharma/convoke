import { Link } from "@tanstack/react-router";
import { type ReactNode, useEffect, useState } from "react";
import { Avatar } from "./Avatar";
import { portraits } from "@/lib/photos";

const nav = [
  { to: "/explore", label: "Explore" },
  { to: "/spaces", label: "Spaces" },
  { to: "/opportunities", label: "Opportunities" },
  { to: "/workspace", label: "Workspace" },
] as const;

export function Shell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
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
          <Link to="/" className="serif text-[22px] leading-none tracking-tight">
            Convoke<span className="text-g4">.</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-[14px] text-g5">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeProps={{ className: "text-ink" }}
                className="hover:text-ink transition-colors"
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <button
            onClick={() => setK(true)}
            className="ml-auto hidden md:flex items-center gap-3 h-8 px-3 hairline rounded-md text-[13px] text-g5 hover:text-ink hover:border-g5 transition-colors min-w-[220px]"
          >
            <span>Search people, spaces, drops…</span>
            <span className="ml-auto mono text-[11px] text-g4">⌘K</span>
          </button>
          <div className="flex items-center gap-4 ml-auto md:ml-0">
            <Link to="/notifications" className="text-g5 hover:text-ink text-[14px]" aria-label="Notifications">
              <NotifGlyph />
            </Link>
            <Link to="/messages" className="text-g5 hover:text-ink text-[14px]" aria-label="Messages">
              <MailGlyph />
            </Link>
            <Link to="/profile/$handle" params={{ handle: "leo" }}>
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
          <Link to="/spaces" className="hover:text-ink">Spaces</Link>
          <Link to="/opportunities" className="hover:text-ink">Opportunities</Link>
          <Link to="/explore" className="hover:text-ink">Explore</Link>
          <Link to="/settings" className="hover:text-ink">Settings</Link>
          <span className="ml-auto mono text-[11px] text-g4">© {new Date().getFullYear()}</span>
        </div>
      </footer>

      {k && <CommandK onClose={() => setK(false)} />}
    </div>
  );
}

function CommandK({ onClose }: { onClose: () => void }) {
  const items = [
    { kind: "Page", label: "Explore feed", to: "/explore" },
    { kind: "Page", label: "Spaces directory", to: "/spaces" },
    { kind: "Page", label: "Opportunities", to: "/opportunities" },
    { kind: "Page", label: "Workspace", to: "/workspace" },
    { kind: "Person", label: "Ananya Rao", to: "/profile/$handle", params: { handle: "ananya" } },
    { kind: "Person", label: "Leo Carrillo", to: "/profile/$handle", params: { handle: "leo" } },
    { kind: "Space", label: "Early Builders", to: "/spaces" },
    { kind: "Org", label: "Lumen Labs", to: "/org/$slug", params: { slug: "lumen-labs" } },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-ink/40" />
      <div
        className="relative w-full max-w-xl bg-paper hairline rounded-md shadow-[0_8px_30px_rgba(0,0,0,0.12)] rise"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          autoFocus
          placeholder="Jump to anything…"
          className="w-full px-5 h-14 bg-transparent text-[15px] outline-none placeholder:text-g4 hairline-b"
        />
        <ul className="max-h-[60vh] overflow-auto py-2">
          {items.map((it, i) => (
            <li key={i}>
              <Link
                to={it.to as never}
                params={it.params as never}
                onClick={onClose}
                className="flex items-center justify-between px-5 py-2.5 hover:bg-g1 text-[14px]"
              >
                <span>{it.label}</span>
                <span className="mono text-[10px] text-g4">{it.kind}</span>
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
