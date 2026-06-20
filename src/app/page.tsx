import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Avatar } from "@/components/Avatar";
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
      <section className="mx-auto max-w-[1440px] px-5 sm:px-8 pt-10 pb-16">
        {/* Editorial masthead — a single line of typography, no hero copy block */}
        <div className="flex items-baseline justify-between flex-wrap gap-y-3 hairline-b pb-6">
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
                      className="w-full h-full object-cover grayscale-[10%]"
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
                      <img src={`/assets/ph-meetup.jpg`} alt="" className="w-full h-full object-cover grayscale" />
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

      {/* Two-up: Hackathon + Open role */}
      <section className="mx-auto max-w-[1440px] px-5 sm:px-8 mt-20 grid grid-cols-1 md:grid-cols-2 gap-10">
        <article className="hairline p-7">
          <div className="eyebrow">Event · {hack?.location || "TBA"}</div>
          <h3 className="serif text-3xl md:text-4xl mt-3 leading-[1.05]">{hack?.title || "Upcoming Event"}</h3>
          <p className="text-g5 mt-3 text-[15px]">{hack ? new Date(hack.startTime).toLocaleDateString() : "TBA"} · Builders going</p>
          <div className="mt-6 flex -space-x-2">
            {dbPeople.map((p, i) => (
              <Avatar key={p.id} src={p.avatarUrl || ""} name={p.name || "User"} size={28} />
            ))}
            <span className="ml-4 text-g5 text-[13px] self-center">+ 10 others</span>
          </div>
          <Link href="/opportunities" className="mt-7 inline-block eyebrow text-ink underline-link">
            RSVP →
          </Link>
        </article>
        <article className="hairline p-7">
          <div className="eyebrow">{role?.type || "Role"} · {role?.location || "Remote"}</div>
          <h3 className="serif text-3xl md:text-4xl mt-3 leading-[1.05]">{role?.title || "Open Position"}</h3>
          <p className="text-g5 mt-3 text-[15px]">{role?.organization?.name || "Organization"} · {role?.compensation || "Negotiable"}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="mono text-[11px] hairline px-2 py-1 text-g6">Full-time</span>
            <span className="mono text-[11px] hairline px-2 py-1 text-g6">Remote</span>
          </div>
          <Link href="/opportunities" className="mt-7 inline-block eyebrow text-ink underline-link">
            Read brief →
          </Link>
        </article>
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
