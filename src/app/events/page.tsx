import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Footer } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Panel } from "@/components/ui/panel";
import { listHomeData } from "@/lib/platform-service";

export const metadata: Metadata = {
  title: "Events",
  description: "Real events, registrations, and community-driven participation on Convoke.",
};

type EventsPageProps = {
  searchParams?: Promise<{ q?: string; city?: string; mode?: string }>;
};

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const home = await listHomeData();
  const filters = (await searchParams) ?? {};
  const q = filters.q?.trim().toLowerCase() ?? "";
  const city = filters.city?.trim().toLowerCase() ?? "";
  const mode = filters.mode?.trim().toLowerCase() ?? "";
  const filteredEvents = home.events.filter((event) => {
    const matchesQ = q
      ? [event.title, event.tagline, event.category, event.community ?? "", event.organizer].some((value) =>
          value.toLowerCase().includes(q),
        )
      : true;
    const matchesCity = city ? event.city.toLowerCase().includes(city) : true;
    const matchesMode = mode ? event.mode.toLowerCase() === mode : true;
    return matchesQ && matchesCity && matchesMode;
  });

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] md:text-7xl">
            Events that belong to an ecosystem.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            Every event can carry registrations, volunteers, schedules, waitlists, tracks, announcements, and community context.
          </p>
          <form className="mt-10 grid gap-3 rounded-[8px] border border-line bg-white/[0.03] p-4 md:grid-cols-[1fr_180px_180px_auto]">
            <input name="q" defaultValue={filters.q ?? ""} placeholder="Search event, category, organizer" className="h-11 rounded-[8px] border border-line bg-black/35 px-4 text-sm outline-none" />
            <input name="city" defaultValue={filters.city ?? ""} placeholder="City" className="h-11 rounded-[8px] border border-line bg-black/35 px-4 text-sm outline-none" />
            <select name="mode" defaultValue={filters.mode ?? ""} className="h-11 rounded-[8px] border border-line bg-black/35 px-4 text-sm outline-none">
              <option value="">Any mode</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="hybrid">Hybrid</option>
            </select>
            <button type="submit" className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition hover:bg-bronze hover:text-black">Apply</button>
          </form>

          {filteredEvents.length ? (
            <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredEvents.map((event) => (
                <Link key={event.id} href={`/events/${event.slug}`}>
                  <Panel className="panel-hover group overflow-hidden p-0">
                    <div className="relative h-72">
                      <Image src={event.image} alt={event.title} fill className="object-cover transition duration-700 group-hover:scale-105" />
                      <div className={`absolute inset-0 bg-gradient-to-t ${event.palette}`} />
                      <div className="absolute inset-x-0 bottom-0 p-5">
                        <p className="text-xs uppercase tracking-wider text-white/75">{event.category}</p>
                        <h2 className="mt-2 text-3xl font-medium">{event.title}</h2>
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
              ))}
            </div>
          ) : (
            <Panel className="mt-12 p-8">
              <p className="text-lg font-medium">No events have been created yet.</p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
                This directory stays empty until real organizers publish real events.
              </p>
            </Panel>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
