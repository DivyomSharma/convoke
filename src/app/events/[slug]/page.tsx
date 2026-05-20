import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  ExternalLink,
  Gift,
  MapPin,
  Mic2,
  QrCode,
  Shirt,
  Users,
} from "lucide-react";
import { Footer } from "@/components/marketing/footer";
import { MotionShell } from "@/components/marketing/motion-shell";
import { SiteHeader } from "@/components/marketing/site-header";
import { FAQSection } from "@/app/events/[slug]/faq-section";
import { ApplyButton } from "@/components/ui/apply-button";
import { ButtonLink } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { SaveButton } from "@/components/ui/save-button";
import { getEventPageData, listHomeData } from "@/lib/platform-service";
import { formatInr } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventPageData(slug);

  return {
    title: event ? event.title : "Event",
    description:
      event?.description ||
      "Explore schedules, registrations, speakers, sponsors, and participation on Convoke.",
  };
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const [event, home] = await Promise.all([getEventPageData(slug), listHomeData()]);

  if (!event) {
    notFound();
  }

  const ticket = event.ticketTypes[0];
  const relatedEvents = home.events
    .filter((item) => item.slug !== event.slug)
    .slice(0, 3);

  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden px-5 pb-24 pt-24 md:px-8">
        <div className="mx-auto max-w-7xl">
          <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <MotionShell>
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-bronze">
                  {event.category}
                </p>
                <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-[-0.05em] md:text-7xl">
                  {event.title}
                </h1>
                <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
                  {event.description}
                </p>
                <div className="mt-8 flex flex-wrap gap-5 text-sm text-muted">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays className="size-4 text-bronze" />
                    {event.date}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="size-4 text-bronze" />
                    {event.city}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Users className="size-4 text-bronze" />
                    {event.attendees.toLocaleString("en-IN")} participants
                  </span>
                </div>
              </div>
            </MotionShell>

            <MotionShell delay={0.08}>
              <Panel className="p-5">
                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <div className="rounded-[8px] border border-line bg-black/30 px-4 py-3">
                    <p className="text-xs text-muted">Registration</p>
                    <p className="mt-2 text-lg font-medium text-foreground">
                      {ticket ? (ticket.priceInr ? formatInr(ticket.priceInr) : "Free") : "Open"}
                    </p>
                  </div>
                  <div className="rounded-[8px] border border-line bg-black/30 px-4 py-3">
                    <p className="text-xs text-muted">Spots left</p>
                    <p className="mt-2 text-lg font-medium text-foreground">
                      {event.spotsLeft.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="rounded-[8px] border border-line bg-black/30 px-4 py-3">
                    <p className="text-xs text-muted">Mode</p>
                    <p className="mt-2 text-lg font-medium text-foreground">{event.mode}</p>
                  </div>
                </div>
              </Panel>
            </MotionShell>
          </section>

          <MotionShell delay={0.12}>
            <div className="relative mt-12 overflow-hidden rounded-[8px] border border-line">
              <div className="relative h-[320px] md:h-[520px]">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  priority
                  className="object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${event.palette}`} />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <p className="max-w-2xl text-sm leading-6 text-white/80 md:text-base">
                    {event.tagline}
                  </p>
                </div>
              </div>
            </div>
          </MotionShell>

          <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_320px]">
            <div className="space-y-16">
              <section id="overview">
                <MotionShell>
                  <div className="grid gap-4 md:grid-cols-3">
                    {[
                      {
                        label: "Attendees",
                        value: event.attendees.toLocaleString("en-IN"),
                        copy: "Real registrations tracked inside Convoke.",
                      },
                      {
                        label: "Volunteers",
                        value: String(event.volunteers),
                        copy: "Volunteer applications and approvals stay attached to the event.",
                      },
                      {
                        label: "Tickets",
                        value: String(event.ticketTypes.length),
                        copy: "Registration logic supports free, paid, and approval flows.",
                      },
                    ].map((item) => (
                      <Panel key={item.label} className="p-5">
                        <p className="text-xs text-muted">{item.label}</p>
                        <p className="mt-3 text-3xl font-semibold">{item.value}</p>
                        <p className="mt-2 text-sm leading-6 text-muted">{item.copy}</p>
                      </Panel>
                    ))}
                  </div>
                </MotionShell>
              </section>

              <section id="schedule">
                <MotionShell>
                  <h2 className="text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
                    Schedule
                  </h2>
                </MotionShell>
                <div className="mt-8 space-y-4">
                  {event.schedules.length ? (
                    event.schedules.map((session, index) => (
                      <MotionShell key={session.id} delay={index * 0.04}>
                        <Panel className="p-5">
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                              <p className="text-xs uppercase tracking-wider text-bronze">
                                {session.startsAt} {session.endsAt ? `- ${session.endsAt}` : ""}
                              </p>
                              <h3 className="mt-2 text-xl font-medium">{session.title}</h3>
                              {session.description ? (
                                <p className="mt-3 text-sm leading-6 text-muted">
                                  {session.description}
                                </p>
                              ) : null}
                            </div>
                            {session.location ? (
                              <span className="inline-flex items-center gap-2 text-sm text-muted">
                                <MapPin className="size-4 text-bronze" />
                                {session.location}
                              </span>
                            ) : null}
                          </div>
                        </Panel>
                      </MotionShell>
                    ))
                  ) : (
                    <Panel className="p-5 text-sm text-muted">
                      Schedule blocks will appear here as soon as the organizer publishes them.
                    </Panel>
                  )}
                </div>
              </section>

              {event.speakers.length ? (
                <section id="speakers">
                  <MotionShell>
                    <h2 className="text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
                      Speakers and judges
                    </h2>
                  </MotionShell>
                  <div className="mt-8 grid gap-4 md:grid-cols-2">
                    {event.speakers.map((speaker, index) => (
                      <MotionShell key={speaker.id} delay={index * 0.05}>
                        <Panel className="p-5">
                          <div className="flex items-start gap-4">
                            <div className="grid size-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-bronze to-rust text-sm font-semibold text-black">
                              {speaker.name
                                .split(" ")
                                .map((part) => part[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-bronze">
                                <Mic2 className="size-3.5" />
                                {speaker.organization ?? "Convoke network"}
                              </div>
                              <h3 className="mt-2 text-xl font-medium">{speaker.name}</h3>
                              <p className="mt-1 text-sm text-muted">{speaker.title}</p>
                              {speaker.talkTitle ? (
                                <p className="mt-4 text-sm leading-6 text-foreground">
                                  {speaker.talkTitle}
                                </p>
                              ) : null}
                              {speaker.bio ? (
                                <p className="mt-3 text-sm leading-6 text-muted">
                                  {speaker.bio}
                                </p>
                              ) : null}
                            </div>
                          </div>
                        </Panel>
                      </MotionShell>
                    ))}
                  </div>
                </section>
              ) : null}

              <section id="sponsors">
                <MotionShell>
                  <h2 className="text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
                    Sponsors and backing
                  </h2>
                </MotionShell>
                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  {event.sponsors.length ? (
                    event.sponsors.map((sponsor, index) => (
                      <MotionShell key={sponsor.id} delay={index * 0.05}>
                        <Panel className="p-5">
                          <div className="flex items-center justify-between gap-4">
                            <div>
                              <p className="text-xs uppercase tracking-wider text-bronze">
                                {sponsor.tier}
                              </p>
                              <h3 className="mt-2 text-xl font-medium">{sponsor.companyName}</h3>
                            </div>
                            <Gift className="size-5 text-bronze" />
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {sponsor.benefits.map((benefit) => (
                              <span
                                key={benefit}
                                className="rounded-full border border-line bg-white/[0.04] px-3 py-1 text-xs text-muted"
                              >
                                {benefit}
                              </span>
                            ))}
                          </div>
                        </Panel>
                      </MotionShell>
                    ))
                  ) : (
                    <Panel className="p-5 text-sm text-muted">
                      Sponsorship details will land here once the pipeline is confirmed.
                    </Panel>
                  )}
                </div>
              </section>

              <section id="gallery">
                <MotionShell>
                  <h2 className="text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
                    Gallery
                  </h2>
                </MotionShell>
                <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
                  {event.galleries.map((image, index) => (
                    <MotionShell key={`${image}-${index}`} delay={index * 0.04}>
                      <div
                        className={`relative overflow-hidden rounded-[8px] border border-line ${
                          index === 0 ? "col-span-2 h-64 md:h-80" : "h-44 md:h-56"
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`${event.title} gallery ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </MotionShell>
                  ))}
                </div>
              </section>

              <section id="faqs">
                <MotionShell>
                  <h2 className="text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
                    FAQs
                  </h2>
                </MotionShell>
                <div className="mt-8">
                  <FAQSection faqs={event.faqs} />
                </div>
              </section>

              {relatedEvents.length ? (
                <section id="more">
                  <MotionShell>
                    <div className="flex items-end justify-between gap-4">
                      <div>
                        <h2 className="text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
                          More to join
                        </h2>
                        <p className="mt-3 text-sm text-muted">
                          Nearby momentum from the same ecosystem.
                        </p>
                      </div>
                      <ButtonLink href="/events" variant="secondary">
                        Browse events
                      </ButtonLink>
                    </div>
                  </MotionShell>
                  <div className="mt-8 grid gap-4 md:grid-cols-3">
                    {relatedEvents.map((item, index) => (
                      <MotionShell key={item.id} delay={index * 0.05}>
                        <Link href={`/events/${item.slug}`}>
                          <Panel className="overflow-hidden p-0 transition hover:border-bronze/50">
                            <div className="relative h-52">
                              <Image src={item.image} alt={item.title} fill className="object-cover" />
                              <div className={`absolute inset-0 bg-gradient-to-t ${item.palette}`} />
                              <div className="absolute inset-x-0 bottom-0 p-4">
                                <p className="text-xs text-white/75">{item.category}</p>
                                <h3 className="mt-2 text-2xl font-medium">{item.title}</h3>
                                <p className="mt-2 text-sm text-white/75">
                                  {item.city} / {item.date}
                                </p>
                              </div>
                            </div>
                          </Panel>
                        </Link>
                      </MotionShell>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <Panel className="p-5">
                <p className="text-xs uppercase tracking-wider text-muted">
                  Registration
                </p>
                <p className="mt-3 text-3xl font-semibold">
                  {ticket ? (ticket.priceInr ? formatInr(ticket.priceInr) : "Free") : "Open"}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Save the event, register instantly, or jump into the community behind it.
                </p>
                <div className="mt-5 space-y-3">
                  <ApplyButton
                    mode="register"
                    label={event.registered ? "Registered" : "Register now"}
                    eventId={event.id}
                    ticketTypeId={ticket?.id}
                    initialApplied={event.registered}
                  />
                  <SaveButton eventId={event.id} initialSaved={event.saved} />
                </div>
              </Panel>

              <Panel className="p-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-[8px] border border-line bg-black/30 px-4 py-3">
                    <span className="text-sm text-muted">QR-ready ticketing</span>
                    <QrCode className="size-4 text-bronze" />
                  </div>
                  <div className="flex items-center justify-between rounded-[8px] border border-line bg-black/30 px-4 py-3">
                    <span className="text-sm text-muted">Volunteer layer</span>
                    <Users className="size-4 text-bronze" />
                  </div>
                  <div className="flex items-center justify-between rounded-[8px] border border-line bg-black/30 px-4 py-3">
                    <span className="text-sm text-muted">Merch support</span>
                    <Shirt className="size-4 text-bronze" />
                  </div>
                </div>
              </Panel>

              <Panel className="p-5">
                <p className="text-xs uppercase tracking-wider text-bronze">Hosted by</p>
                <h3 className="mt-2 text-2xl font-medium">{event.organizer}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Community page, announcements, opportunities, and future events all stay linked.
                </p>
                <div className="mt-5 space-y-3">
                  <ButtonLink href={`/communities/${event.organizerSlug}`} variant="secondary" className="w-full">
                    Visit community
                  </ButtonLink>
                  <a
                    href="https://merch.theplotarmour.xyz/?utm_source=convoke"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-line bg-white/[0.03] px-5 py-3 text-sm text-foreground transition hover:border-bronze/50"
                  >
                    Merch support
                    <ExternalLink className="size-4" />
                  </a>
                </div>
              </Panel>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
