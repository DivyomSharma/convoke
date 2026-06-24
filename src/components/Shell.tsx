"use client";
import Image from "next/image";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useCompletion } from "@ai-sdk/react";
import { ThemeToggle } from "./ThemeToggle";
import { VerticalMarquee } from "./VerticalMarquee";
import { globalSearch, type SearchResult } from "@/app/actions/search";
import { getWorkspaceContexts } from "@/app/actions/workspace";
import { getCommandCenterProfile } from "@/app/actions/user";
import { switchIdentity, type IdentityType } from "@/app/actions/identity";
import {
  Bell,
  ChevronDown,
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
  Briefcase,
  Bookmark,
  Award,
  Folder,
  BookOpen,
  Link as LinkIcon,
  Palette,
  Settings as SettingsIcon,
  Code,
  MapPin
} from "lucide-react";

type WorkspaceContext = {
  id?: string;
  label: string;
  href?: string;
  type?: "personal" | "org" | "space";
};

type WorkspaceContexts = {
  personal: WorkspaceContext;
  organizations: Array<WorkspaceContext>;
  spaces: Array<WorkspaceContext>;
  activeContext: {
    type: "personal" | "org" | "space";
    label: string;
    id?: string;
  };
  onboardingCompleted?: boolean;
};

type CommandCenterStats = {
  modes?: string[];
  stats?: {
    meets?: number;
    spaces?: number;
    projects?: number;
    research?: number;
    connections?: number;
  };
  aiContext?: {
    pendingApps?: number;
  };
};

