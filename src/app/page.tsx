import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Avatar } from "@/components/Avatar";
import { FloatingArt } from "@/components/FloatingArt";
import { Briefcase, BriefcaseBusiness, Code, ClipboardList, Users, GraduationCap } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function Landing() {
  const dbEvents = await prisma.event.findMany({ 
    take: 3,
    orderBy: { startTime: 'asc' },
  });
  
  const dbSpaces = await prisma.space.findMany({ take: 3 });
  
  const dbOpportunities = await prisma.opportunity.findMany({ take: 1, include: { organization: true } });
  
  const dbPeople = await prisma.user.findMany({ take: 5 });

  const latestProject = await prisma.project.findFirst({
    include: { user: true },
    orderBy: { createdAt: "desc" },
  });

  const hack = dbEvents[2] || dbEvents[0]; // fallback if <3 events
  const role = dbOpportunities[0];
  const featuredSpaces = dbSpaces;

  return (
    <Shell wide>
      <section className="mx-auto max-w-[1440px] px-5 sm:px-8 pt-10 pb-16 relative overflow-hidden">
        {/* Floating Arts */}
        <FloatingArt shape="circle" className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <FloatingArt shape="star" className="absolute top-20 left-10 w-12 h-12 opacity-20 pointer-events-none -rotate-12" color="var(--brand)" />
        <FloatingArt shape="dots" className="absolute bottom-20 right-20 w-24 h-24 opacity-30 pointer-events-none" />

        {/* Hero Section */}
        <div className="pt-10 pb-8 relative z-10">
          <h1 className="serif text-6xl md:text-8xl lg:text-9xl leading-[0.9] max-w-[14ch] tracking-tight">
            Find your <span className="text-[var(--brand)] italic pr-4 relative">
              life&apos;s work.
              <FloatingArt shape="squiggle" className="absolute -bottom-6 left-0 w-full h-8 opacity-40 pointer-events-none" color="var(--brand)" />
            </span>
          </h1>
          <p className="mt-6 text-g5 text-lg md:text-xl max-w-[40ch] leading-relaxed">
            The premium network for builders, hackers, and creators. Discover opportunities, join spaces, and launch your next project.
          </p>

          {/* Unstop-style Category Cards */}
          <div className="flex gap-4 mt-16 overflow-x-auto pb-6 -mx-5 sm:mx-0 px-5 sm:px-0" style={{ scrollbarWidth: 'none' }}>
            <Link href="/explore?f=Internships" className="group flex-shrink-0 w-40 h-40 bg-white border border-g3 rounded-2xl p-5 flex flex-col justify-between hover:border-[var(--brand)] hover:shadow-[4px_4px_0_0_var(--brand)] transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Briefcase size={24} strokeWidth={1.5} />
              </div>
              <span className="font-medium text-ink">Internships</span>
            </Link>
            <Link href="/explore?f=Jobs" className="group flex-shrink-0 w-40 h-40 bg-white border border-g3 rounded-2xl p-5 flex flex-col justify-between hover:border-[var(--brand)] hover:shadow-[4px_4px_0_0_var(--brand)] transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center group-hover:scale-110 transition-transform">
                <BriefcaseBusiness size={24} strokeWidth={1.5} />
              </div>
              <span className="font-medium text-ink">Jobs</span>
            </Link>
            <Link href="/explore?f=Hackathons" className="group flex-shrink-0 w-40 h-40 bg-white border border-g3 rounded-2xl p-5 flex flex-col justify-between hover:border-[var(--brand)] hover:shadow-[4px_4px_0_0_var(--brand)] transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Code size={24} strokeWidth={1.5} />
              </div>
              <span className="font-medium text-ink">Hackathons</span>
            </Link>
            <Link href="/explore?f=MockTests" className="group flex-shrink-0 w-40 h-40 bg-white border border-g3 rounded-2xl p-5 flex flex-col justify-between hover:border-[var(--brand)] hover:shadow-[4px_4px_0_0_var(--brand)] transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center group-hover:scale-110 transition-transform">
                <ClipboardList size={24} strokeWidth={1.5} />
              </div>
              <span className="font-medium text-ink">Mock Tests</span>
            </Link>
            <Link href="/explore?f=Mentorships" className="group flex-shrink-0 w-40 h-40 bg-white border border-g3 rounded-2xl p-5 flex flex-col justify-between hover:border-[var(--brand)] hover:shadow-[4px_4px_0_0_var(--brand)] transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users size={24} strokeWidth={1.5} />
              </div>
              <span className="font-medium text-ink">Mentorships</span>
            </Link>
            <Link href="/explore?f=Courses" className="group flex-shrink-0 w-40 h-40 bg-white border border-g3 rounded-2xl p-5 flex flex-col justify-between hover:border-[var(--brand)] hover:shadow-[4px_4px_0_0_var(--brand)] transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-[var(--brand)]/10 text-[var(--brand)] flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap size={24} strokeWidth={1.5} />
              </div>
              <span className="font-medium text-ink">Courses</span>
            </Link>
          </div>
        </div>
        
        {/* Editorial masthead — a single line of typography */}
        <div className="flex items-baseline justify-between flex-wrap gap-y-3 hairline-b pb-6 mt-8">
          <div className="eyebrow">Friday, June 19 · 2026 · Issue 1,284</div>
          <div className="eyebrow">Today on Convoke</div>
        </div>

        {/* Broken editorial grid demonstrating the network */}
        <div className="grid grid-cols-12 gap-6 lg:gap-8 mt-10">
          {/* Lead — Launch */}
          <article className="col-span-12 lg:col-span-7 group">
            {latestProject ? (
              <Link href={`/profile/${latestProject.user.handle || latestProject.user.id}`} className="block">
                <div className="relative overflow-hidden bg-g2 aspect-[4/3] w-full h-[460px] md:h-[560px]">
                  {latestProject.url ? (
                    <img
                      src={latestProject.url}
                      alt=""
                      width={1280}
                      height={880}
                      className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-g4">No cover image</div>
                  )}
                </div>
                <div className="mt-5 flex items-baseline gap-3 eyebrow">
                  <span>Project · Recently Launched</span>
                </div>
                <h1 className="serif text-4xl md:text-6xl lg:text-7xl leading-[0.95] mt-3 max-w-[14ch]">
                  {latestProject.title}
                </h1>
                <p className="mt-5 text-g5 max-w-[52ch] text-[15px] leading-relaxed">
                  {latestProject.description}
                </p>
                <div className="mt-5 flex items-center gap-3 text-[13px] text-g6">
                  <Avatar src={latestProject.user.avatarUrl || ""} name={latestProject.user.name || "User"} size={24} />
                  <span className="text-ink">{latestProject.user.name || "Unknown Builder"}</span>
                  <span className="text-g4">·</span>
                  <span>{latestProject.user.role || "Builder"}</span>
                </div>
              </Link>
            ) : (
              <div className="w-full h-full min-h-[460px] flex items-center justify-center border border-g3 text-g5 eyebrow">
                No projects launched yet.
              </div>
            )}
          </article>

          {/* Right rail — tonight */}
          <aside className="col-span-12 lg:col-span-5 lg:pl-8 lg:hairline-l hairline-t lg:border-t-0 pt-8 lg:pt-0" style={{ borderLeft: "1px solid var(--g3)" }}>
            <div className="eyebrow mb-5">Tonight & this week</div>
            <ul className="divide-y divide-g3">
              {dbEvents.map((e, idx) => (
                <li key={e.id}>
                  <Link href="/explore" className="grid grid-cols-[1fr_auto] gap-4 py-5 group">
                    <div className="min-w-0">
                      <div className="mono text-[11px] text-g5 uppercase tracking-wider">Event · {e.location || "Online"}</div>
                      <h3 className="serif text-2xl md:text-[28px] leading-[1.05] mt-1 group-hover:italic transition-all">
                        {e.title}
                      </h3>
                      <div className="mt-2 text-[13px] text-g5">
                        {new Date(e.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} · {e.location || "TBA"} · 10+ going
                      </div>
                    </div>
                    <div className="w-20 h-20 shrink-0 overflow-hidden bg-g2">
                      <img src={`/assets/ph-meetup.jpg`} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/explore" className="mt-5 inline-block eyebrow text-ink underline-link">
              See full feed →
            </Link>
          </aside>
        </div>
      </section>

      {/* Section: Spaces — three featured */}
      <section className="mx-auto max-w-[1440px] px-5 sm:px-8 mt-10 hairline-t pt-12">
        <div className="flex items-baseline justify-between">
          <h2 className="serif text-3xl md:text-5xl">Where people gather.</h2>
          <Link href="/spaces" className="eyebrow underline-link text-ink">All spaces →</Link>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredSpaces.map((s, idx) => (
            <Link key={s.id} href="/spaces" className="group block">
              <div className="aspect-[4/5] overflow-hidden bg-g2">
                <img src={`/assets/ph-coworking.jpg`} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="serif text-2xl">{s.name}</h3>
                <span className="mono text-[11px] text-g5">Public Space</span>
              </div>
              <p className="text-g5 text-[14px] mt-1">{s.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Two-up: Hackathon + Open role (Poster Cards) */}
      <section className="mx-auto max-w-[1440px] px-5 sm:px-8 mt-20 grid grid-cols-1 md:grid-cols-2 gap-10">
        <Link href="/opportunities" className="brutalist-card p-8 md:p-10 group block">
          <div className="flex items-start justify-between">
            <div className="eyebrow">Event · {hack?.location || "TBA"}</div>
            <div className="w-8 h-8 rounded-full bg-[var(--brand)] text-paper flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="mono text-[14px]">→</span>
            </div>
          </div>
          <h3 className="serif text-4xl md:text-5xl mt-6 leading-[1.05] group-hover:italic transition-all duration-300">{hack?.title || "Upcoming Event"}</h3>
          <p className="text-g5 mt-4 text-[16px]">{hack ? new Date(hack.startTime).toLocaleDateString() : "TBA"} · Builders going</p>
          <div className="mt-10 flex -space-x-2">
            {dbPeople.map((p, i) => (
              <Avatar key={p.id} src={p.avatarUrl || ""} name={p.name || "User"} size={32} />
            ))}
            <span className="ml-4 text-ink font-medium text-[14px] self-center">+ 10 others</span>
          </div>
        </Link>
        <Link href="/opportunities" className="brutalist-card p-8 md:p-10 group block">
          <div className="flex items-start justify-between">
            <div className="eyebrow">{role?.type || "Role"} · {role?.location || "Remote"}</div>
            <div className="w-8 h-8 rounded-full bg-[var(--brand)] text-paper flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="mono text-[14px]">→</span>
            </div>
          </div>
          <h3 className="serif text-4xl md:text-5xl mt-6 leading-[1.05] group-hover:italic transition-all duration-300">{role?.title || "Open Position"}</h3>
          <p className="text-g5 mt-4 text-[16px]">{role?.organization?.name || "Organization"} · {role?.compensation || "Negotiable"}</p>
          <div className="mt-10 flex flex-wrap gap-2">
            <span className="stamp">Full-time</span>
            <span className="stamp">Remote</span>
          </div>
        </Link>
      </section>

      {/* Closing line */}
      <section className="mx-auto max-w-[1440px] px-5 sm:px-8 mt-24 mb-16">
        <p className="serif text-4xl md:text-6xl lg:text-7xl leading-[1.02] max-w-[18ch]">
          Not a feed. Not a network. A <em>place</em>.
        </p>
        <div className="mt-8 flex items-center gap-6">
          <Link href="/explore" className="bg-ink text-paper px-5 py-3 text-[14px] hover:bg-ink-2 transition-colors">
            Enter the feed
          </Link>
          <Link href="/spaces" className="underline-link text-[14px]">Browse spaces →</Link>
        </div>
      </section>
    </Shell>
  );
}
