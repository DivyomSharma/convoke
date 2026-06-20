import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Avatar } from "@/components/Avatar";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export default async function Workspace() {
  const dbUser = await requireUser();

  const memberships = dbUser ? await prisma.membership.findMany({
    where: { userId: dbUser.id },
    include: { organization: { include: { spaces: true } } }
  }) : [];

  const mySpaces = memberships.flatMap(m => m.organization.spaces);

  const upcomingEvents = await prisma.event.findMany({
    where: { startTime: { gte: new Date() } },
    orderBy: { startTime: "asc" },
    take: 3,
    include: { space: true, _count: { select: { attendance: true } } }
  });

  const myApps = dbUser ? await prisma.application.findMany({
    where: { userId: dbUser.id },
    include: { opportunity: { include: { organization: true } } },
    take: 3,
    orderBy: { createdAt: "desc" }
  }) : [];

  const people = await prisma.user.findMany({
    where: dbUser ? { id: { not: dbUser.id } } : undefined,
    take: 4,
    orderBy: { createdAt: "desc" }
  });

  const myActivities = dbUser ? await prisma.activity.findMany({
    where: {
      userId: dbUser.id,
      createdAt: { gte: new Date(Date.now() - 16 * 7 * 24 * 60 * 60 * 1000) }
    },
    orderBy: { createdAt: "asc" }
  }) : [];

  return (
    <Shell wide>
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 py-10 grid grid-cols-12 gap-x-10 gap-y-10">
        <aside className="col-span-12 lg:col-span-3">
          <div className="hairline-b pb-6">
            <div className="eyebrow">Workspace</div>
            <h1 className="serif text-4xl mt-2">{dbUser?.name || "Welcome"}</h1>
            {dbUser?.role && <p className="text-g5 text-[14px] mt-1">{dbUser.role} {dbUser.university && `· ${dbUser.university}`}</p>}
          </div>
          <Momentum activities={myActivities} />
          <div className="mt-8">
            <div className="eyebrow mb-3">Your spaces</div>
            {mySpaces.length > 0 ? (
              <ul className="space-y-2 text-[14px]">
                {mySpaces.map((s) => (
                  <li key={s.id}>
                    <Link href={`/spaces/${s.id}`} className="flex items-center justify-between hover:text-ink text-g6">
                      <span>{s.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-[13px] text-g5">You haven't joined any spaces yet.</div>
            )}
          </div>
        </aside>

        <section className="col-span-12 lg:col-span-6">
          <div className="hairline-b pb-5">
            <div className="eyebrow">Upcoming</div>
            <h2 className="serif text-3xl mt-1">What you're showing up to.</h2>
          </div>

          {upcomingEvents.length > 0 ? (
            <ol className="mt-6 relative">
              {upcomingEvents.map((e) => (
                <li key={e.id} className="grid grid-cols-[88px_1fr] gap-6 py-6 hairline-b">
                  <div className="text-right">
                    <div className="serif text-2xl leading-none">
                      {new Date(e.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="mono text-[11px] text-g5 mt-1 uppercase">Event</div>
                  </div>
                  <div>
                    <h3 className="serif text-2xl leading-[1.1]">{e.title}</h3>
                    <div className="text-g5 text-[14px] mt-1">
                      {e.space.name} · {e.location || "TBA"} · {e._count.attendance} going
                    </div>
                    <Link href={`/events/${e.id}`} className="mt-4 inline-flex mono text-[11px] uppercase tracking-[0.18em] text-brand hover:text-ink">
                      Open event
                    </Link>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className="mt-12 text-center text-g5 eyebrow">Your timeline is quiet. Join a Space to start building momentum.</div>
          )}

          <div className="mt-12">
            <div className="eyebrow mb-4">Applications in flight</div>
            {myApps.length > 0 ? (
              <ul className="divide-y divide-g3">
                {myApps.map((a) => (
                  <li key={a.id} className="py-4 grid grid-cols-[1fr_auto] gap-4">
                    <div>
                      <div className="text-[15px]">{a.opportunity.title} <span className="text-g5">· {a.opportunity.organization.name}</span></div>
                      <div className="text-g5 text-[12px] mono mt-1">Stage: {a.status}</div>
                    </div>
                    <Link
                      href={a.opportunity.type === "HACKATHON" || a.opportunity.type === "CHALLENGE" ? `/challenges/${a.opportunity.id}` : `/opportunities/${a.opportunity.id}`}
                      className="mono text-[11px] uppercase tracking-[0.16em] text-brand hover:text-ink"
                    >
                      Review
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-[13px] text-g5">No active applications.</div>
            )}
          </div>
        </section>

        <aside className="col-span-12 lg:col-span-3">
          <div className="eyebrow mb-4">People to know</div>
          <ul className="space-y-5">
            {people.map((p) => (
              <li key={p.handle || p.id} className="flex items-center gap-3">
                <Avatar src={p.avatarUrl || ""} name={p.name || "User"} size={40} />
                <div className="min-w-0">
                  <Link href={`/profile/${p.handle || p.id}`} className="text-[14px] underline-link">{p.name || "User"}</Link>
                  <div className="text-g5 text-[12px] truncate">{p.role || "Member"}</div>
                </div>
              </li>
            ))}
          </ul>
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
    <div className="mt-8">
      <div className="flex items-baseline justify-between">
        <div className="eyebrow">Momentum · 16 weeks</div>
        <span className="mono text-[11px] text-[var(--brand)] font-semibold">{percentText}</span>
      </div>
      <div className="mt-3 flex items-end gap-[3px] h-16">
        {bars.map((b, i) => (
          <span
            key={i}
            className="flex-1 rounded-[1px] bg-[var(--brand)]"
            style={{
              height: `${(b / max) * 100 || 5}%`,
              opacity: b === 0 ? 0.05 : 0.2 + (i / bars.length) * 0.8
            }}
            title={`${b} activities`}
          />
        ))}
      </div>
    </div>
  );
}
