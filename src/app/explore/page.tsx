import Link from "next/link";
import { ArrowRight, CalendarDays, FolderKanban, Sparkles, UsersRound } from "lucide-react";
import { Shell } from "@/components/Shell";
import { Avatar } from "@/components/Avatar";
import { AmbientGlow } from "@/components/AmbientGlow";
import { prisma } from "@/lib/prisma";

const filters = ["All", "Events", "Opportunities", "Challenges", "Projects"] as const;
type Filter = (typeof filters)[number];

type FeedItem = {
  id: string;
  kind: string;
  title: string;
  body: string | null;
  meta: string | null;
  at: Date;
  href: string;
  icon: typeof CalendarDays;
  who: {
    name: string;
    role: string;
    avatar: string;
    href: string;
  };
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function isChallenge(type: string) {
  return type === "HACKATHON" || type === "CHALLENGE";
}

export default async function Explore(props: { searchParams?: Promise<{ f?: string }> }) {
  const searchParams = await props.searchParams;
  const selected = filters.includes(searchParams?.f as Filter) ? (searchParams?.f as Filter) : "All";

  const [events, opportunities, projects] = await Promise.all([
    prisma.event
      .findMany({
        include: { space: { include: { organization: true } } },
        orderBy: { createdAt: "desc" },
        take: 20,
      })
      .catch(() => []),
    prisma.opportunity
      .findMany({
        include: { organization: true },
        orderBy: { createdAt: "desc" },
        take: 24,
      })
      .catch(() => []),
    prisma.project
      .findMany({
        include: { user: true },
        orderBy: { createdAt: "desc" },
        take: 20,
      })
      .catch(() => []),
  ]);

  const items: FeedItem[] = [];

  if (selected === "All" || selected === "Events") {
    events.forEach((event) => {
      items.push({
        id: `event-${event.id}`,
        kind: "Event",
        title: event.title,
        body: event.description,
        meta: `${event.location || event.venue || "Online"} · ${formatDate(event.startTime)}`,
        at: event.createdAt,
        href: `/events/${event.id}`,
        icon: CalendarDays,
        who: {
          name: event.space.name,
          role: event.space.organization.name,
          avatar: event.space.organization.logoUrl || "",
          href: `/spaces/${event.space.id}`,
        },
      });
    });
  }

  if (selected === "All" || selected === "Opportunities" || selected === "Challenges") {
    opportunities
      .filter((opportunity) => {
        if (selected === "Challenges") return isChallenge(opportunity.type);
        if (selected === "Opportunities") return !isChallenge(opportunity.type);
        return true;
      })
      .forEach((opportunity) => {
        const challenge = isChallenge(opportunity.type);
        items.push({
          id: `opportunity-${opportunity.id}`,
          kind: challenge ? "Challenge" : "Opportunity",
          title: opportunity.title,
          body: opportunity.description,
          meta: `${opportunity.organization.name} · ${opportunity.location || "Remote"}`,
          at: opportunity.createdAt,
          href: challenge ? `/challenges/${opportunity.id}` : `/opportunities/${opportunity.id}`,
          icon: challenge ? Sparkles : UsersRound,
          who: {
            name: opportunity.organization.name,
            role: opportunity.organization.industry || "Organization",
            avatar: opportunity.organization.logoUrl || "",
            href: `/org/${opportunity.organization.slug}`,
          },
        });
      });
  }

  if (selected === "All" || selected === "Projects") {
    projects.forEach((project) => {
      items.push({
        id: `project-${project.id}`,
        kind: "Project",
        title: project.title,
        body: project.description,
        meta: project.url || "Builder project",
        at: project.createdAt,
        href: `/projects/${project.id}`,
        icon: FolderKanban,
        who: {
          name: project.user.name || "Builder",
          role: project.user.role || "Member",
          avatar: project.user.avatarUrl || "",
          href: `/profile/${project.user.handle || project.user.id}`,
        },
      });
    });
  }

  const sortedItems = items.sort((a, b) => b.at.getTime() - a.at.getTime()).slice(0, 40);

  return (
    <Shell>
      <main className="relative mx-auto max-w-[920px] px-5 py-12 sm:px-8">
        <AmbientGlow className="-left-24 top-10 h-[560px] w-[560px] opacity-[0.05]" color="var(--brand)" />
        <AmbientGlow className="-right-24 bottom-40 h-[720px] w-[720px] opacity-[0.035]" />

        <section className="relative z-10 border-b border-g2 pb-7">
          <div className="eyebrow">Live discovery</div>
          <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="serif text-5xl leading-none tracking-[-0.045em] text-ink sm:text-6xl">Explore</h1>
              <p className="mt-4 max-w-[58ch] text-[15px] leading-7 text-g5">
                A live stream of events, roles, challenges, and builder projects from the Convoke ecosystem.
              </p>
            </div>
            <span className="inline-flex w-fit rounded-full border border-g3 bg-g1/70 px-4 py-2 mono text-[11px] uppercase tracking-[0.18em] text-g5">
              {sortedItems.length} live item{sortedItems.length === 1 ? "" : "s"}
            </span>
          </div>
        </section>

        <nav className="sticky top-14 z-20 -mx-5 mt-4 flex gap-2 overflow-x-auto border-b border-g2 bg-paper/85 px-5 py-3 backdrop-blur-md sm:-mx-8 sm:px-8">
          {filters.map((filter) => (
            <Link
              key={filter}
              href={`/explore?f=${filter}`}
              className={
                "shrink-0 rounded-full px-4 py-2 mono text-[11px] uppercase tracking-[0.16em] transition-colors " +
                (selected === filter ? "bg-ink text-paper" : "border border-transparent text-g5 hover:border-g3 hover:text-ink")
              }
            >
              {filter}
            </Link>
          ))}
        </nav>

        {sortedItems.length === 0 ? (
          <section className="mt-8 premium-card p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-g3 bg-g1 text-brand">
              <Sparkles size={22} />
            </div>
            <h2 className="mt-5 serif text-3xl text-ink">No live items yet</h2>
            <p className="mx-auto mt-3 max-w-[46ch] text-[15px] leading-7 text-g5">
              Convoke will fill this feed from real events, applications, communities, and projects as they are created.
            </p>
          </section>
        ) : (
          <ul className="relative z-10 mt-8 flex flex-col gap-5">
            {sortedItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id} className="premium-card group p-6 transition-transform duration-300 hover:-translate-y-1 md:p-8">
                  <div className="flex items-start gap-4">
                    <Link href={item.who.href} className="mt-1 shrink-0">
                      <Avatar src={item.who.avatar} name={item.who.name} size={38} />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-g5">
                        <Link href={item.who.href} className="font-medium text-ink hover:text-brand">
                          {item.who.name}
                        </Link>
                        <span>·</span>
                        <span>{item.who.role}</span>
                        <span>·</span>
                        <time className="mono text-[12px] text-g4">{formatDate(item.at)}</time>
                      </div>
                      <Link href={item.href} className="mt-4 block">
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-g3 bg-g1/70 px-3 py-1 mono text-[10px] uppercase tracking-[0.18em] text-brand">
                          <Icon size={13} />
                          {item.kind}
                        </div>
                        <h3 className="serif text-[30px] leading-[1.05] tracking-[-0.035em] text-ink md:text-[38px]">
                          {item.title}
                        </h3>
                        {item.body && <p className="mt-3 max-w-[66ch] text-[15px] leading-7 text-g5">{item.body}</p>}
                        {item.meta && <p className="mt-5 mono text-[12px] uppercase tracking-[0.14em] text-g4">{item.meta}</p>}
                      </Link>
                    </div>
                    <Link
                      href={item.href}
                      aria-label={`Open ${item.title}`}
                      className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-g3 text-g5 transition-colors group-hover:border-brand/40 group-hover:text-brand sm:flex"
                    >
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </Shell>
  );
}
