import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Search, SlidersHorizontal, Sparkles, TrendingUp, Users } from "lucide-react";
import { Footer } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { ButtonLink } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import {
  categories, communities, featuredEvents, opportunities,
  seedPeople, trendingNow,
} from "@/data/platform";
import { formatInr } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Discover — Events, Communities & Opportunities",
  description: "Find hackathons, gaming events, startup summits, NGO drives, workshops, and campus ecosystems on Convoke.",
};

export default function DiscoverPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Hero */}
          <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] md:text-7xl">
            Discover communities in motion.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            Hackathons, campus nights, startup rooms, creator drops, NGO drives,
            and the people building culture around them.
          </p>

          {/* Search + Filters */}
          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-line bg-white/[0.025] px-5 py-4">
              <Search className="size-5 text-muted" />
              <span className="flex-1 text-sm text-muted">Search events, communities, opportunities...</span>
              <SlidersHorizontal className="size-4 text-muted" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/discover?category=${cat}`}
                  className="shrink-0 rounded-full border border-line bg-white/[0.035] px-4 py-2 text-sm text-muted transition hover:border-rust/70 hover:text-foreground"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>

          {/* Trending Banner */}
          <div className="mt-10 grid gap-3 md:grid-cols-4">
            {trendingNow.map((item) => (
              <Panel key={item.label} className="p-4">
                <div className="flex items-center gap-2 text-xs text-bronze">
                  <TrendingUp className="size-3.5" />
                  Trending
                </div>
                <p className="mt-2 text-sm font-medium text-foreground">{item.label}</p>
                <p className="mt-1 text-xs text-muted">{item.value}</p>
              </Panel>
            ))}
          </div>

          {/* Featured Events */}
          <section className="mt-16">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-medium tracking-[-0.03em] md:text-4xl">
                  Featured events
                </h2>
                <p className="mt-2 text-sm text-muted">{featuredEvents.length} upcoming events across India</p>
              </div>
              <ButtonLink href="/events/summit-zero" variant="secondary">View all</ButtonLink>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {featuredEvents.slice(0, 6).map((event) => (
                <Link key={event.slug} href={`/events/${event.slug}`}>
                  <Panel className="group h-full overflow-hidden p-0 transition hover:-translate-y-1 hover:border-rust/60">
                    <div className="relative h-56 overflow-hidden">
                      <Image src={event.image} alt={event.title} fill className="object-cover transition duration-700 group-hover:scale-105" />
                      <div className={`absolute inset-0 bg-gradient-to-t ${event.palette}`} />
                      <div className="absolute left-4 right-4 top-4 flex items-center justify-between text-xs text-white/80">
                        <span>{event.category}</span>
                        <span>{event.mode}</span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-2xl font-semibold tracking-[-0.03em]">{event.title}</h3>
                        <p className="mt-1 text-sm text-white/80 line-clamp-1">{event.tagline}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4">
                      <div>
                        <p className="text-sm text-foreground">{event.organizer}</p>
                        <p className="mt-0.5 text-xs text-muted">
                          {event.city} · {event.date} · {event.attendees.toLocaleString("en-IN")} going
                        </p>
                      </div>
                      <p className="font-mono text-sm text-bronze">
                        {event.price ? formatInr(event.price) : "Free"}
                      </p>
                    </div>
                  </Panel>
                </Link>
              ))}
            </div>
          </section>

          {/* Communities */}
          <section className="mt-16">
            <div className="mb-8">
              <h2 className="text-3xl font-medium tracking-[-0.03em] md:text-4xl">
                Active communities
              </h2>
              <p className="mt-2 text-sm text-muted">{communities.length} communities building culture across India</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {communities.map((comm) => (
                <Link key={comm.slug} href={`/communities/${comm.slug}`}>
                  <Panel className="group h-full overflow-hidden p-0 transition hover:border-bronze/50">
                    <div className="relative h-36 overflow-hidden">
                      <Image src={comm.image} alt={comm.name} fill className="object-cover transition duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-foreground group-hover:text-bronze transition">{comm.name}</h3>
                      <p className="mt-1 text-xs text-muted line-clamp-2">{comm.tagline}</p>
                      <div className="mt-3 flex items-center gap-3 text-xs text-muted">
                        <span className="inline-flex items-center gap-1">
                          <Users className="size-3" />
                          {comm.members.toLocaleString("en-IN")}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="size-3" />
                          {comm.location}
                        </span>
                      </div>
                    </div>
                  </Panel>
                </Link>
              ))}
            </div>
          </section>

          {/* Top Opportunities Preview */}
          <section className="mt-16">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-medium tracking-[-0.03em] md:text-4xl">
                  Hot opportunities
                </h2>
                <p className="mt-2 text-sm text-muted">{opportunities.length} active roles right now</p>
              </div>
              <ButtonLink href="/opportunities" variant="secondary">View all</ButtonLink>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {opportunities.slice(0, 3).map((opp) => (
                <Link key={opp.id} href="/opportunities">
                  <Panel className="group h-full p-5 transition hover:border-bronze/50">
                    <span className="text-xs font-medium text-bronze">{opp.type}</span>
                    <h3 className="mt-2 text-lg font-medium group-hover:text-bronze transition">{opp.title}</h3>
                    <p className="mt-1 text-sm text-muted">{opp.organization}</p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-muted">
                      <span>{opp.location}</span>
                      {opp.stipend && <span className="text-bronze">{opp.stipend}</span>}
                    </div>
                    <p className="mt-3 text-xs text-muted">{opp.applicants} applied · {opp.postedAgo}</p>
                  </Panel>
                </Link>
              ))}
            </div>
          </section>

          {/* People in the ecosystem */}
          <section className="mt-16">
            <h2 className="text-3xl font-medium tracking-[-0.03em] md:text-4xl">
              People building momentum
            </h2>
            <p className="mt-2 text-sm text-muted">Organizers, founders, creators, and volunteers making it happen.</p>
            <div className="mt-8 flex gap-4 overflow-x-auto pb-2 scrollbar-none">
              {seedPeople.slice(0, 10).map((person) => (
                <div key={person.name} className="flex shrink-0 flex-col items-center gap-3">
                  <span className="grid size-16 place-items-center rounded-full border-2 border-bronze/30 bg-gradient-to-br from-bronze to-rust text-lg font-semibold text-black">
                    {person.initials}
                  </span>
                  <div className="text-center">
                    <p className="text-sm font-medium">{person.name}</p>
                    <p className="text-xs text-muted line-clamp-1">{person.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Ecosystem CTA */}
          <section className="mt-16">
            <Panel className="bg-gradient-to-br from-bronze/10 via-transparent to-rust/5 p-8 md:p-12">
              <div className="flex items-center gap-2 text-sm text-bronze">
                <Sparkles className="size-4" />
                Join the ecosystem
              </div>
              <h2 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.03em] md:text-5xl">
                Your next opportunity, community, or collaboration is here.
              </h2>
              <p className="mt-4 max-w-xl text-lg text-muted">
                Sign up to save events, apply to opportunities, join communities, and build your ecosystem profile.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/auth/sign-in">Get started</ButtonLink>
                <ButtonLink href="/opportunities" variant="secondary">Browse opportunities</ButtonLink>
              </div>
            </Panel>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
