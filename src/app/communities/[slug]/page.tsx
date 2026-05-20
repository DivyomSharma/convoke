import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  CalendarDays,
  Clock,
  MapPin,
  Sparkles,
  Tag,
  TrendingUp,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";

import { Footer } from "@/components/marketing/footer";
import { MotionShell } from "@/components/marketing/motion-shell";
import { SiteHeader } from "@/components/marketing/site-header";
import { ButtonLink } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import {
  communities,
  featuredEvents,
  opportunities,
  opportunityTypeColors,
  seedPeople,
} from "@/data/platform";

// ─── STATIC PARAMS ──────────────────────────────────────────────────────────

export async function generateStaticParams() {
  return communities.map((c) => ({ slug: c.slug }));
}

// ─── DYNAMIC METADATA ───────────────────────────────────────────────────────

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const community = communities.find((c) => c.slug === slug);
  if (!community) return { title: "Community Not Found — Convoke" };

  return {
    title: `${community.name} — Convoke Community`,
    description: community.tagline,
    openGraph: {
      title: `${community.name} — Convoke`,
      description: community.tagline,
      images: [{ url: community.image, width: 1200, height: 630 }],
    },
  };
}

// ─── HELPERS ────────────────────────────────────────────────────────────────

function matchesCommunity(personCommunity: string, slug: string, name: string) {
  const normalized = personCommunity.toLowerCase();
  return (
    normalized === name.toLowerCase() ||
    normalized === slug ||
    normalized.includes(slug.replace("-", " ")) ||
    slug.includes(normalized.replace(/\s+/g, "-"))
  );
}

// ─── PAGE ───────────────────────────────────────────────────────────────────