const mainNav = [
  { href: "/explore", label: "Explore" },
  { href: "/spaces", label: "Spaces" },
  { href: "/meets", label: "Meets" },
  { href: "/challenges", label: "Challenges" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/projects", label: "Projects" },
  { href: "/organizations", label: "Organizations" },
  { href: "/research", label: "Research" },
  { href: "https://merch.theplotarmour.xyz", label: "Merch", external: true },
] as const;

export function Shell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [commandOpen, setCommandOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const [workspaceContexts, setWorkspaceContexts] = useState<WorkspaceContexts | null>(null);
  const [commandCenterStatsData, setCommandCenterStatsData] = useState<CommandCenterStats | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const passportHandle = user?.username || user?.fullName?.toLowerCase().replace(/\s+/g, "") || "builder";
  const commandCenterStats = isSignedIn ? commandCenterStatsData : null;

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

  useEffect(() => {
    if (!isSignedIn) return;

    let active = true;
    getWorkspaceContexts().then((contexts) => {
      if (active) setWorkspaceContexts(contexts);
    });
    getCommandCenterProfile().then((stats) => {
      if (active) setCommandCenterStatsData(stats);
    }).catch(console.error);

    return () => {
      active = false;
    };
  }, [isSignedIn]);

  const widthClass = wide ? "max-w-[1440px]" : "max-w-[1240px]";

  return (
    <div className="min-h-screen bg-paper text-ink">
      {workspaceContexts && workspaceContexts.onboardingCompleted === false && !pathname.startsWith('/onboarding') && (
        <div className="bg-brand text-ink text-[13px] py-2 px-5 text-center font-medium">
          You haven&apos;t completed your profile setup. <Link href="/onboarding" className="underline underline-offset-2">Complete it now</Link> to unlock all features.
        </div>
      )}
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
                target={'external' in item ? "_blank" : undefined}
                rel={'external' in item ? "noopener noreferrer" : undefined}
                className={
                  "transition-colors " +
                  (!('external' in item) && pathname.startsWith(item.href) ? "text-brand" : "hover:text-ink")
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
                
                <div className="flex items-center gap-3 relative">
                  {/* Global Context Indicator */}
                  {workspaceContexts?.activeContext && workspaceContexts.activeContext.type !== "personal" && (
                    <div className="hidden md:flex items-center gap-1.5 text-[12px] font-medium text-g5">
                      <span className="truncate max-w-[120px] text-ink">{workspaceContexts.activeContext.label}</span>
                      <span className="text-g4">•</span>
                      <span className="text-g4 capitalize">{workspaceContexts.activeContext.type === "org" ? "Organization" : "Space"}</span>
                    </div>
                  )}

                  <div className="relative">
                    <button 
                      onClick={() => setProfileOpen(!profileOpen)}
                      className="h-9 w-9 rounded-full overflow-hidden border border-g3 hover:border-[var(--brand)] transition-colors shrink-0 outline-none cursor-pointer flex items-center justify-center"
                    >
                      {user?.imageUrl ? (
                        <Image unoptimized fill={false} width={800} height={400} src={user.imageUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-g1 text-g5 text-[14px] font-semibold">
                          {(user?.fullName || "U").slice(0, 1)}
                        </div>
                      )}
                    </button>
                  
                  {profileOpen && (
                    <div className="fixed inset-0 z-40">
                      <div className="absolute inset-0" onClick={() => setProfileOpen(false)} />
                      <div className="absolute right-0 mt-2.5 w-[380px] sm:w-[400px] overflow-hidden rounded-[24px] border border-g3 bg-paper-card/95 shadow-2xl shadow-black/20 z-50 animate-in fade-in-50 slide-in-from-top-3 duration-200 backdrop-blur-xl flex flex-col max-h-[85vh]">
                        
                        {/* Header & Identity */}
                        <div className="px-5 py-5 pb-4 border-b border-g3/60 shrink-0">
                          {/* Context Switcher Integrated */}
                          {workspaceContexts && (
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] uppercase tracking-wider text-g5 font-bold">Active Identity</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => setContextOpen(!contextOpen)}
                                className="flex w-full items-center justify-between rounded-lg border border-g3 bg-g1/50 px-3 py-2 text-[13px] font-medium text-ink transition hover:border-g4 hover:bg-g2"
                              >
                                <div className="flex items-center gap-2">
                                  <LayoutGrid size={14} className="text-brand" />
                                  <span className="truncate">
                                    {workspaceContexts.activeContext?.label || "Personal"}
                                  </span>
                                </div>
                                <ChevronDown size={14} className="text-g5" />
                              </button>

                              {contextOpen && (
                                <div className="mt-2 rounded-lg border border-g3 bg-paper-card shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-1">
                                  <ContextSwitchBtn type="personal" label="Personal" href={workspaceContexts.personal.href} onClick={() => { setContextOpen(false); setProfileOpen(false); }} />
                                  
                                  {workspaceContexts.organizations?.length > 0 && (
                                    <div className="border-t border-g3">
                                      <div className="px-3 py-1.5 text-[10px] font-semibold text-g5 uppercase tracking-wider bg-g1/30">Organizations</div>
                                      {workspaceContexts.organizations.map((context) => (
                                        <ContextSwitchBtn key={context.id} type="org" id={context.id} label={context.label} href={context.href} onClick={() => { setContextOpen(false); setProfileOpen(false); }} />
                                      ))}
                                    </div>
                                  )}

                                  {workspaceContexts.spaces?.length > 0 && (
                                    <div className="border-t border-g3">
                                      <div className="px-3 py-1.5 text-[10px] font-semibold text-g5 uppercase tracking-wider bg-g1/30">Spaces</div>
                                      {workspaceContexts.spaces.map((context) => (
                                        <ContextSwitchBtn key={context.id} type="space" id={context.id} label={context.label} href={context.href} onClick={() => { setContextOpen(false); setProfileOpen(false); }} />
                                      ))}
                                    </div>
                                  )}

                                  <div className="px-3 py-2 bg-g1/30 text-[10px] text-g5 border-t border-g3 italic">
                                    Switching changes global identity context.
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Avatar Identity */}
                          <div className="flex flex-col mt-2">
                            <div className="flex items-center gap-2 mb-3">
                              <div className="h-4 w-4 rounded-full border-[3px] border-brand flex items-center justify-center shrink-0">
                                <div className="h-1.5 w-1.5 rounded-full bg-brand"></div>
                              </div>
                              <span className="text-[13px] font-semibold text-g5 uppercase tracking-wider">Avatar</span>
                            </div>
                            
                            <div className="text-[20px] font-bold text-ink leading-tight">
                              {user?.fullName || "Builder"}
                            </div>
                            
                            {user?.publicMetadata?.role ? (
                              <div className="text-[14px] text-g6 mt-1 font-medium">
                                {String(user.publicMetadata.role)}
                              </div>
                            ) : null}

                            {user?.publicMetadata?.location ? (
                              <div className="text-[13px] text-g5 mt-1 flex items-center gap-1.5">
                                <MapPin size={12} /> {String(user.publicMetadata.location)}
                              </div>
                            ) : null}

                            {commandCenterStats?.modes && commandCenterStats.modes.length > 0 && (
                              <div className="text-[13px] font-medium text-ink flex flex-wrap items-center mt-3 gap-x-2">
                                {commandCenterStats.modes.map((mode: string, i: number) => (
                                  <span key={mode} className="flex items-center">
                                    {mode}
                                    {i < commandCenterStats.modes!.length - 1 && <span className="text-brand mx-2">●</span>}
                                  </span>
                                ))}
                              </div>
                            )}

                            <div className="mt-3 inline-block">
                              <span className="bg-g1/50 border border-g3/60 px-2.5 py-1 rounded-md text-[12px] font-medium text-g6">
                                @{passportHandle}
                              </span>
                            </div>
                          </div>
                          
                          {/* Mono Stats Row */}
                          <div className="flex items-center justify-between mt-6 px-1 mono bg-g1/20 border border-g3/40 rounded-xl py-3">
                            <div className="flex flex-col items-center">
                              <span className="font-bold text-ink text-[14px] leading-tight">{commandCenterStats?.stats?.meets || 0}</span>
                              <span className="text-[10px] text-g5 uppercase tracking-wider mt-1">Meets</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="font-bold text-ink text-[14px] leading-tight">{commandCenterStats?.stats?.spaces || 0}</span>
                              <span className="text-[10px] text-g5 uppercase tracking-wider mt-1">Spaces</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="font-bold text-ink text-[14px] leading-tight">{commandCenterStats?.stats?.projects || 0}</span>
                              <span className="text-[10px] text-g5 uppercase tracking-wider mt-1">Projects</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="font-bold text-ink text-[14px] leading-tight">{commandCenterStats?.stats?.research || 0}</span>
                              <span className="text-[10px] text-g5 uppercase tracking-wider mt-1">Research</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <span className="font-bold text-ink text-[14px] leading-tight">{commandCenterStats?.stats?.connections || 0}</span>
                              <span className="text-[10px] text-g5 uppercase tracking-wider mt-1">Conns</span>
                            </div>
                          </div>
                        </div>

                        <div className="overflow-y-auto no-scrollbar flex-1 relative">
                          {/* Navigation Sections */}
                          <div className="p-3 border-b border-g3/40">
                            <div className="grid grid-cols-2 gap-1">
                              <Link href={`/profile/${passportHandle}`} onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-ink hover:bg-g2 transition-colors">
                                <span className="text-g5"><LayoutTemplate size={16} /></span> Passport
                              </Link>
                              <Link href="/workspace" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-ink hover:bg-g2 transition-colors">
                                <span className="text-g5"><Briefcase size={16} /></span> Workspace
                              </Link>
                              <Link href="/applications" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-ink hover:bg-g2 transition-colors">
                                <span className="text-g5"><CalendarDays size={16} /></span> Applications
                              </Link>
                              <Link href="/bookmarks" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-ink hover:bg-g2 transition-colors">
                                <span className="text-g5"><Bookmark size={16} /></span> Bookmarks
                              </Link>
                              <Link href="/notifications" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-ink hover:bg-g2 transition-colors">
                                <span className="text-g5"><Bell size={16} /></span> Notifications
                              </Link>
                              <Link href="/calendar" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-ink hover:bg-g2 transition-colors">
                                <span className="text-g5"><CalendarDays size={16} /></span> Calendar
                              </Link>
                              <Link href="/workspace/tickets" onClick={() => setProfileOpen(false)} className="col-span-2 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-ink hover:bg-g2 transition-colors">
                                <span className="text-g5"><Award size={16} /></span> Certificates
                              </Link>
                            </div>
                          </div>

                          <div className="p-3 border-b border-g3/40">
                            <div className="grid grid-cols-2 gap-1">
                              <Link href="/projects" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-ink hover:bg-g2 transition-colors">
                                <span className="text-g5"><Folder size={16} /></span> Projects
                              </Link>
                              <Link href="/research" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-ink hover:bg-g2 transition-colors">
                                <span className="text-g5"><BookOpen size={16} /></span> Research
                              </Link>
                              <Link href="/spaces" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-ink hover:bg-g2 transition-colors">
                                <span className="text-g5"><Users size={16} /></span> Spaces
                              </Link>
                              <Link href="/organizations" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-ink hover:bg-g2 transition-colors">
                                <span className="text-g5"><Building2 size={16} /></span> Organizations
                              </Link>
                              <Link href="/connections" onClick={() => setProfileOpen(false)} className="col-span-2 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-ink hover:bg-g2 transition-colors">
                                <span className="text-g5"><LinkIcon size={16} /></span> Connections
                              </Link>
                            </div>
                          </div>

                          <div className="p-3">
                            <div className="grid grid-cols-1 gap-1">
                              <button className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-ink hover:bg-g2 transition-colors text-left w-full">
                                <span className="text-g5"><Palette size={16} /></span> Appearance
                              </button>
                              <Link href="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-ink hover:bg-g2 transition-colors">
                                <span className="text-g5"><SettingsIcon size={16} /></span> Settings
                              </Link>
                              <button className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-ink hover:bg-g2 transition-colors text-left w-full opacity-60 cursor-not-allowed">
                                <span className="text-g5"><Code size={16} /></span> Developer Integrations
                              </button>
                            </div>
                          </div>

                          {/* Convoke Assistant AI Block */}
                          <div className="p-5 bg-[#0a0a0a] border-t border-brand/20 relative mx-3 mb-3 rounded-2xl shadow-inner">
                            <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-brand/60 to-transparent shadow-[0_0_8px_rgba(198,163,107,0.8)]" />
                            <div className="flex items-center gap-2 mb-3">
                              <Sparkles size={14} className="text-brand" />
                              <span className="text-[13px] font-serif text-brand tracking-wide">Convoke Assistant</span>
                            </div>
                            <div className="text-[13px] text-g5 leading-relaxed mb-4 font-medium space-y-1">
                              <p className="text-ink">Good evening, {user?.firstName || "Builder"}.</p>
                              <p>{commandCenterStats?.aiContext?.pendingApps || 0} applications pending.</p>
                              <p>AI Saturdays starts tomorrow.</p>
                              <p>3 opportunities match your profile.</p>
                            </div>
                            <button className="w-full text-center text-[12px] py-2 bg-paper border border-g3 hover:border-brand/50 hover:bg-brand/5 transition-all rounded-lg text-ink font-medium">
                              Ask Convoke
                            </button>
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-4 bg-g1/30 flex items-center justify-between border-t border-g3/60 shrink-0 mt-auto">
                          <div className="text-[11px] text-g5 mono tracking-wide flex flex-col leading-tight">
                            <span>Build quietly.</span>
                            <span>Convoke MMXXVI</span>
                          </div>
                          <button 
                            onClick={async () => {
                              setProfileOpen(false);
                              await signOut();
                              router.push("/");
                            }}
                            className="text-[12px] text-g5 hover:text-ink transition-colors flex items-center gap-1.5 font-medium group"
                          >
                            Sign Out <ArrowRightIcon />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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
                The operating system for student builders, founders, creator communities, and opportunity-led ecosystems. For people building the future.
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
            <div className="flex flex-col gap-2 md:items-start items-center">
              <span>{new Date().getFullYear()} Convoke. All rights reserved.</span>
              <a href="https://merch.theplotarmour.xyz" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors text-[10px]">Fulfillment by PlotArmour Merch</a>
            </div>
            <div className="flex gap-4">
              <span>Midnight network theme.</span>
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
                      target={'external' in item ? "_blank" : undefined}
                      rel={'external' in item ? "noopener noreferrer" : undefined}
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
                    <Link href="/bookmarks" onClick={() => setMobileMenuOpen(false)} className="text-[18px] text-ink block py-1">Bookmarks</Link>
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

function ContextSwitchBtn({ type, id, label, href, onClick }: { type: IdentityType; id?: string; label: string; href?: string; onClick: () => void }) {
  const router = useRouter();
  const handleSwitch = async () => {
    onClick();
    await switchIdentity(type, id);
    if (href) {
      router.push(href);
    }
  };

  return (
    <button
      onClick={handleSwitch}
      className="flex w-full items-center gap-3 rounded-[0px] px-3 py-2.5 text-[13px] text-g6 transition hover:bg-g1 hover:text-ink text-left cursor-pointer"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-sm border border-g3 bg-g1 text-brand shrink-0">
        {label.slice(0, 1).toUpperCase()}
      </span>
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <span className="mono text-[10px] text-g4">Switch</span>
    </button>
  );
}

function ArrowRightIcon() {
  return <span className="mono text-[10px] text-g4">Open</span>;
}

function CommandK({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const { completion, complete, isLoading: aiLoading } = useCompletion({
    api: "/api/command",
  });

  const staticItems = [
    { type: "Page", title: "Explore", subtitle: "Live discovery feed", href: "/explore", id: "page-explore" },
    { type: "Page", title: "Meets", subtitle: "Upcoming and live gatherings", href: "/meets", id: "page-events" },
    { type: "Page", title: "Spaces", subtitle: "Communities and collectives", href: "/spaces", id: "page-spaces" },
    { type: "Page", title: "Workspace", subtitle: "Your private operating surface", href: "/workspace", id: "page-workspace" },
  ];

  useEffect(() => {
    if (query.length < 2) {
      return;
    }

    let active = true;
    const timeoutId = setTimeout(() => {
      setLoading(true);

      // 1. Fetch Entity Search
      globalSearch(query).then((response) => {
        if (!active) return;
        setResults(response);
      }).catch(console.error).finally(() => {
        if (active) setLoading(false);
      });
      
      // 2. Trigger AI OS 
      complete(query);

    }, 500); // slightly longer debounce so AI doesn't trigger on every keystroke

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [query, complete]);

  const displayItems = query.length < 2 ? staticItems : results;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/45 px-4 pt-[12vh]" onClick={onClose}>
      <div
        className="premium-card campus-frame relative w-full max-w-2xl flex flex-col"
        onClick={(meet) => meet.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-g3 px-5 py-4 shrink-0">
          <Search size={16} className="text-[var(--brand)]" />
          <input
            autoFocus
            value={query}
            onChange={(meet) => setQuery(meet.target.value)}
            placeholder="Search people, projects, spaces or ask anything..."
            className="w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-g4"
          />
          <span className="mono text-[11px] text-g4">Esc</span>
        </div>

        <div className="flex flex-col md:flex-row overflow-hidden max-h-[65vh]">
          {/* Entity Search Column */}
          <div className="flex-1 overflow-auto border-r border-g3/50 md:min-w-[50%]">
            <div className="px-5 py-2 eyebrow border-b border-g3/30 sticky top-0 bg-paper-card z-10">Network</div>
            <ul className="px-2 py-2">
              {loading && query.length >= 2 ? (
                <li className="px-4 py-4 text-[13px] text-g5">Searching...</li>
              ) : null}

              {!loading && query.length >= 2 && results.length === 0 ? (
                <li className="px-4 py-4 text-[13px] text-g5">No entities found for &quot;{query}&quot;</li>
              ) : null}

              {displayItems.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center justify-between rounded-[14px] px-4 py-3 text-[14px] transition hover:bg-g1"
                  >
                    <div className="min-w-0 pr-4">
                      <div className="text-ink truncate">{item.title}</div>
                      {item.subtitle ? <div className="mt-1 text-[12px] text-g5 truncate">{item.subtitle}</div> : null}
                    </div>
                    <span className="mono text-[10px] uppercase tracking-[0.18em] text-g4 shrink-0">{item.type}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* AI OS Column */}
          {(query.length >= 2 || completion) && (
            <div className="flex-1 overflow-auto bg-g1/20 md:min-w-[50%]">
               <div className="px-5 py-2 eyebrow border-b border-g3/30 sticky top-0 bg-g1/80 backdrop-blur-md z-10 flex items-center justify-between">
                 <span>Convoke AI</span>
                 {aiLoading && <span className="animate-pulse w-2 h-2 rounded-full bg-[var(--brand)]"></span>}
               </div>
               <div className="p-5 text-[13.5px] leading-relaxed text-g6">
                 {query.length >= 2 && completion ? (
                   <div className="prose prose-sm prose-invert max-w-none">
                     {completion}
                   </div>
                 ) : (
                   <span className="text-g5 italic">Thinking...</span>
                 )}
               </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-g3 px-5 py-3 text-[11px] text-g4 mono shrink-0">
          <span>Enter to open</span>
          <span>Cmd K to reopen</span>
        </div>
      </div>
    </div>
  );
}
