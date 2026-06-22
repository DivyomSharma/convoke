"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { ThemeToggle } from "./ThemeToggle";
import { VerticalMarquee } from "./VerticalMarquee";
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
  Menu,
  X,
  Compass,
  Users,
  CalendarDays,
  Briefcase
} from "lucide-react";

const mainNav = [
  { href: "/explore", label: "Explore" },
  { href: "/spaces", label: "Spaces" },
  { href: "/meets", label: "Meets" },
  { href: "/challenges", label: "Challenges" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/projects", label: "Projects" },
  { href: "/organizations", label: "Organizations" },
  { href: "/research", label: "Research" },
] as const;

export function Shell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [commandOpen, setCommandOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const passportHandle = user?.username || user?.fullName?.toLowerCase().replace(/\s+/g, "") || "builder";

  useEffect(() => {
    const handleKeydown = (meet: KeyboardEvent) => {
      if ((meet.metaKey || meet.ctrlKey) && meet.key.toLowerCase() === "k") {
        meet.preventDefault();
        setCommandOpen((current) => !current);
      }
      if (meet.key === "Escape") setCommandOpen(false);
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  const widthClass = wide ? "max-w-[1440px]" : "max-w-[1240px]";

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-30 border-b border-g3/80 bg-paper/75 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 w-full items-center gap-5 px-5 sm:px-8">
          <Link href="/" className="serif text-[22px] leading-none tracking-tight text-ink">
            Convoke.
          </Link>

          <nav className="hidden items-center gap-6 mono text-[11px] uppercase tracking-[0.14em] text-g5 xl:flex">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={
                  "transition-colors " +
                  (pathname.startsWith(item.href) ? "text-brand" : "hover:text-ink")
                }
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setCommandOpen(true)}
              className="hidden items-center gap-2 border border-g3 bg-g1/35 px-3 h-8 rounded-sm text-left mono text-[10px] uppercase tracking-wider text-g5 transition hover:border-g4 hover:bg-g1/60 md:flex md:w-48 cursor-pointer"
            >
              <Search size={11} className="text-brand" />
              <span>Search</span>
              <span className="ml-auto text-[9px] text-g4">Ctrl K</span>
            </button>
            <ThemeToggle />
            {isSignedIn ? (
              <>
                <Link
                  href="/workspace"
                  className="hidden h-8 w-8 items-center justify-center rounded-sm border border-g3 bg-paper-card text-g5 transition hover:border-g4 hover:text-ink sm:inline-flex"
                  aria-label="Workspace"
                >
                  <LayoutTemplate size={14} strokeWidth={1.5} />
                </Link>
                <Link
                  href="/notifications"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-g3 bg-paper-card text-g5 transition hover:border-g4 hover:text-ink"
                  aria-label="Notifications"
                >
                  <Bell size={14} strokeWidth={1.5} />
                </Link>
                <Link
                  href="/messages"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-g3 bg-paper-card text-g5 transition hover:border-g4 hover:text-ink"
                  aria-label="Messages"
                >
                  <Mail size={14} strokeWidth={1.5} />
                </Link>
                
                <div className="relative">
                  <button 
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="h-9 w-9 rounded-full overflow-hidden border border-g3 hover:border-[var(--brand)] transition-colors shrink-0 outline-none cursor-pointer flex items-center justify-center"
                  >
                    {user?.imageUrl ? (
                      <img src={user.imageUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-g1 text-g5 text-[14px] font-semibold">
                        {(user?.fullName || "U").slice(0, 1)}
                      </div>
                    )}
                  </button>
                  
                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                      <div className="absolute right-0 mt-2.5 w-[320px] overflow-hidden rounded-[22px] border border-g3 bg-paper-card/95 shadow-2xl shadow-black/20 z-50 animate-in fade-in-50 slide-in-from-top-3 duration-200 backdrop-blur-xl">
                        <div className="border-b border-g3/60 px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-11 w-11 overflow-hidden rounded-full border border-g3 bg-g1">
                              {user?.imageUrl ? <img src={user.imageUrl} alt="" className="h-full w-full object-cover" /> : null}
                            </div>
                            <div className="min-w-0">
                              <div className="truncate text-[14px] font-semibold text-ink">{user?.fullName || "Builder"}</div>
                              <div className="truncate text-[12px] text-g5">@{passportHandle}</div>
                            </div>
                          </div>
                          {user?.publicMetadata?.headline ? (
                            <div className="mt-3 text-[12px] leading-5 text-g6">{String(user.publicMetadata.headline)}</div>
                          ) : null}
                        </div>

                        <div className="grid grid-cols-2 gap-2 p-3">
                          <Link 
                            href={`/profile/${passportHandle}`}
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center justify-center rounded-2xl border border-g3 bg-g1/30 px-3 py-3 text-[12px] text-g6 transition hover:border-g4 hover:bg-g1/60 hover:text-ink"
                          >
                            Passport
                          </Link>
                          <Link 
                            href="/workspace"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center justify-center rounded-2xl border border-g3 bg-g1/30 px-3 py-3 text-[12px] text-g6 transition hover:border-g4 hover:bg-g1/60 hover:text-ink"
                          >
                            Workspace
                          </Link>
                          <Link 
                            href="/settings"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center justify-center rounded-2xl border border-g3 bg-g1/30 px-3 py-3 text-[12px] text-g6 transition hover:border-g4 hover:bg-g1/60 hover:text-ink"
                          >
                            Settings
                          </Link>
                          <button 
                            onClick={async () => {
                              setProfileOpen(false);
                              await signOut();
                              router.push("/");
                            }}
                            className="flex items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-3 text-[12px] text-red-500 transition hover:bg-red-500/15 cursor-pointer"
                          >
                            Log Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <Link href="/auth" className="ink-button px-5 text-[13px] font-medium flex items-center justify-center">
                Join
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 flex min-h-screen">
        {/* Left Decorative Column */}
        <div className="hidden 2xl:flex w-14 fixed left-0 top-16 bottom-0 border-r border-g3/60 bg-paper items-center justify-center pointer-events-none z-0">
          <VerticalMarquee duration={180} text="CONVOKE • THE INTERNET HOME FOR BUILDERS • " />
        </div>
        
        <div className="flex-1 w-full 2xl:px-14">
          {children}
        </div>

        {/* Right Decorative Column */}
        <div className="hidden 2xl:flex w-14 fixed right-0 top-16 bottom-0 border-l border-g3/60 bg-paper items-center justify-center pointer-events-none z-0">
          <VerticalMarquee duration={180} text="ESTABLISHED MMXXVI • GLOBAL BUILDER NETWORK • " />
        </div>
      </main>

      <footer className="relative z-10 mt-24 border-t border-g3 bg-paper/85">
        <div className={`mx-auto px-5 sm:px-8 py-16 ${widthClass}`}>
          <div className="grid gap-10 md:grid-cols-4 lg:grid-cols-5">
            <div className="md:col-span-2 lg:col-span-2">
              <Link href="/" className="serif text-[22px] leading-none tracking-tight text-ink">
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
                <li><Link href="/meets" className="hover:text-ink transition-colors">Meets</Link></li>
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

      {/* Mobile Bottom Tab Bar */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-g3 bg-paper/95 backdrop-blur-xl px-2 pb-[env(safe-area-inset-bottom)] pt-2">
        <Link href="/explore" className="flex flex-col items-center gap-1 p-2 min-h-[44px] min-w-[44px] text-g5 hover:text-ink">
          <Compass size={20} strokeWidth={1.5} />
          <span className="text-[10px] uppercase tracking-wider">Explore</span>
        </Link>
        <Link href="/spaces" className="flex flex-col items-center gap-1 p-2 min-h-[44px] min-w-[44px] text-g5 hover:text-ink">
          <Users size={20} strokeWidth={1.5} />
          <span className="text-[10px] uppercase tracking-wider">Spaces</span>
        </Link>
        <Link href="/meets" className="flex flex-col items-center gap-1 p-2 min-h-[44px] min-w-[44px] text-g5 hover:text-ink">
          <CalendarDays size={20} strokeWidth={1.5} />
          <span className="text-[10px] uppercase tracking-wider">Meets</span>
        </Link>
        <button 
          onClick={() => setCommandOpen(true)}
          className="flex flex-col items-center gap-1 p-2 min-h-[44px] min-w-[44px] text-g5 hover:text-ink cursor-pointer"
        >
          <Search size={20} strokeWidth={1.5} />
          <span className="text-[10px] uppercase tracking-wider">Search</span>
        </button>
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 p-2 min-h-[44px] min-w-[44px] text-g5 hover:text-ink cursor-pointer"
        >
          <Menu size={20} strokeWidth={1.5} />
          <span className="text-[10px] uppercase tracking-wider">Menu</span>
        </button>
      </div>

      {/* Mobile Hamburger Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-50 flex flex-col bg-paper animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="flex items-center justify-between border-b border-g3 px-5 py-4">
            <Link href="/" className="serif text-[22px] leading-none tracking-tight text-ink" onClick={() => setMobileMenuOpen(false)}>
              Convoke.
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-g5 hover:text-ink cursor-pointer"
            >
              <X size={24} strokeWidth={1.5} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-8 pb-[100px]">
            <div>
              <h4 className="eyebrow mb-4 text-g5">Navigation</h4>
              <ul className="space-y-4">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link 
                      href={item.href} 
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-[18px] text-ink block py-1"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {isSignedIn ? (
              <div>
                <h4 className="eyebrow mb-4 text-g5">Account</h4>
                <ul className="space-y-4">
                  <li>
                    <Link href="/workspace" onClick={() => setMobileMenuOpen(false)} className="text-[18px] text-ink block py-1">Workspace</Link>
                  </li>
                  <li>
                  <Link href={`/profile/${passportHandle}`} onClick={() => setMobileMenuOpen(false)} className="text-[18px] text-ink block py-1">Passport</Link>
                  </li>
                  <li>
                    <Link href="/settings" onClick={() => setMobileMenuOpen(false)} className="text-[18px] text-ink block py-1">Settings</Link>
                  </li>
                  <li>
                    <button 
                      onClick={async () => {
                        setMobileMenuOpen(false);
                        await signOut();
                        router.push("/");
                      }}
                      className="text-[18px] text-red-500 block py-1 cursor-pointer text-left w-full"
                    >
                      Log Out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="mt-auto pt-8">
                <Link 
                  href="/auth" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="ink-button w-full py-4 text-center text-[15px]"
                >
                  Join Convoke
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CommandK({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const staticItems = [
    { type: "Page", title: "Explore", subtitle: "Live discovery feed", href: "/explore", id: "page-explore" },
    { type: "Page", title: "Meets", subtitle: "Upcoming and live gatherings", href: "/meets", id: "page-events" },
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
        onClick={(meet) => meet.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-g3 px-5 py-4">
          <Search size={16} className="text-[var(--brand)]" />
          <input
            autoFocus
            value={query}
            onChange={(meet) => setQuery(meet.target.value)}
            placeholder="Jump into people, spaces, meets, opportunities"
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