export default async function CommunityPage({ params }: PageProps) {
  const { slug } = await params;
  const community = communities.find((c) => c.slug === slug);
  if (!community) notFound();

  const members = seedPeople.filter((p) =>
    matchesCommunity(p.community, community.slug, community.name),
  );

  const events = featuredEvents.filter((e) => e.organizerSlug === slug);

  const opps = opportunities.filter((o) => o.organizationSlug === slug);

  // Derived impact stats
  const totalAttendees = events.reduce((s, e) => s + e.attendees, 0);
  const totalVolunteers = events.reduce((s, e) => s + e.volunteers, 0);

  return (
    <>
      <SiteHeader />
      <main className="px-5 pb-32 pt-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          {/* ── Back link ─────────────────────────────────────────── */}
          <MotionShell>
            <ButtonLink
              href="/communities"
              variant="ghost"
              className="mb-8 gap-2 text-muted hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back to Discover
            </ButtonLink>
          </MotionShell>

          {/* ── Hero ──────────────────────────────────────────────── */}
          <MotionShell delay={0.05}>
            <div className="relative mb-14 overflow-hidden rounded-2xl">
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-background via-background/60 to-transparent" />
              <Image
                src={community.image}
                alt={community.name}
                width={1400}
                height={480}
                priority
                className="h-[320px] w-full object-cover md:h-[420px]"
              />
              <div className="absolute inset-x-0 bottom-0 z-20 p-6 md:p-10">
                <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.05em] md:text-7xl lg:text-8xl">
                  {community.name}
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-muted md:text-xl">
                  {community.tagline}
                </p>
              </div>
            </div>
          </MotionShell>

          {/* ── Quick stats pills ─────────────────────────────────── */}
          <MotionShell delay={0.1}>
            <div className="mb-14 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted">
                <MapPin className="size-3.5 text-bronze" />
                {community.location}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted">
                <Users className="size-3.5 text-bronze" />
                {community.members.toLocaleString()}+ Members
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted">
                <CalendarDays className="size-3.5 text-bronze" />
                {community.eventsPerYear} Events / Year
              </span>
              {community.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 rounded-full border border-bronze/20 bg-bronze/5 px-4 py-2 text-sm text-bronze"
                >
                  <Tag className="size-3 opacity-60" />
                  {tag}
                </span>
              ))}
            </div>
          </MotionShell>

          {/* ── About + Impact ────────────────────────────────────── */}
          <div className="grid gap-6 md:grid-cols-2">
            <MotionShell delay={0.15}>
              <Panel className="h-full p-6 md:p-8">
                <h2 className="mb-4 text-2xl font-medium tracking-tight">
                  About {community.name}
                </h2>
                <p className="leading-7 text-muted">
                  {community.tagline} Based in {community.location}, the
                  community unites {community.members.toLocaleString()}+ members
                  around {community.tags.slice(0, 2).join(", ").toLowerCase()}{" "}
                  and beyond — running {community.eventsPerYear} events every
                  year to keep the ecosystem moving.
                </p>
                <p className="mt-4 leading-7 text-muted">
                  From hackathons and creator meetups to volunteer drives and
                  open-source sprints, {community.name} creates the spaces where
                  ideas find their people and projects find their momentum.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {community.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-bronze/10 px-3 py-1 text-xs font-medium text-bronze"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Panel>
            </MotionShell>

            <MotionShell delay={0.2}>
              <Panel className="h-full p-6 md:p-8">
                <h2 className="mb-6 text-2xl font-medium tracking-tight">
                  Community Impact
                </h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-3xl font-semibold text-bronze">
                      {community.members.toLocaleString()}+
                    </p>
                    <p className="mt-1 text-sm text-muted">Active Members</p>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold text-rust">
                      {community.eventsPerYear}
                    </p>
                    <p className="mt-1 text-sm text-muted">Events / Year</p>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold text-steel">
                      {totalAttendees > 0
                        ? totalAttendees.toLocaleString()
                        : Math.round(community.members * 2.4).toLocaleString()}
                      +
                    </p>
                    <p className="mt-1 text-sm text-muted">People Reached</p>
                  </div>
                  <div>
                    <p className="text-3xl font-semibold text-foreground">
                      {totalVolunteers > 0
                        ? totalVolunteers.toLocaleString()
                        : Math.round(community.members * 0.12).toLocaleString()}
                      +
                    </p>
                    <p className="mt-1 text-sm text-muted">Volunteer Hours</p>
                  </div>
                </div>
                <div className="mt-6 flex items-center gap-2 rounded-lg border border-line bg-white/[0.025] px-4 py-3">
                  <TrendingUp className="size-4 text-bronze" />
                  <span className="text-sm text-muted">
                    Community growing{" "}
                    <span className="font-medium text-foreground">+18%</span>{" "}
                    this quarter
                  </span>
                </div>
              </Panel>
            </MotionShell>
          </div>

          {/* ── Featured Members ──────────────────────────────────── */}
          {members.length > 0 && (
            <section className="mt-20">
              <MotionShell>
                <h2 className="text-3xl font-medium tracking-[-0.03em]">
                  Featured Members
                </h2>
                <p className="mb-8 mt-2 max-w-3xl text-lg leading-7 text-muted">
                  The people making {community.name} what it is.
                </p>
              </MotionShell>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {members.map((member, i) => (
                  <MotionShell key={member.name} delay={0.08 * i}>
                    <Link href={`/u/${member.name.toLowerCase().replace(/\s+/g, "")}`}>
                      <Panel className="flex h-full flex-col p-5 hover:-translate-y-1 transition duration-300 hover:border-bronze/40">
                        <div className="flex items-center gap-4">
                          <div className="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-bronze/25 to-rust/20 text-sm font-semibold text-bronze">
                            {member.initials}
                          </div>
                          <div className="min-w-0">
                            <h3 className="truncate font-semibold text-foreground">
                              {member.name}
                            </h3>
                            <p className="truncate text-sm text-muted">
                              {member.role}
                            </p>
                          </div>
                        </div>
                        <div className="mt-auto pt-4 flex items-center justify-between">
                          <span className="inline-block rounded-full bg-bronze/10 px-3 py-1 text-xs font-medium text-bronze">
                            {member.role.split(" ").slice(-1)[0]}
                          </span>
                          <span className="text-xs text-muted/50">View Profile →</span>
                        </div>
                      </Panel>
                    </Link>
                  </MotionShell>
                ))}
              </div>
            </section>
          )}

          {/* ── Upcoming Events ───────────────────────────────────── */}
          {events.length > 0 && (
            <section className="mt-20">
              <MotionShell>
                <h2 className="text-3xl font-medium tracking-[-0.03em]">
                  Upcoming Events
                </h2>
                <p className="mb-8 mt-2 max-w-3xl text-lg leading-7 text-muted">
                  What&apos;s happening in the {community.name} ecosystem.
                </p>
              </MotionShell>

              <div className="grid gap-6 md:grid-cols-2">
                {events.map((event, i) => (
                  <MotionShell key={event.slug} delay={0.1 * i}>
                    <Panel className="group relative overflow-hidden">
                      <div className="relative h-48 w-full overflow-hidden">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent" />
                        <div className="absolute bottom-3 left-4 flex items-center gap-2">
                          <span className="rounded-full bg-bronze/90 px-3 py-1 text-xs font-medium text-background">
                            {event.category}
                          </span>
                          <span className="rounded-full border border-line bg-surface/80 px-3 py-1 text-xs text-muted backdrop-blur-sm">
                            {event.mode}
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="text-xl font-semibold tracking-tight text-foreground">
                          {event.title}
                        </h3>
                        <p className="mt-1 text-sm text-muted">
                          {event.tagline}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="size-3.5 text-bronze" />
                            {event.date}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="size-3.5 text-bronze" />
                            {event.city}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Users className="size-3.5 text-bronze" />
                            {event.attendees.toLocaleString()} attending
                          </span>
                        </div>

                        <div className="mt-5 flex items-center justify-between">
                          <span className="text-lg font-semibold text-bronze">
                            {event.price === 0
                              ? "Free"
                              : `₹${event.price.toLocaleString()}`}
                          </span>
                          <ButtonLink
                            href={`/events/${event.slug}`}
                            variant="secondary"
                            className="h-9 px-4 text-xs"
                          >
                            View Event →
                          </ButtonLink>
                        </div>
                      </div>
                    </Panel>
                  </MotionShell>
                ))}
              </div>
            </section>
          )}

          {/* ── Opportunities ─────────────────────────────────────── */}
          {opps.length > 0 && (
            <section className="mt-20">
              <MotionShell>
                <h2 className="text-3xl font-medium tracking-[-0.03em]">
                  Opportunities
                </h2>
                <p className="mb-8 mt-2 max-w-3xl text-lg leading-7 text-muted">
                  Open roles and ways to get involved with {community.name}.
                </p>
              </MotionShell>

              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {opps.map((opp, i) => (
                  <MotionShell key={opp.id} delay={0.08 * i}>
                    <Panel className="flex h-full flex-col p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-medium ${
                            opportunityTypeColors[opp.type] ??
                            "border-line bg-white/5 text-muted"
                          }`}
                        >
                          {opp.type}
                        </span>
                        <span className="text-xs text-muted">
                          {opp.postedAgo}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold tracking-tight text-foreground">
                        {opp.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
                        {opp.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3 text-bronze" />
                          {opp.location}
                        </span>
                        {opp.stipend && (
                          <span className="inline-flex items-center gap-1">
                            <Briefcase className="size-3 text-bronze" />
                            {opp.stipend}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Clock className="size-3 text-bronze" />
                          {opp.deadline}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {opp.skills.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="rounded bg-white/[0.06] px-2 py-0.5 text-[11px] text-muted"
                          >
                            {skill}
                          </span>
                        ))}
                        {opp.skills.length > 4 && (
                          <span className="rounded bg-white/[0.06] px-2 py-0.5 text-[11px] text-muted">
                            +{opp.skills.length - 4}
                          </span>
                        )}
                      </div>

                      <div className="mt-auto flex items-center justify-between border-t border-line pt-4">
                        <span className="text-xs text-muted">
                          {opp.applicants} applicants
                        </span>
                        <ButtonLink
                          href={`/opportunities/${opp.id}`}
                          variant="secondary"
                          className="h-8 px-3 text-xs"
                        >
                          Apply →
                        </ButtonLink>
                      </div>
                    </Panel>
                  </MotionShell>
                ))}
              </div>
            </section>
          )}

          {/* ── Join CTA ──────────────────────────────────────────── */}
          <MotionShell delay={0.1}>
            <section className="mt-24">
              <Panel className="relative overflow-hidden px-6 py-16 text-center md:px-16">
                <div className="pointer-events-none absolute -right-32 -top-32 size-96 rounded-full bg-bronze/[0.07] blur-[120px]" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 size-72 rounded-full bg-rust/[0.06] blur-[100px]" />

                <Sparkles className="mx-auto mb-4 size-8 text-bronze" />
                <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                  Join {community.name}
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted">
                  Become part of a {community.members.toLocaleString()}+ member
                  community in {community.location}. Access events, meet
                  collaborators, and build something worth talking about.
                </p>

                <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <ButtonLink href="/workspace" className="gap-2">
                    <UserPlus className="size-4" />
                    Join Community
                  </ButtonLink>
                  <ButtonLink href="/communities" variant="secondary" className="gap-2">
                    <Zap className="size-4" />
                    Explore More Communities
                  </ButtonLink>
                </div>
              </Panel>
            </section>
          </MotionShell>
        </div>
      </main>
      <Footer />
    </>
  );
}
