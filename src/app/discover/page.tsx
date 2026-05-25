import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Search, Users } from "lucide-react";
import { Footer } from "@/components/marketing/footer";
import { MotionShell } from "@/components/marketing/motion-shell";
import { SiteHeader } from "@/components/marketing/site-header";
import { ButtonLink } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { listCommunityDirectory, listHomeData, listOpportunityDirectory } from "@/lib/platform-service";

export const metadata: Metadata = {
  title: "Discover",
  description: "Discover real communities, events, and opportunities across Convoke.",
};

export default async function DiscoverPage() {
  const [home, opportunities, communities] = await Promise.all([
    listHomeData(),
    listOpportunityDirectory(),
    listCommunityDirectory(),
  ]);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] md:text-7xl">
            Discovery that points to action.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            Browse the real graph of communities, events, and opportunities. Nothing here is staged to look active.
          </p>

          <div className="mt-10 rounded-xl border border-line bg-white/[0.025] px-5 py-4 text-sm text-muted">
            <div className="flex items-center gap-3">
              <Search className="size-5" />
              Search UI comes next. The underlying discovery surface is now database-first.
            </div>
          </div>

          <section className="mt-14">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-medium tracking-[-0.03em] md:text-4xl">Events</h2>
                <p className="mt-2 text-sm text-muted">Registrations, schedules, and waitlists live directly on event records.</p>
              </div>
              <ButtonLink href="/events" variant="secondary">All events</ButtonLink>
            </div>
            {home.events.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {home.events.map((event, index) => (
                <MotionShell key={event.id} delay={index * 0.04}>
                <Link href={`/events/${event.slug}`}>
                  <Panel className="panel-hover group overflow-hidden p-0">
                    <div className="relative h-60">
                        <Image src={event.image} alt={event.title} fill className="object-cover" />
                        <div className={`absolute inset-0 bg-gradient-to-t ${event.palette}`} />
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <p className="text-xs uppercase tracking-wider text-white/75">{event.category}</p>
                          <h3 className="mt-2 text-2xl font-medium">{event.title}</h3>
                          <p className="mt-2 text-sm leading-6 text-white/75">{event.tagline}</p>
                          <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/75">
                            <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" />{event.city}</span>
                            <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-3.5" />{event.date}</span>
                            <span className="inline-flex items-center gap-1.5"><Users className="size-3.5" />{event.attendees.toLocaleString("en-IN")}</span>
                          </div>
                        </div>
                    </div>
                  </Panel>
                </Link>
                </MotionShell>
              ))}
            </div>
            ) : (
              <Panel className="p-8">
                <p className="text-lg font-medium">No events have been published yet.</p>
                <p className="mt-3 text-sm leading-7 text-muted">Once organizers create events, discovery becomes a live operating surface instead of a static directory.</p>
              </Panel>
            )}
          </section>

          <section className="mt-16 grid gap-6 lg:grid-cols-[1fr_1fr]">
            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-medium tracking-[-0.03em] md:text-4xl">Communities</h2>
                <p className="mt-2 text-sm text-muted">Momentum, members, and connected activity live here.</p>
              </div>
              <div className="space-y-4">
                {communities.length ? (
                  communities.slice(0, 6).map((community, index) => (
                    <MotionShell key={community.id} delay={index * 0.03}>
                    <Link href={`/communities/${community.slug}`}>
                      <Panel className="panel-hover flex items-center gap-4 overflow-hidden p-3">
                        <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-[8px]">
                          <Image src={community.image} alt={community.name} fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-lg font-medium">{community.name}</p>
                          <p className="mt-1 text-sm text-muted">{community.tagline}</p>
                          <p className="mt-2 text-xs text-bronze">{community.members.toLocaleString("en-IN")} members</p>
                        </div>
                      </Panel>
                    </Link>
                    </MotionShell>
                  ))
                ) : (
                  <Panel className="p-6">
                    <p className="text-sm text-muted">No communities have been created yet.</p>
                  </Panel>
                )}
              </div>
            </div>

            <div>
              <div className="mb-6">
                <h2 className="text-3xl font-medium tracking-[-0.03em] md:text-4xl">Opportunities</h2>
                <p className="mt-2 text-sm text-muted">Applications and status tracking flow from these records.</p>
              </div>
              <div className="space-y-4">
                {opportunities.length ? (
                  opportunities.slice(0, 6).map((opportunity, index) => (
                    <MotionShell key={opportunity.id} delay={index * 0.03}>
                    <Panel className="panel-hover p-5">
                      <p className="text-xs uppercase tracking-wider text-bronze">{opportunity.type}</p>
                      <Link href={`/opportunities/${opportunity.slug}`} className="mt-2 inline-flex items-center gap-2 text-xl font-medium hover:text-bronze">
                        {opportunity.title}
                        <ArrowUpRight className="size-4" />
                      </Link>
                      <p className="mt-2 text-sm text-muted">{opportunity.organization}</p>
                      <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted">
                        <span>{opportunity.location}</span>
                        <span>{opportunity.stipend ?? "Unpaid"}</span>
                        <span>{opportunity.applicants} applied</span>
                      </div>
                    </Panel>
                    </MotionShell>
                  ))
                ) : (
                  <Panel className="p-6">
                    <p className="text-sm text-muted">No opportunities are live yet.</p>
                  </Panel>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
