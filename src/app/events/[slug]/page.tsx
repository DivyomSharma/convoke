import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, QrCode, Ticket, Users } from "lucide-react";
import { Footer } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { ApplyButton } from "@/components/ui/apply-button";
import { ButtonLink } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { SaveButton } from "@/components/ui/save-button";
import { getEventPageData, listHomeData } from "@/lib/platform-service";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventPageData(slug);

  return {
    title: event ? event.title : "Event",
    description: event?.description || "Real event operations on Convoke.",
  };
}

export default async function EventPage({ params }: PageProps) {
  const { slug } = await params;
  const [event, home] = await Promise.all([getEventPageData(slug), listHomeData()]);

  if (!event) notFound();

  const relatedEvents = home.events.filter((item) => item.slug !== event.slug).slice(0, 3);
  const primaryTicket = event.ticketTypes[0];

  return (
    <>
      <SiteHeader />
      <main className="px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          <section className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-bronze">{event.category}</p>
              <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em] md:text-7xl">{event.title}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">{event.description}</p>
              <div className="mt-8 flex flex-wrap gap-5 text-sm text-muted">
                <span className="inline-flex items-center gap-2">
                  <CalendarDays className="size-4 text-bronze" />
                  {event.date}
                </span>
                <span className="inline-flex items-center gap-2">
                  <MapPin className="size-4 text-bronze" />
                  {event.venue ? `${event.venue}, ${event.city}` : event.city}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Users className="size-4 text-bronze" />
                  {event.attendees.toLocaleString("en-IN")} registered
                </span>
              </div>
            </div>

            <Panel className="p-5">
              <div className="space-y-3">
                <div className="rounded-[8px] border border-line bg-black/30 px-4 py-3">
                  <p className="text-xs text-muted">Primary ticket</p>
                  <p className="mt-2 text-lg font-medium">
                    {primaryTicket ? (primaryTicket.priceInr > 0 ? `INR ${primaryTicket.priceInr}` : "Free") : "TBA"}
                  </p>
                </div>
                <div className="rounded-[8px] border border-line bg-black/30 px-4 py-3">
                  <p className="text-xs text-muted">Waitlist</p>
                  <p className="mt-2 text-lg font-medium">{event.waitlist.toLocaleString("en-IN")}</p>
                </div>
                <div className="rounded-[8px] border border-line bg-black/30 px-4 py-3">
                  <p className="text-xs text-muted">Mode</p>
                  <p className="mt-2 text-lg font-medium">{event.mode}</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                <ApplyButton
                  mode="register"
                  label={event.registered ? "Registered" : "Register now"}
                  eventId={event.id}
                  ticketTypeId={primaryTicket?.id}
                  initialApplied={event.registered}
                />
                <SaveButton eventId={event.id} initialSaved={event.saved} />
              </div>
            </Panel>
          </section>

          <section className="mt-12 overflow-hidden rounded-[8px] border border-line">
            <div className="relative h-[320px] md:h-[520px]">
              <Image src={event.image} alt={event.title} fill priority className="object-cover" />
              <div className={`absolute inset-0 bg-gradient-to-t ${event.palette}`} />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <p className="max-w-2xl text-lg text-white/80">{event.tagline}</p>
              </div>
            </div>
          </section>

          <section className="mt-16 grid gap-6 xl:grid-cols-[1fr_1fr_320px]">
            <div className="space-y-6">
              <Panel className="p-5">
                <h2 className="text-2xl font-medium">Tracks</h2>
                <div className="mt-5 space-y-3">
                  {event.tracks.length ? (
                    event.tracks.map((track) => (
                      <div key={track.id} className="rounded-[8px] border border-line bg-black/30 p-4">
                        <p className="font-medium">{track.name}</p>
                        {track.description ? <p className="mt-2 text-sm leading-6 text-muted">{track.description}</p> : null}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted">Tracks will appear here once the organizer configures them.</p>
                  )}
                </div>
              </Panel>

              <Panel className="p-5">
                <h2 className="text-2xl font-medium">Schedule</h2>
                <div className="mt-5 space-y-3">
                  {event.schedules.length ? (
                    event.schedules.map((item) => (
                      <div key={item.id} className="rounded-[8px] border border-line bg-black/30 p-4">
                        <p className="text-xs uppercase tracking-wider text-bronze">{item.startsAt}</p>
                        <p className="mt-2 font-medium">{item.title}</p>
                        {item.description ? <p className="mt-2 text-sm leading-6 text-muted">{item.description}</p> : null}
                        {item.location ? <p className="mt-2 text-xs text-muted">{item.location}</p> : null}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted">No schedule blocks published yet.</p>
                  )}
                </div>
              </Panel>

              <Panel className="p-5">
                <h2 className="text-2xl font-medium">FAQs</h2>
                <div className="mt-5 space-y-3">
                  {event.faqs.length ? (
                    event.faqs.map((faq, index) => (
                      <div key={`${faq.q}-${index}`} className="rounded-[8px] border border-line bg-black/30 p-4">
                        <p className="font-medium">{faq.q}</p>
                        <p className="mt-2 text-sm leading-6 text-muted">{faq.a}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted">The organizer has not added FAQs yet.</p>
                  )}
                </div>
              </Panel>
            </div>

            <div className="space-y-6">
              <Panel className="p-5">
                <h2 className="text-2xl font-medium">People around the event</h2>
                <div className="mt-5 space-y-3">
                  {event.speakers.map((speaker) => (
                    <div key={speaker.id} className="rounded-[8px] border border-line bg-black/30 p-4">
                      <p className="font-medium">{speaker.name}</p>
                      <p className="mt-1 text-sm text-muted">{speaker.title}</p>
                      {speaker.talkTitle ? <p className="mt-3 text-sm text-foreground">{speaker.talkTitle}</p> : null}
                    </div>
                  ))}
                  {event.judges.map((judge) => (
                    <div key={judge.id} className="rounded-[8px] border border-line bg-black/30 p-4">
                      <p className="font-medium">{judge.name}</p>
                      <p className="mt-1 text-sm text-muted">{judge.title}</p>
                    </div>
                  ))}
                  {!event.speakers.length && !event.judges.length ? (
                    <p className="text-sm text-muted">Speaker and judge information will appear after publishing.</p>
                  ) : null}
                </div>
              </Panel>

              <Panel className="p-5">
                <h2 className="text-2xl font-medium">Sponsors</h2>
                <div className="mt-5 space-y-3">
                  {event.sponsors.length ? (
                    event.sponsors.map((sponsor) => (
                      <div key={sponsor.id} className="rounded-[8px] border border-line bg-black/30 p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-medium">{sponsor.companyName}</p>
                          <span className="text-xs uppercase tracking-wider text-bronze">{sponsor.tier}</span>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {sponsor.benefits.map((benefit) => (
                            <span key={benefit} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted">No sponsor entities attached yet.</p>
                  )}
                </div>
              </Panel>
            </div>

            <div className="space-y-6">
              <Panel className="p-5">
                <h2 className="text-2xl font-medium">Event operations</h2>
                <div className="mt-5 space-y-3 text-sm text-muted">
                  <div className="flex items-center justify-between rounded-[8px] border border-line bg-black/30 px-4 py-3">
                    <span>Registrations</span>
                    <span>{event.attendees.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-[8px] border border-line bg-black/30 px-4 py-3">
                    <span>Volunteer layer</span>
                    <span>{event.volunteers}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-[8px] border border-line bg-black/30 px-4 py-3">
                    <span>QR flow</span>
                    <QrCode className="size-4 text-bronze" />
                  </div>
                  <div className="flex items-center justify-between rounded-[8px] border border-line bg-black/30 px-4 py-3">
                    <span>Ticket types</span>
                    <span className="inline-flex items-center gap-2">
                      <Ticket className="size-4 text-bronze" />
                      {event.ticketTypes.length}
                    </span>
                  </div>
                </div>
              </Panel>

              <Panel className="p-5">
                <p className="text-xs uppercase tracking-wider text-bronze">Connected community</p>
                <h3 className="mt-2 text-2xl font-medium">{event.community ?? event.organizer}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Events on Convoke stay attached to the communities and organizers behind them.
                </p>
                <ButtonLink href={event.communitySlug ? `/communities/${event.communitySlug}` : "/communities"} variant="secondary" className="mt-5 w-full">
                  Open community
                </ButtonLink>
              </Panel>
            </div>
          </section>

          {relatedEvents.length ? (
            <section className="mt-16">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-medium tracking-[-0.03em] md:text-4xl">More to join</h2>
                  <p className="mt-2 text-sm text-muted">Other active event paths in the ecosystem.</p>
                </div>
                <ButtonLink href="/events" variant="secondary">Browse all</ButtonLink>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {relatedEvents.map((item) => (
                  <Link key={item.id} href={`/events/${item.slug}`}>
                    <Panel className="overflow-hidden p-0 transition hover:border-bronze/50">
                      <div className="relative h-52">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                        <div className={`absolute inset-0 bg-gradient-to-t ${item.palette}`} />
                        <div className="absolute inset-x-0 bottom-0 p-4">
                          <p className="text-xs uppercase tracking-wider text-white/75">{item.category}</p>
                          <h3 className="mt-2 text-2xl font-medium">{item.title}</h3>
                          <p className="mt-2 text-sm text-white/75">{item.city} / {item.date}</p>
                        </div>
                      </div>
                    </Panel>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
