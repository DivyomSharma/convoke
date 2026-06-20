import Link from "next/link";
import { CalendarDays, Clock3, MapPin, Plus, Users } from "lucide-react";
import { AmbientGlow } from "@/components/AmbientGlow";
import { Shell } from "@/components/Shell";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    include: {
      space: {
        include: {
          organization: true,
        },
      },
      _count: {
        select: {
          attendance: true,
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  }).catch(() => []);

  return (
    <Shell>
      <div className="relative mx-auto min-h-screen max-w-[1240px] px-5 py-12 sm:px-8">
        <AmbientGlow className="top-8 right-0 h-[28rem] w-[28rem] opacity-[0.05]" color="var(--brand)" />

        <section className="campus-frame premium-card p-7 md:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="eyebrow">Live calendar</div>
              <h1 className="mt-3 serif text-5xl tracking-tight md:text-7xl">
                Events built for momentum, not optics.
              </h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-g5 md:text-[17px]">
                Workshops, campus mixers, founder circles, demo nights, and technical gatherings that actually connect people to rooms, roles, and collaborators.
              </p>
            </div>
            <button className="ink-button px-5 text-[14px] font-medium">
              <Plus size={16} />
              Host Event
            </button>
          </div>
        </section>

        {events.length === 0 ? (
          <section className="mt-8 premium-card p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-g3 bg-g1 text-[var(--brand)]">
              <CalendarDays size={26} />
            </div>
            <h2 className="mt-6 serif text-3xl">No events are live yet</h2>
            <p className="mx-auto mt-3 max-w-[42ch] text-[15px] leading-7 text-g5">
              Launch the first gathering for your community, startup, or college chapter. This directory only fills with real events.
            </p>
            <div className="mt-8">
              <button className="ink-button px-5 text-[14px] font-medium">
                <Plus size={16} />
                Create the first event
              </button>
            </div>
          </section>
        ) : (
          <section className="mt-8 grid gap-5">
            {events.map((event, index) => {
              const startsOn = new Date(event.startTime);
              const endsOn = new Date(event.endTime);
              const isLive = new Date() >= startsOn && new Date() <= endsOn;

              return (
                <Link key={event.id} href={`/events/${event.id}`} className="premium-card campus-frame block p-6 md:p-8">
                  <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr] lg:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-[color:var(--brand)]/25 bg-[color:var(--brand)]/10 px-3 py-1 mono text-[11px] uppercase tracking-[0.18em] text-[var(--brand)]">
                          {isLive ? "Live now" : "Upcoming"}
                        </span>
                        <span className="mono text-[11px] uppercase tracking-[0.18em] text-g4">
                          {event.space.organization.name}
                        </span>
                      </div>
                      <h2 className="mt-5 serif text-3xl tracking-tight md:text-5xl">{event.title}</h2>
                      <p className="mt-4 max-w-3xl text-[15px] leading-7 text-g5">
                        {event.description || "No event brief published yet."}
                      </p>
                      <div className="mt-6 flex flex-wrap gap-3 text-[13px] text-g5">
                        <span className="inline-flex items-center gap-2 rounded-full border border-g3 bg-g1/60 px-3 py-2">
                          <CalendarDays size={14} className="text-[var(--brand)]" />
                          {startsOn.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full border border-g3 bg-g1/60 px-3 py-2">
                          <Clock3 size={14} className="text-[var(--brand)]" />
                          {startsOn.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full border border-g3 bg-g1/60 px-3 py-2">
                          <MapPin size={14} className="text-[var(--brand)]" />
                          {event.location || "Online"}
                        </span>
                      </div>
                    </div>

                    <div className="glass-panel rounded-[26px] p-5 md:p-6">
                      <div className="eyebrow">Attendance</div>
                      <div className="mt-3 serif text-4xl">{String(event._count.attendance).padStart(2, "0")}</div>
                      <div className="mt-2 text-[14px] leading-6 text-g5">
                        {event.capacity ? `${event.capacity} seats available in total.` : "Open capacity for all interested members."}
                      </div>

                      <div className="mt-6 space-y-3 border-t border-g3 pt-5 text-[13px] text-g5">
                        <div className="flex items-center justify-between">
                          <span>Space</span>
                          <span className="text-ink">{event.space.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Waitlist</span>
                          <span className="text-ink">{event.waitlistCount}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Venue</span>
                          <span className="text-ink">{event.venue || "TBA"}</span>
                        </div>
                      </div>

                      <div className="mt-6 inline-flex items-center gap-2 text-[13px] font-medium text-[var(--brand)]">
                        <Users size={14} />
                        Open event page
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </section>
        )}
      </div>
    </Shell>
  );
}
