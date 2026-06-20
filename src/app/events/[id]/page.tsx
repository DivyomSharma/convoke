import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  Building2,
  Calendar,
  ChevronDown,
  Clock3,
  FileText,
  MapPin,
  Navigation,
} from "lucide-react";
import { AmbientGlow } from "@/components/AmbientGlow";
import { Avatar } from "@/components/Avatar";
import { Shell } from "@/components/Shell";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { RsvpClient } from "./RsvpClient";

export const revalidate = 60;

export async function generateMetadata(props: { params?: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const id = params?.id;
  if (!id) return { title: "Event not found" };

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      space: {
        include: {
          organization: true,
        },
      },
    },
  }).catch(() => null);

  if (!event) return { title: "Event not found" };

  return {
    title: `${event.title} | Event`,
    description: event.description || `${event.title} on Convoke.`,
  };
}

export default async function EventDetailPage(props: { params?: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params?.id;
  if (!id) return notFound();

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      space: {
        include: {
          organization: {
            include: {
              members: {
                include: {
                  user: true,
                },
                take: 4,
              },
            },
          },
        },
      },
      attendance: true,
      faqs: true,
      sponsors: true,
      resources: true,
    },
  }).catch(() => null);

  if (!event) return notFound();

  const viewer = await requireUser().catch(() => null);
  const initialRegistered = viewer ? event.attendance.some((entry) => entry.userId === viewer.id && entry.status === "GOING") : false;
  const isFull = Boolean(event.capacity && event.attendance.length >= event.capacity);
  const price = "Free";

  return (
    <Shell wide>
      <div className="relative min-h-screen pb-20">
        <div className="relative h-[240px] w-full overflow-hidden border-b border-g3 bg-g1 md:h-[340px]">
          {event.bannerUrl ? (
            <img src={event.bannerUrl} alt={event.title} className="h-full w-full object-cover opacity-75" />
          ) : (
            <div className="h-full w-full bg-[radial-gradient(circle_at_top,rgba(201,161,109,0.18),transparent_52%)]">
              <AmbientGlow className="left-1/2 top-1/2 h-[22rem] w-[22rem] -translate-x-1/2 -translate-y-1/2 opacity-[0.16]" color="var(--brand)" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/40 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto -mt-20 max-w-[1080px] px-5 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-10">
              <section className="premium-card campus-frame p-7 md:p-9">
                <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--brand)]/25 bg-[color:var(--brand)]/10 px-3 py-1 mono text-[11px] uppercase tracking-[0.18em] text-[var(--brand)]">
                  Live ecosystem event
                </div>
                <h1 className="mt-5 serif text-4xl tracking-tight md:text-6xl">{event.title}</h1>
                <p className="mt-4 max-w-3xl text-[16px] leading-8 text-g5">
                  {event.description || "No public event overview has been published yet."}
                </p>

                <div className="mt-7 grid gap-3 text-[13px] text-g5 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="glass-panel rounded-[22px] p-4">
                    <div className="eyebrow">Date</div>
                    <div className="mt-2 inline-flex items-center gap-2 text-ink">
                      <Calendar size={15} className="text-[var(--brand)]" />
                      {new Date(event.startTime).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </div>
                  </div>
                  <div className="glass-panel rounded-[22px] p-4">
                    <div className="eyebrow">Time</div>
                    <div className="mt-2 inline-flex items-center gap-2 text-ink">
                      <Clock3 size={15} className="text-[var(--brand)]" />
                      {new Date(event.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <div className="glass-panel rounded-[22px] p-4">
                    <div className="eyebrow">Location</div>
                    <div className="mt-2 inline-flex items-center gap-2 text-ink">
                      <MapPin size={15} className="text-[var(--brand)]" />
                      {event.location || "Online"}
                    </div>
                  </div>
                  <div className="glass-panel rounded-[22px] p-4">
                    <div className="eyebrow">Capacity</div>
                    <div className="mt-2 text-ink">{event.capacity ? `${event.capacity} seats` : "Open"}</div>
                  </div>
                </div>
              </section>

              <section className="grid gap-6 md:grid-cols-2">
                <div className="glass-panel rounded-[26px] p-6">
                  <div className="eyebrow">Hosted by</div>
                  <Link href={`/org/${event.space.organization.slug}`} className="mt-3 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-g3 bg-g1">
                      {event.space.organization.logoUrl ? (
                        <img src={event.space.organization.logoUrl} alt={event.space.organization.name} className="h-full w-full rounded-2xl object-cover" />
                      ) : (
                        <Building2 size={20} className="text-[var(--brand)]" />
                      )}
                    </div>
                    <div>
                      <div className="serif text-2xl">{event.space.organization.name}</div>
                      <div className="text-[14px] text-g5">{event.space.name}</div>
                    </div>
                  </Link>
                  <p className="mt-4 text-[14px] leading-7 text-g5">
                    {event.space.organization.description || "This organizer has not added a public introduction yet."}
                  </p>
                </div>

                <div className="glass-panel rounded-[26px] p-6">
                  <div className="eyebrow">Venue notes</div>
                  <div className="mt-4 space-y-3 text-[14px] text-g5">
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="mt-0.5 text-[var(--brand)]" />
                      <div>
                        <div className="text-ink">{event.venue || "Venue to be announced"}</div>
                        <div>{event.location || "Online event details will be shared after RSVP."}</div>
                      </div>
                    </div>
                    {event.requirements ? (
                      <div className="flex items-start gap-3">
                        <FileText size={16} className="mt-0.5 text-[var(--brand)]" />
                        <div>{event.requirements}</div>
                      </div>
                    ) : null}
                    <div className="flex items-center gap-2 text-[var(--brand)]">
                      <Navigation size={14} />
                      Follow organizer updates for the final logistics drop.
                    </div>
                  </div>
                </div>
              </section>

              {event.faqs.length > 0 ? (
                <section>
                  <div className="eyebrow mb-4">Common questions</div>
                  <div className="space-y-3">
                    {event.faqs.map((faq) => (
                      <details key={faq.id} className="glass-panel group rounded-[22px] p-5">
                        <summary className="flex cursor-pointer items-center justify-between text-[15px] font-medium text-ink outline-none [&::-webkit-details-marker]:hidden">
                          {faq.question}
                          <ChevronDown size={18} className="text-g4 transition-transform group-open:rotate-180" />
                        </summary>
                        <p className="mt-4 border-t border-g3 pt-4 text-[14px] leading-7 text-g5">
                          {faq.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>

            <div className="space-y-6 lg:pt-4">
              <div className="sticky top-24 space-y-6">
                <RsvpClient
                  eventId={event.id}
                  initialRegistered={initialRegistered}
                  isFull={isFull}
                  price={price}
                  attendeesCount={event.attendance.length}
                  capacity={event.capacity}
                />

                <div className="glass-panel rounded-[26px] p-6">
                  <div className="eyebrow">People in the room</div>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {event.space.organization.members.length > 0 ? (
                      event.space.organization.members.map((member) => (
                        <div key={member.id} className="flex items-center gap-3 rounded-full border border-g3 bg-g1/70 px-3 py-2">
                          <Avatar src={member.user.avatarUrl || ""} name={member.user.name || "Member"} size={28} />
                          <div className="text-[13px]">
                            <div className="text-ink">{member.user.name || "Member"}</div>
                            <div className="text-g5">{member.role}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-[14px] leading-7 text-g5">
                        Organizer team members will appear here once the community profile is completed.
                      </p>
                    )}
                  </div>
                </div>

                {event.sponsors.length > 0 ? (
                  <div className="glass-panel rounded-[26px] p-6">
                    <div className="eyebrow">Sponsors</div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {event.sponsors.map((sponsor) => (
                        <span key={sponsor.id} className="rounded-full border border-g3 bg-g1/70 px-3 py-2 text-[13px] text-ink">
                          {sponsor.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                {event.resources.length > 0 ? (
                  <div className="glass-panel rounded-[26px] p-6">
                    <div className="eyebrow">Resources</div>
                    <div className="mt-4 space-y-3">
                      {event.resources.map((resource) => (
                        <a
                          key={resource.id}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 rounded-[18px] border border-g3 bg-g1/65 px-4 py-3 text-[14px] text-g5 transition hover:text-ink"
                        >
                          <FileText size={15} className="text-[var(--brand)]" />
                          <span>{resource.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
