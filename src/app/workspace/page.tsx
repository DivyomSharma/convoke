import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Avatar } from "@/components/Avatar";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Ticket, Calendar, Clock, MapPin, CheckCircle, ArrowRight, UserPlus, Building2 } from "lucide-react";

export const revalidate = 0;

export default async function Workspace() {
  const dbUser = await requireUser();

  if (!dbUser.onboardingCompleted) {
    redirect("/onboarding");
  }

  const memberships = dbUser ? await prisma.membership.findMany({
    where: { userId: dbUser.id },
    include: { organization: { include: { spaces: true } } }
  }) : [];

  const mySpaces = memberships.flatMap(m => m.organization.spaces);

  // User's tickets / registered meets (active or checked-in)
  const myRSVPs = dbUser ? await prisma.meetAttendance.findMany({
    where: { userId: dbUser.id },
    include: { meet: { include: { space: true } } },
    orderBy: { meet: { startTime: "asc" } }
  }) : [];

  // Global upcoming meets that user might want to RSVP to (excluding already RSVP'd)
  const rsvpEventIds = myRSVPs.map(r => r.meetId);
  const upcomingEvents = await prisma.meet.findMany({
    where: { 
      startTime: { gte: new Date() },
      id: { notIn: rsvpEventIds }
    },
    orderBy: { startTime: "asc" },
    take: 4,
    include: { space: true, _count: { select: { attendance: true } } }
  });

  const myApps = dbUser ? await prisma.application.findMany({
    where: { userId: dbUser.id },
    include: { opportunity: { include: { organization: true } } },
    take: 4,
    orderBy: { createdAt: "desc" }
  }) : [];

  const people = await prisma.user.findMany({
    where: dbUser ? { id: { not: dbUser.id } } : undefined,
    take: 5,
    orderBy: { createdAt: "desc" }
  });

  const myActivities = dbUser ? await prisma.activity.findMany({
    where: {
      userId: dbUser.id,
      createdAt: { gte: new Date(Date.now() - 16 * 7 * 24 * 60 * 60 * 1000) }
    },
    orderBy: { createdAt: "asc" }
  }) : [];

  // Filter user's RSVPs into active/upcoming vs past
  const now = new Date();
  const activeTickets = myRSVPs.filter(r => new Date(r.meet.endTime) >= now);
  const pastPasses = myRSVPs.filter(r => new Date(r.meet.endTime) < now);

  return (
    <Shell wide>
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 py-12 grid grid-cols-12 gap-x-12 gap-y-12">
        
        {/* Left Column: Sidebar Profile & Spaces */}
        <aside className="col-span-12 lg:col-span-3 space-y-10">
          <div className="hairline-b pb-6">
            <div className="eyebrow">Your Desk</div>
            <h1 className="serif text-4xl mt-2 font-light text-ink">{dbUser?.name || "Workspace"}</h1>
            {dbUser?.role && (
              <p className="text-g5 text-[13px] mt-1.5 font-medium uppercase tracking-wider mono">
                {dbUser.role} {dbUser.university && `· ${dbUser.university}`}
              </p>
            )}
          </div>

          <Momentum activities={myActivities} />

          <div className="space-y-4">
            <div className="eyebrow">My Spaces & Collectives</div>
            {mySpaces.length > 0 ? (
              <ul className="space-y-2.5 text-[14px]">
                {mySpaces.map((s) => (
                  <li key={s.id}>
                    <Link href={`/spaces/${s.id}`} className="flex items-center gap-2 hover:text-[var(--brand)] text-g6 transition-colors">
                      <Building2 size={14} className="text-g4" />
                      <span>{s.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-[13px] text-g5 italic leading-relaxed">
                You haven't joined any workspace spaces yet. Explore spaces to join organizations.
              </div>
            )}
          </div>
        </aside>

        {/* Center Column: Tickets, Timeline, Applications */}
        <section className="col-span-12 lg:col-span-6 space-y-12">
          
          {/* Active Tickets Section */}
          <div>
            <div className="hairline-b pb-4 flex items-center justify-between">
              <div>
                <div className="eyebrow">RSVP Passes</div>
                <h2 className="serif text-3xl mt-1">Your Tickets & Passes</h2>
              </div>
              <span className="mono text-[10px] uppercase bg-g2 text-g5 px-2 py-0.5 rounded">
                {activeTickets.length} Active
              </span>
            </div>

            {activeTickets.length > 0 ? (
              <div className="mt-6 divide-y divide-g3">
                {activeTickets.map((rsvp) => {
                  const meet = rsvp.meet;
                  const isCheckedIn = rsvp.status === "CHECKED_IN";
                  const isWaitlisted = rsvp.status === "WAITLISTED";

                  return (
                    <div key={rsvp.id} className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded font-semibold border ${
                            isCheckedIn 
                              ? "bg-green-500/10 border-green-500/20 text-green-500" 
                              : isWaitlisted 
                              ? "bg-[var(--accent)]/10 border-[var(--accent)]/20 text-[var(--accent)]" 
                              : "bg-[var(--brand)]/10 border-[var(--brand)]/20 text-[var(--brand)]"
                          }`}>
                            {isCheckedIn ? "Checked In" : isWaitlisted ? "Waitlisted" : "Going"}
                          </span>
                          <span className="mono text-[10px] text-g5 uppercase tracking-wide">
                            {meet.space.name}
                          </span>
                        </div>
                        <h3 className="serif text-2xl text-ink leading-snug group-hover:text-[var(--brand)] transition-colors">
                          {meet.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-g5">
                          <span className="flex items-center gap-1">
                            <Calendar size={13} className="text-g4" />
                            {new Date(meet.startTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={13} className="text-g4" />
                            {new Date(meet.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={13} className="text-g4" />
                            {meet.location || "TBA"}
                          </span>
                        </div>
                      </div>

                      <Link 
                        href={`/meets/${meet.id}`}
                        className="ink-button h-9 px-4 text-[12px] font-semibold flex items-center gap-1.5 self-start md:self-auto shrink-0"
                      >
                        <Ticket size={13} />
                        <span>{isWaitlisted ? "View Status" : "View Pass"}</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-8 text-center py-10 border border-dashed border-g3 rounded-md">
                <p className="text-[13px] text-g5 max-w-[34ch] mx-auto leading-relaxed">
                  You don't have any upcoming meet passes. Explore campus happenings to RSVP.
                </p>
                <Link href="/meets" className="mt-4 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[var(--brand)] font-semibold hover:underline">
                  <span>Browse Campus Meets</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            )}
          </div>

          {/* Applications in Flight */}
          <div>
            <div className="hairline-b pb-4">
              <div className="eyebrow">Ongoing Collaborations</div>
              <h2 className="serif text-3xl mt-1">Open Conversations</h2>
            </div>

            {myApps.length > 0 ? (
              <ul className="mt-6 divide-y divide-g3">
                {myApps.map((a) => (
                  <li key={a.id} className="py-4 flex items-center justify-between gap-4 group">
                    <div>
                      <div className="text-[15px] font-medium text-ink group-hover:text-[var(--brand)] transition-colors">
                        {a.opportunity.title}
                      </div>
                      <div className="text-g5 text-[13px] mt-0.5">
                        {a.opportunity.organization.name} · <span className="mono text-[10px] uppercase font-semibold text-ink-muted">{a.status}</span>
                      </div>
                    </div>
                    <Link
                      href={a.opportunity.type === "HACKATHON" || a.opportunity.type === "CHALLENGE" ? `/challenges/${a.opportunity.id}` : `/opportunities/${a.opportunity.id}`}
                      className="mono text-[11px] uppercase tracking-wider text-g5 hover:text-ink transition-colors flex items-center gap-1"
                    >
                      <span>Review</span>
                      <ArrowRight size={11} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="mt-6 text-[13px] text-g5 italic leading-relaxed py-4 border border-dashed border-g3 rounded-md text-center">
                No active applications in progress.
              </div>
            )}
          </div>

          {/* Explore / Campus Timeline Suggestions */}
          <div>
            <div className="hairline-b pb-4">
              <div className="eyebrow">Discover campus</div>
              <h2 className="serif text-3xl mt-1">Upcoming Gatherings</h2>
            </div>

            {upcomingEvents.length > 0 ? (
              <div className="mt-6 divide-y divide-g3">
                {upcomingEvents.map((e) => (
                  <div key={e.id} className="py-5 grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-12 md:col-span-9 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="mono text-[9px] uppercase tracking-wider bg-g2 text-g5 px-1.5 py-0.5 rounded">
                          {e.space.name}
                        </span>
                      </div>
                      <h3 className="serif text-xl text-ink leading-snug">{e.title}</h3>
                      <div className="flex items-center gap-4 text-[12px] text-g5">
                        <span>{new Date(e.startTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                        <span>•</span>
                        <span>{e.location || "Online"}</span>
                        <span>•</span>
                        <span>{e._count.attendance} builders going</span>
                      </div>
                    </div>
                    <div className="col-span-12 md:col-span-3 text-right">
                      <Link 
                        href={`/meets/${e.id}`}
                        className="mono text-[11px] uppercase tracking-wider text-[var(--brand)] font-semibold hover:underline"
                      >
                        Register
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 text-[13px] text-g5 italic text-center py-6">
                Your campus is quiet today. No new recommendations.
              </div>
            )}
          </div>

        </section>

        {/* Right Column: People to know & past credentials */}
        <aside className="col-span-12 lg:col-span-3 space-y-10">
          
          {/* People to know */}
          <div className="space-y-4">
            <div className="eyebrow">Recent Builders</div>
            <ul className="space-y-4">
              {people.map((p) => (
                <li key={p.handle || p.id} className="flex items-center gap-3">
                  <Avatar src={p.avatarUrl || ""} name={p.name || "Builder"} size={36} />
                  <div className="min-w-0">
                    <Link href={`/profile/${p.handle || p.id}`} className="text-[13px] font-medium text-ink hover:underline truncate block">
                      {p.name || "Builder"}
                    </Link>
                    <div className="text-g5 text-[11px] truncate uppercase tracking-wider mono">{p.role || "Member"}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Past Passes / Archives */}
          {pastPasses.length > 0 && (
            <div className="space-y-4 pt-4 hairline-t">
              <div className="eyebrow">Credential Archive</div>
              <ul className="space-y-3.5 text-[13px]">
                {pastPasses.map((rsvp) => (
                  <li key={rsvp.id} className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <Link href={`/meets/${rsvp.meet.id}`} className="text-g6 hover:text-ink truncate block">
                        {rsvp.meet.title}
                      </Link>
                      <span className="text-[11px] text-g5 mono uppercase">
                        Checked In · {new Date(rsvp.meet.startTime).toLocaleDateString([], { year: "numeric", month: "short" })}
                      </span>
                    </div>
                    {rsvp.status === "CHECKED_IN" && (
                      <span className="text-green-500 flex items-center shrink-0">
                        <CheckCircle size={14} />
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </aside>

      </div>
    </Shell>
  );
}

function Momentum({ activities }: { activities: { createdAt: Date }[] }) {
  const weeks = 16;
  const bars = Array.from({ length: weeks }, () => 0);
  const now = new Date();
  
  activities.forEach((act) => {
    const actDate = new Date(act.createdAt);
    const diffTime = now.getTime() - actDate.getTime();
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    if (diffWeeks >= 0 && diffWeeks < weeks) {
      bars[weeks - 1 - diffWeeks]++;
    }
  });

  const max = Math.max(...bars, 1);
  
  const firstHalf = bars.slice(0, 8).reduce((a, b) => a + b, 0);
  const secondHalf = bars.slice(8).reduce((a, b) => a + b, 0);
  let percentChange = 0;
  if (firstHalf > 0) {
    percentChange = Math.round(((secondHalf - firstHalf) / firstHalf) * 100);
  } else if (secondHalf > 0) {
    percentChange = 100;
  }

  const percentText = percentChange >= 0 ? `+${percentChange}%` : `${percentChange}%`;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <div className="eyebrow">Recent Momentum</div>
        <span className="mono text-[11px] text-[var(--brand)] font-semibold">{percentText}</span>
      </div>
      <div className="mt-3.5 flex items-end gap-[3px] h-12">
        {bars.map((b, i) => (
          <span
            key={i}
            className="flex-1 rounded-[1px] bg-[var(--brand)]"
            style={{
              height: `${(b / max) * 100 || 8}%`,
              opacity: b === 0 ? 0.05 : 0.2 + (i / bars.length) * 0.8
            }}
            title={`${b} activities`}
          />
        ))}
      </div>
    </div>
  );
}
