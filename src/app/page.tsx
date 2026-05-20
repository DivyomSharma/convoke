import { ArrowRight, Briefcase, CalendarDays, MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/marketing/footer";
import { MotionShell } from "@/components/marketing/motion-shell";
import { SiteHeader } from "@/components/marketing/site-header";
import { ButtonLink } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { getHomepageStats, listHomeData } from "@/lib/platform-service";

export default async function Home() {
  const [home, stats] = await Promise.all([listHomeData(), getHomepageStats()]);
  const heroEvent = home.events[0];

  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden bg-background">
        <section className="relative min-h-screen px-5 pb-24 pt-32 md:px-8 md:pt-40">
          <div className="metal-grid absolute inset-x-0 top-0 h-[620px]" />
          <div className="absolute left-1/2 top-24 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(185,101,53,0.22),transparent_62%)] blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <MotionShell>
              <div>
                <h1 className="max-w-5xl text-balance text-6xl font-semibold leading-[0.9] tracking-[-0.04em] text-foreground md:text-8xl lg:text-9xl">
                  For events, ideas, and people moving things forward.
                </h1>
                <p className="mt-8 max-w-2xl text-lg leading-8 text-muted md:text-xl">
                  Convoke is a living ecosystem for discovering hackathons,
                  internships, creator programs, communities, registrations, and
                  the people building momentum around them.
                </p>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href="/discover" className="group">
                    Discover momentum
                    <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </ButtonLink>
                  <ButtonLink href="/opportunities" variant="secondary">
                    Browse opportunities
                  </ButtonLink>
                </div>
                <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-bronze">
                  {stats.map((stat, index) => (
                    <span key={stat} className="inline-flex items-center gap-4">
                      {stat}
                      {index < stats.length - 1 ? <span className="text-line">.</span> : null}
                    </span>
                  ))}
                </div>
              </div>
            </MotionShell>

            <MotionShell delay={0.12}>
              <div className="grid gap-4">
                {heroEvent ? (
                  <Link href={`/events/${heroEvent.slug}`} className="group">
                    <Panel className="overflow-hidden p-0 transition hover:border-bronze/50">
                      <div className="relative min-h-[520px] overflow-hidden">
                        <Image
                          src={heroEvent.image}
                          alt={heroEvent.title}
                          fill
                          priority
                          className="object-cover transition duration-700 group-hover:scale-105"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${heroEvent.palette}`} />
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <p className="text-sm text-bronze">{heroEvent.category}</p>
                          <h2 className="mt-2 text-4xl font-semibold tracking-[-0.04em]">
                            {heroEvent.title}
                          </h2>
                          <p className="mt-2 max-w-md text-sm leading-6 text-white/75">
                            {heroEvent.tagline}
                          </p>
                          <div className="mt-5 flex flex-wrap gap-4 text-xs text-white/75">
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin className="size-3.5" />
                              {heroEvent.city}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays className="size-3.5" />
                              {heroEvent.date}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <Users className="size-3.5" />
                              {heroEvent.attendees.toLocaleString("en-IN")} joined
                            </span>
                          </div>
                        </div>
                      </div>
                    </Panel>
                  </Link>
                ) : null}
              </div>
            </MotionShell>
          </div>
        </section>

        <section className="border-y border-line bg-[#080808] px-5 py-20 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-4xl font-medium tracking-[-0.03em] md:text-6xl">
                  Discovery, participation, and reputation in one place.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
                  The platform is structured around real events, communities,
                  opportunities, registrations, applications, and portfolio
                  identity.
                </p>
              </div>
              <ButtonLink href="/workspace" variant="secondary">
                Open dashboard
              </ButtonLink>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {home.events.slice(0, 3).map((event, index) => (
                <MotionShell key={event.id} delay={index * 0.05}>
                  <Link href={`/events/${event.slug}`}>
                    <Panel className="group overflow-hidden p-0 transition hover:-translate-y-1 hover:border-bronze/50">
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          className="object-cover transition duration-700 group-hover:scale-105"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${event.palette}`} />
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <p className="text-xs text-white/75">{event.category}</p>
                          <h3 className="mt-2 text-3xl font-medium tracking-[-0.03em]">
                            {event.title}
                          </h3>
                          <p className="mt-2 text-sm leading-6 text-white/75">
                            {event.tagline}
                          </p>
                        </div>
                      </div>
                    </Panel>
                  </Link>
                </MotionShell>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-24 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-4xl font-medium tracking-[-0.03em] md:text-6xl">
                  Opportunities that move daily.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
                  Internships, volunteer roles, ambassador programs, startup
                  hiring, and creator collaborations are first-class entities,
                  not content blocks.
                </p>
              </div>
              <ButtonLink href="/opportunities" variant="secondary">
                View all
              </ButtonLink>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {home.opportunities.slice(0, 3).map((opportunity) => (
                <Panel key={opportunity.id} className="group flex h-full flex-col justify-between p-5 transition hover:border-bronze/50">
                  <div>
                    <span className="text-xs font-medium uppercase tracking-wider text-bronze">
                      {opportunity.type}
                    </span>
                    <h3 className="mt-3 text-2xl font-medium tracking-[-0.02em]">
                      {opportunity.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted">{opportunity.organization}</p>
                    <p className="mt-4 text-sm leading-6 text-muted">
                      {opportunity.description}
                    </p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-3 text-xs text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-3.5" />
                      {opportunity.location}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Briefcase className="size-3.5" />
                      {opportunity.stipend ?? "Unpaid"}
                    </span>
                    <span>{opportunity.applicants} applicants</span>
                  </div>
                </Panel>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#0a0908] px-5 py-24 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-4xl font-medium tracking-[-0.03em] md:text-6xl">
                  Communities with real structure.
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
                  Organizations on Convoke own members, events, openings,
                  announcements, galleries, sponsorship requests, and merch
                  flows.
                </p>
              </div>
              <ButtonLink href="/communities" variant="secondary">
                Browse communities
              </ButtonLink>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
              {home.communities.slice(0, 8).map((community) => (
                <Link key={community.id} href={`/communities/${community.slug}`}>
                  <Panel className="group overflow-hidden p-0 transition hover:border-bronze/50">
                    <div className="relative h-36">
                      <Image src={community.image} alt={community.name} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium group-hover:text-bronze">{community.name}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted">{community.tagline}</p>
                      <p className="mt-3 text-xs text-muted">
                        {community.members.toLocaleString("en-IN")} members
                      </p>
                    </div>
                  </Panel>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-24 pt-24 md:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[8px] border border-bronze/30 bg-[linear-gradient(135deg,rgba(198,161,111,0.18),rgba(185,101,53,0.12)_38%,rgba(141,161,184,0.08))] p-8 md:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] md:text-7xl">
                  Open Convoke daily for what is moving.
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                  Save openings, register for events, join communities, track
                  applications, earn certificates, and build a public profile
                  that works better than a stale resume link.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  "Role-aware dashboards",
                  "Real registrations and applications",
                  "Portfolio-first public profiles",
                ].map((item) => (
                  <div key={item} className="rounded-full border border-line bg-white/[0.04] px-4 py-3 text-sm text-foreground">
                    {item}
                  </div>
                ))}
                <ButtonLink href="/auth/sign-in" className="mt-4 w-full sm:w-auto">
                  Enter Convoke
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
