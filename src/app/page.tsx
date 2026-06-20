import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Avatar } from "@/components/Avatar";
import { AmbientGlow } from "@/components/AmbientGlow";
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
        {/* Ambient Glows */}
        <AmbientGlow className="top-[-20%] right-[-10%] w-[800px] h-[800px] opacity-[0.08] dark:opacity-[0.15]" color="var(--brand)" />
        <AmbientGlow className="top-[20%] left-[-10%] w-[600px] h-[600px] opacity-[0.05] dark:opacity-[0.1]" color="var(--brand)" />

        {/* Hero Section */}
        <div className="pt-20 pb-12 relative z-10">
          <h1 className="serif text-7xl md:text-8xl lg:text-9xl leading-[0.95] max-w-[12ch] tracking-tight">
            Find your <span className="text-[var(--brand)] italic pr-4 relative">
              life&apos;s work.
            </span>
          </h1>
          <p className="mt-8 text-g5 text-lg md:text-xl max-w-[40ch] leading-relaxed">
            The premium network for builders, hackers, and creators. Discover opportunities, join spaces, and launch your next project.
          </p>

          {/* Premium Category Cards */}
          <div className="flex gap-4 mt-20 overflow-x-auto pb-8 -mx-5 sm:mx-0 px-5 sm:px-0" style={{ scrollbarWidth: 'none' }}>
            <Link href="/explore?f=Internships" className="group flex-shrink-0 w-44 h-44 bg-paper/60 backdrop-blur-xl border border-g3 rounded-2xl p-6 flex flex-col justify-between hover:border-[var(--brand)] hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-g1 group-hover:bg-[var(--brand)] text-[var(--brand)] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm border border-g2">
                <Briefcase size={22} strokeWidth={1.5} />
              </div>
              <span className="font-medium text-ink text-lg">Internships</span>
            </Link>
            <Link href="/explore?f=Jobs" className="group flex-shrink-0 w-44 h-44 bg-paper/60 backdrop-blur-xl border border-g3 rounded-2xl p-6 flex flex-col justify-between hover:border-[var(--brand)] hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-g1 group-hover:bg-[var(--brand)] text-[var(--brand)] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm border border-g2">
                <BriefcaseBusiness size={22} strokeWidth={1.5} />
              </div>
              <span className="font-medium text-ink text-lg">Jobs</span>
            </Link>
            <Link href="/explore?f=Hackathons" className="group flex-shrink-0 w-44 h-44 bg-paper/60 backdrop-blur-xl border border-g3 rounded-2xl p-6 flex flex-col justify-between hover:border-[var(--brand)] hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-g1 group-hover:bg-[var(--brand)] text-[var(--brand)] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm border border-g2">
                <Code size={22} strokeWidth={1.5} />
              </div>
              <span className="font-medium text-ink text-lg">Hackathons</span>
            </Link>
            <Link href="/explore?f=MockTests" className="group flex-shrink-0 w-44 h-44 bg-paper/60 backdrop-blur-xl border border-g3 rounded-2xl p-6 flex flex-col justify-between hover:border-[var(--brand)] hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-g1 group-hover:bg-[var(--brand)] text-[var(--brand)] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm border border-g2">
                <ClipboardList size={22} strokeWidth={1.5} />
              </div>
              <span className="font-medium text-ink text-lg">Mock Tests</span>
            </Link>
            <Link href="/explore?f=Mentorships" className="group flex-shrink-0 w-44 h-44 bg-paper/60 backdrop-blur-xl border border-g3 rounded-2xl p-6 flex flex-col justify-between hover:border-[var(--brand)] hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-g1 group-hover:bg-[var(--brand)] text-[var(--brand)] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm border border-g2">
                <Users size={22} strokeWidth={1.5} />
              </div>
              <span className="font-medium text-ink text-lg">Mentorships</span>
            </Link>
            <Link href="/explore?f=Courses" className="group flex-shrink-0 w-44 h-44 bg-paper/60 backdrop-blur-xl border border-g3 rounded-2xl p-6 flex flex-col justify-between hover:border-[var(--brand)] hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-g1 group-hover:bg-[var(--brand)] text-[var(--brand)] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-sm border border-g2">
                <GraduationCap size={22} strokeWidth={1.5} />
              </div>
              <span className="font-medium text-ink text-lg">Courses</span>
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
      <section className="mx-auto max-w-[1440px] px-5 sm:px-8 mt-24 mb-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link href="/opportunities" className="premium-card p-10 flex flex-col justify-between min-h-[360px] group block relative overflow-hidden">
          <AmbientGlow className="-bottom-20 -right-20 w-[400px] h-[400px] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500" color="var(--brand)" />
          <div className="relative z-10 flex items-start justify-between">
            <div className="eyebrow">Event · {hack?.location || "TBA"}</div>
            <div className="w-10 h-10 rounded-full border border-g3 flex items-center justify-center text-ink group-hover:bg-ink group-hover:text-paper group-hover:border-ink transition-all">
              <span className="mono text-[16px]">→</span>
            </div>
          </div>
          <div className="relative z-10 mt-auto">
            <h3 className="serif text-5xl md:text-6xl leading-[1.05] tracking-tight">{hack?.title || "Upcoming Event"}</h3>
            <div className="mt-8 flex items-center justify-between">
              <p className="text-g5 text-[15px]">{hack ? new Date(hack.startTime).toLocaleDateString() : "TBA"} · Builders going</p>
              <div className="flex -space-x-3">
                {dbPeople.map((p, i) => (
                  <Avatar key={p.id} src={p.avatarUrl || ""} name={p.name || "User"} size={36} />
                ))}
              </div>
            </div>
          </div>
        </Link>
        
        <Link href="/opportunities" className="premium-card p-10 flex flex-col justify-between min-h-[360px] group block relative overflow-hidden">
          <AmbientGlow className="-top-20 -left-20 w-[400px] h-[400px] opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500" color="var(--brand)" />
          <div className="relative z-10 flex items-start justify-between">
            <div className="eyebrow">{role?.type || "Role"} · {role?.location || "Remote"}</div>
            <div className="w-10 h-10 rounded-full border border-g3 flex items-center justify-center text-ink group-hover:bg-ink group-hover:text-paper group-hover:border-ink transition-all">
              <span className="mono text-[16px]">→</span>
            </div>
          </div>
          <div className="relative z-10 mt-auto">
            <h3 className="serif text-5xl md:text-6xl leading-[1.05] tracking-tight">{role?.title || "Open Position"}</h3>
            <div className="mt-8 flex items-center justify-between">
              <p className="text-g5 text-[15px]">{role?.organization?.name || "Organization"} · {role?.compensation || "Negotiable"}</p>
              <div className="flex gap-2">
                <span className="stamp !py-1 !px-3 text-[10px]">Full-time</span>
                <span className="stamp !py-1 !px-3 text-[10px]">Remote</span>
              </div>
            </div>
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
