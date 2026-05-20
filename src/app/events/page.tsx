import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Footer } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { ApplyButton } from "@/components/ui/apply-button";
import { ButtonLink } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { SaveButton } from "@/components/ui/save-button";
import { listHomeData } from "@/lib/platform-service";
import { formatInr } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Events",
  description: "Discover and register for hackathons, meetups, workshops, creator programs, and community events on Convoke.",
};

export default async function EventsPage() {
  const home = await listHomeData();

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] md:text-7xl">
                Events with real registrations behind them.
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
                Browse what is happening across student communities, startup collectives,
                creator networks, and youth ecosystems. Save, register, and track it from one account.
              </p>
            </div>
            <ButtonLink href="/discover" variant="secondary">
              Explore all discovery
            </ButtonLink>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {home.events.map((event) => (
              <Panel key={event.id} className="overflow-hidden p-0">
                <div className="grid md:grid-cols-[1.05fr_0.95fr]">
                  <Link href={`/events/${event.slug}`} className="relative min-h-[320px]">
                    <Image src={event.image} alt={event.title} fill className="object-cover" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${event.palette}`} />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <p className="text-xs uppercase tracking-wider text-white/75">
                        {event.category}
                      </p>
                      <h2 className="mt-2 text-3xl font-medium">{event.title}</h2>
                      <p className="mt-2 max-w-md text-sm leading-6 text-white/75">
                        {event.tagline}
                      </p>
                    </div>
                  </Link>

                  <div className="flex flex-col justify-between p-5">
                    <div>
                      <Link
                        href={`/communities/${event.organizerSlug}`}
                        className="text-sm text-bronze transition hover:text-bronze/80"
                      >
                        {event.organizer}
                      </Link>
                      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="size-4" />
                          {event.city}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="size-4" />
                          {event.date}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="size-4" />
                          {event.attendees.toLocaleString("en-IN")}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[8px] border border-line bg-black/30 px-4 py-3">
                          <p className="text-xs text-muted">Price</p>
                          <p className="mt-2 text-lg font-medium">
                            {event.price ? formatInr(event.price) : "Free"}
                          </p>
                        </div>
                        <div className="rounded-[8px] border border-line bg-black/30 px-4 py-3">
                          <p className="text-xs text-muted">Mode</p>
                          <p className="mt-2 text-lg font-medium">{event.mode}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <div className="flex-1">
                        <ApplyButton
                          mode="register"
                          eventId={event.id}
                          initialApplied={event.registered}
                          label={event.registered ? "Registered" : "Register"}
                          className="w-full"
                        />
                      </div>
                      <div className="sm:w-[124px]">
                        <SaveButton eventId={event.id} initialSaved={event.saved} />
                      </div>
                    </div>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
