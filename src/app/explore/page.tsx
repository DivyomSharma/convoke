import Link from "next/link";
import { ArrowRight, CalendarDays, FolderKanban, Sparkles, UsersRound } from "lucide-react";
import { Shell } from "@/components/Shell";
import { Avatar } from "@/components/Avatar";
import { prisma } from "@/lib/prisma";
import { getFallbackPhoto } from "@/lib/photos";

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
  banner: string;
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
    year: "numeric"
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
        meta: `${event.location || event.venue || "Online"} · Starting ${event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        at: event.createdAt,
        href: `/events/${event.id}`,
        icon: CalendarDays,
        banner: event.bannerUrl || getFallbackPhoto(event.id, 'event'),
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
          meta: `${opportunity.organization.name} · ${opportunity.location || "Remote"} · ${opportunity.compensation || "Competitive"}`,
          at: opportunity.createdAt,
          href: challenge ? `/challenges/${opportunity.id}` : `/opportunities/${opportunity.id}`,
          icon: challenge ? Sparkles : UsersRound,
          banner: opportunity.bannerUrl || getFallbackPhoto(opportunity.id, 'opportunity'),
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
        meta: project.url || "Builder case-study",
        at: project.createdAt,
        href: `/projects/${project.id}`,
        icon: FolderKanban,
        banner: project.bannerUrl || getFallbackPhoto(project.id, 'project'),
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
      <main className="relative mx-auto max-w-[1040px] px-5 py-16 sm:px-8">
        <section className="border-b border-g3 pb-8">
          <div className="mono text-[11px] tracking-[0.2em] uppercase text-g5">
            Ecosystem Dispatch
          </div>
          <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="serif text-6xl leading-[0.9] tracking-tight text-ink">Explore</h1>
              <p className="mt-4 max-w-[54ch] text-[16px] leading-[1.6] text-g5">
                A live stream of events, roles, challenges, and builder projects from the Convoke ecosystem.
              </p>
            </div>
            <span className="inline-flex rounded-sm border border-g3 bg-g1 px-3 py-1.5 mono text-[10px] uppercase tracking-wider text-g5">
              {sortedItems.length} active item{sortedItems.length === 1 ? "" : "s"}
            </span>
          </div>
        </section>

        <nav className="sticky top-14 z-20 -mx-5 mt-6 flex gap-3 overflow-x-auto border-b border-g3/60 bg-paper/90 px-5 py-4 backdrop-blur-md sm:-mx-8 sm:px-8">
          {filters.map((filter) => (
            <Link
              key={filter}
              href={`/explore?f=${filter}`}
              className={
                "shrink-0 px-3 py-1.5 mono text-[11px] uppercase tracking-[0.14em] transition-colors rounded-sm " +
                (selected === filter 
                  ? "bg-ink text-paper" 
                  : "border border-transparent text-g5 hover:border-g3 hover:text-ink"
                )
              }
            >
              {filter}
            </Link>
          ))}
        </nav>

        {sortedItems.length === 0 ? (
          <section className="mt-16 text-center py-20">
            <h2 className="serif text-4xl text-ink font-light">No dispatches published yet</h2>
            <p className="mx-auto mt-4 max-w-[42ch] text-[15px] leading-relaxed text-g5">
              Convoke will populate this feed from real-time campus actions as they are established.
            </p>
          </section>
        ) : (
          <ul className="relative z-10 mt-12 flex flex-col gap-16">
            {sortedItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id} className="group border-b border-g3/60 pb-16 last:border-0 last:pb-0">
                  <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
                    {/* Editorial Banner Photography (B/W Default, restores color on hover) */}
                    <div className="lg:col-span-5">
                      <Link href={item.href} className="block overflow-hidden rounded-sm bg-g1 aspect-[16/10] relative">
                        <img 
                          src={item.banner} 
                          alt="" 
                          className="w-full h-full object-cover" 
                        />
                      </Link>
                    </div>

                    {/* Meta & Article Info */}
                    <div className="lg:col-span-7 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 text-[11px] mono uppercase tracking-wider text-g5 mb-4">
                          <span className="inline-flex items-center gap-1.5 text-brand">
                            <Icon size={12} />
                            {item.kind}
                          </span>
                          <span>•</span>
                          <span>{formatDate(item.at)}</span>
                        </div>

                        <Link href={item.href} className="block mt-2">
                          <h3 className="serif text-3xl leading-[1.1] tracking-tight text-ink md:text-4xl group-hover:underline decoration-1 decoration-g4 underline-offset-4">
                            {item.title}
                          </h3>
                        </Link>

                        {item.body && (
                          <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.6] text-g5">
                            {item.body}
                          </p>
                        )}
                        
                        {item.meta && (
                          <p className="mt-4 mono text-[11px] uppercase tracking-wider text-g4">
                            {item.meta}
                          </p>
                        )}
                      </div>

                      {/* Author Card Info */}
                      <div className="mt-8 pt-6 border-t border-g1 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <Link href={item.who.href}>
                            <Avatar src={item.who.avatar} name={item.who.name} size={32} />
                          </Link>
                          <div className="min-w-0">
                            <Link href={item.who.href} className="text-[13px] font-medium text-ink hover:text-brand truncate block">
                              {item.who.name}
                            </Link>
                            <span className="text-[11px] text-g5 block truncate">
                              {item.who.role}
                            </span>
                          </div>
                        </div>

                        <Link 
                          href={item.href}
                          className="text-[12px] font-medium text-ink hover:underline underline-offset-4 inline-flex items-center gap-1 shrink-0"
                        >
                          <span>View Details</span>
                          <span className="text-[10px] opacity-70">→</span>
                        </Link>
                      </div>
                    </div>
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
