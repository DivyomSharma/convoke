import { ArrowRight, Briefcase, CalendarDays, Sparkles, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/marketing/footer";
import { MotionShell } from "@/components/marketing/motion-shell";
import { SiteHeader } from "@/components/marketing/site-header";
import { ButtonLink } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { Marquee } from "@/components/ui/marquee";
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
                  Where ambition meets opportunity.
                </h1>
                <p className="mt-8 max-w-2xl text-lg leading-8 text-muted md:text-xl">
                  Discover events, communities, and opportunities that move your career forward. Join thousands of students, creators, and founders building momentum together.
                </p>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href="/discover" className="group">
                    Explore events
                    <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </ButtonLink>
                  <ButtonLink href="/auth/sign-in" variant="secondary">
                    Join Convoke
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
              {heroEvent ? (
                <Link href={`/events/${heroEvent.slug}`} className="group">
                  <Panel className="overflow-hidden p-0 transition hover:border-bronze/50">
                    <div className="relative min-h-[520px] overflow-hidden">
                      <Image src={heroEvent.image} alt={heroEvent.title} fill priority className="object-cover transition duration-700 group-hover:scale-105" />
                      <div className={`absolute inset-0 bg-gradient-to-t ${heroEvent.palette}`} />
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <p className="text-sm text-bronze">{heroEvent.category}</p>
                        <h2 className="mt-2 text-4xl font-semibold tracking-[-0.04em]">{heroEvent.title}</h2>
                        <p className="mt-2 max-w-md text-sm leading-6 text-white/75">{heroEvent.tagline}</p>
                        <div className="mt-5 flex flex-wrap gap-4 text-xs text-white/75">
                          <span className="inline-flex items-center gap-1.5">{heroEvent.city}</span>
                          <span className="inline-flex items-center gap-1.5">{heroEvent.date}</span>
                          <span className="inline-flex items-center gap-1.5">{heroEvent.attendees.toLocaleString("en-IN")} joined</span>
                        </div>
                      </div>
                    </div>
                  </Panel>
                </Link>
              ) : (
                <Panel className="flex min-h-[520px] flex-col justify-between overflow-hidden p-0">
                  <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                    <CalendarDays className="size-12 text-bronze" />
                    <h2 className="mt-6 text-3xl font-semibold tracking-[-0.03em]">Events are on their way</h2>
                    <p className="mt-3 max-w-md text-sm leading-7 text-muted">New events, hackathons, and meetups are launching soon. Be the first to know.</p>
                    <ButtonLink href="/discover" variant="secondary" className="mt-6">Browse what&apos;s happening</ButtonLink>
                  </div>
                </Panel>
              )}
            </MotionShell>
          </div>
        </section>

        <section className="border-y border-line bg-[#080808] px-5 py-20 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-4xl font-medium tracking-[-0.03em] md:text-6xl">
                  What&apos;s happening now
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
                  Events, opportunities, and communities that are moving right now.
                </p>
              </div>
              <ButtonLink href="/discover" variant="secondary">Explore all</ButtonLink>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: CalendarDays,
                  title: "Events",
                  copy: "Join hackathons, meetups, and workshops. Register, volunteer, and earn certificates.",
                },
                {
                  icon: Briefcase,
                  title: "Opportunities",
                  copy: "Discover internships, ambassador programs, creator collaborations, and startup roles.",
                },
                {
                  icon: Users,
                  title: "Communities",
                  copy: "Find your people. Join communities that match your interests and ambitions.",
                },
              ].map((item) => (
                <Panel key={item.title} className="p-6">
                  <item.icon className="size-5 text-bronze" />
                  <h3 className="mt-5 text-2xl font-medium">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{item.copy}</p>
                </Panel>
              ))}
            </div>
          </div>
        </section>

        {home.events.length > 0 && (
          <section className="px-5 py-24 md:px-8">
            <div className="mx-auto max-w-7xl">
              <div className="mb-10 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-4xl font-medium tracking-[-0.03em] md:text-6xl">Trending events</h2>
                  <p className="mt-4 max-w-2xl text-base leading-7 text-muted">
                    Popular events people are joining right now.
                  </p>
                </div>
                <ButtonLink href="/events" variant="secondary">Browse events</ButtonLink>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {home.events.slice(0, 3).map((event) => (
                  <Link key={event.id} href={`/events/${event.slug}`}>
                    <Panel className="group overflow-hidden p-0 transition hover:-translate-y-1 hover:border-bronze/50">
                      <div className="relative h-64 overflow-hidden">
                        <Image src={event.image} alt={event.title} fill className="object-cover transition duration-700 group-hover:scale-105" />
                        <div className={`absolute inset-0 bg-gradient-to-t ${event.palette}`} />
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <p className="text-xs text-white/75">{event.category}</p>
                          <h3 className="mt-2 text-3xl font-medium tracking-[-0.03em]">{event.title}</h3>
                          <p className="mt-2 text-sm leading-6 text-white/75">{event.tagline}</p>
                        </div>
                      </div>
                    </Panel>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Marquee Section */}
        <section className="relative flex flex-col items-center justify-center overflow-hidden py-10 md:py-16 bg-[#030304]">
          <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          <Marquee repeat={5} className="[--duration:30s] opacity-70 hover:opacity-100 transition duration-500">
            {["HACKATHONS", "INTERNSHIPS", "FOUNDERS", "CREATORS", "COMMUNITIES", "BUILDERS", "ENGINEERS", "DESIGNERS"].map((term) => (
              <span key={term} className="mx-4 text-3xl font-black italic tracking-widest text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.15)] hover:[-webkit-text-stroke:1px_rgba(198,161,111,0.5)] transition duration-300">
                {term}
              </span>
            ))}
          </Marquee>
          
          <Marquee reverse repeat={5} className="[--duration:25s] mt-4 opacity-70 hover:opacity-100 transition duration-500">
            {["ACCELERATORS", "INCUBATORS", "WORKSHOPS", "CONFERENCES", "FELLOWSHIPS", "GRANTS", "RESIDENCIES", "SHOWCASES"].map((term) => (
              <span key={term} className="mx-4 text-3xl font-black italic tracking-widest text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.15)] hover:[-webkit-text-stroke:1px_rgba(198,161,111,0.5)] transition duration-300">
                {term}
              </span>
            ))}
          </Marquee>
        </section>

        {home.people.length > 0 && (
          <section className="px-5 py-16 md:px-8">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-3xl font-medium tracking-[-0.03em] md:text-4xl">Recently joined</h2>
              <p className="mt-3 text-sm text-muted">People making moves across the ecosystem.</p>
              <div className="mt-8 flex flex-wrap gap-4">
                {home.people.map((person) => (
                  <Link key={person.id} href={`/u/${person.username}`} className="group flex items-center gap-3 rounded-full border border-line bg-white/[0.03] px-4 py-2.5 transition hover:border-bronze/40 hover:bg-white/[0.06]">
                    <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-bronze to-rust text-xs font-semibold text-black">{person.initials}</span>
                    <div>
                      <p className="text-sm font-medium">{person.name}</p>
                      <p className="text-xs text-muted">{person.role}{person.community ? ` · ${person.community}` : ''}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="bg-[#0a0908] px-5 py-24 md:px-8">
          <div className="mx-auto max-w-7xl grid gap-6 lg:grid-cols-[1fr_1fr]">
            <Panel className="p-6">
              <div className="flex items-center gap-2 text-2xl font-medium">
                <Briefcase className="size-5 text-bronze" />
                Open opportunities
              </div>
              <div className="mt-5 space-y-3">
                {home.opportunities.length ? (
                  home.opportunities.slice(0, 4).map((opportunity) => (
                    <div key={opportunity.id} className="rounded-[8px] border border-line bg-black/30 p-4">
                      <p className="text-xs uppercase tracking-wider text-bronze">{opportunity.type}</p>
                      <h3 className="mt-2 font-medium">{opportunity.title}</h3>
                      <p className="mt-2 text-sm text-muted">{opportunity.organization} / {opportunity.location}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted">More coming soon</p>
                )}
              </div>
            </Panel>

            <Panel className="p-6">
              <div className="flex items-center gap-2 text-2xl font-medium">
                <Sparkles className="size-5 text-bronze" />
                Recent activity
              </div>
              <div className="mt-5 space-y-3">
                {home.activity.length ? (
                  home.activity.map((item) => (
                    <div key={item.id} className="rounded-[8px] border border-line bg-black/30 p-4">
                      <p className="font-medium">{item.actor} {item.action}</p>
                      <p className="mt-2 text-sm leading-6 text-muted">{item.detail}</p>
                      <p className="mt-2 text-xs text-bronze">{item.createdAt}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted">More coming soon</p>
                )}
              </div>
            </Panel>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
