import type { Metadata } from "next";
import Image from "next/image";
import { Search, SlidersHorizontal } from "lucide-react";
import { Footer } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Panel } from "@/components/ui/panel";
import { categories, featuredEvents } from "@/data/platform";
import { formatInr } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Discover Events",
  description: "Find hackathons, gaming events, startup summits, NGO drives, workshops, and campus ecosystems on Convoke.",
};

export default function DiscoverPage() {
  const filters = ["City", "Date", "Online/offline", "Organizer type", "Free/paid"];

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] md:text-8xl">
            Discover communities in motion.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            Hackathons, campus nights, startup rooms, creator drops, NGO drives,
            and the people building culture around them.
          </p>
          <div className="mt-10 grid gap-6 lg:grid-cols-[300px_1fr]">
            <Panel className="h-fit p-5">
              <div className="flex items-center gap-2 text-sm font-medium">
                <SlidersHorizontal className="size-4 text-bronze" />
                Filters
              </div>
              <div className="mt-5 rounded-[8px] border border-line bg-black/35 px-4 py-3">
                <div className="flex items-center gap-3 text-muted">
                  <Search className="size-4" />
                  <span className="text-sm">Search events</span>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                {filters.map((filter) => (
                  <button
                    key={filter}
                    className="flex w-full items-center justify-between rounded-[8px] border border-line bg-white/[0.025] px-4 py-3 text-left text-sm text-muted transition hover:border-bronze/50 hover:text-foreground"
                  >
                    {filter}
                    <span>+</span>
                  </button>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {categories.slice(0, 8).map((category) => (
                  <span key={category} className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-muted">
                    {category}
                  </span>
                ))}
              </div>
            </Panel>
            <div className="grid gap-5 md:grid-cols-2">
              {featuredEvents.concat(featuredEvents).map((event, index) => (
                <a key={`${event.slug}-${index}`} href={`/events/${event.slug}`}>
                  <Panel className="group h-full overflow-hidden p-0 transition hover:-translate-y-1 hover:border-rust/60">
                    <div className="relative h-72">
                      <Image
                        src={event.image}
                        alt={`${event.title} community event`}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${event.palette}`} />
                      <div className="absolute left-4 right-4 top-4 flex items-center justify-between text-xs text-white/80">
                        <span>{event.category}</span>
                        <span>{event.mode}</span>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h2 className="text-4xl font-semibold tracking-[-0.04em]">
                          {event.title}
                        </h2>
                        <p className="mt-2 max-w-sm text-sm leading-6 text-white/80">
                          {event.tagline}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-5">
                      <div>
                        <p className="text-sm text-foreground">{event.organizer}</p>
                        <p className="mt-1 text-xs text-muted">
                          {event.city} / {event.date} / {event.attendees.toLocaleString("en-IN")} going
                        </p>
                      </div>
                      <p className="font-mono text-sm text-bronze">
                        {event.price ? formatInr(event.price) : "Free"}
                      </p>
                    </div>
                  </Panel>
                </a>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
