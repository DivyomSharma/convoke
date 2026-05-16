import type { Metadata } from "next";
import Image from "next/image";
import { Calendar, MapPin, QrCode, Shirt, Trophy, Users } from "lucide-react";
import { Footer } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { ButtonLink } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { featuredEvents } from "@/data/platform";
import { formatInr } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = featuredEvents.find((item) => item.slug === slug) ?? featuredEvents[0];

  return {
    title: event.title,
    description: `${event.title} by ${event.organizer} on Convoke.`,
    openGraph: {
      title: event.title,
      description: `${event.city} / ${event.date} / ${event.category}`,
      type: "website",
    },
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = featuredEvents.find((item) => item.slug === slug) ?? featuredEvents[0];
  const sections = ["Overview", "Schedule", "Speakers", "Sponsors", "Prizes", "FAQs", "Gallery"];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    eventAttendanceMode: event.mode,
    location: event.city,
    startDate: "2026-08-24T10:00:00+05:30",
    organizer: { "@type": "Organization", name: event.organizer },
    offers: { "@type": "Offer", price: event.price, priceCurrency: "INR" },
  };

  return (
    <>
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="px-5 pb-28 pt-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          <section className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <div>
              <div className="flex flex-wrap gap-3 text-sm text-muted">
                <span>{event.category}</span>
                <span>/</span>
                <span>{event.organizer}</span>
              </div>
              <h1 className="mt-6 max-w-4xl text-6xl font-semibold tracking-[-0.05em] md:text-9xl">
                {event.title}
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">
                A community invite for people who want to meet, build, learn,
                volunteer, sponsor, and become part of what happens next.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  [Calendar, event.date],
                  [MapPin, event.city],
                  [Users, `${event.attendees.toLocaleString("en-IN")} attending`],
                ].map(([Icon, label]) => (
                  <span
                    key={String(label)}
                    className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted"
                  >
                    <Icon className="size-4 text-bronze" />
                    {String(label)}
                  </span>
                ))}
              </div>
            </div>
            <Panel className="sticky top-24 h-fit p-5">
              <p className="text-sm text-muted">Registration</p>
              <p className="mt-2 text-4xl font-semibold">
                {event.price ? formatInr(event.price) : "Free"}
              </p>
              <ButtonLink href="/auth/sign-in" className="mt-6 w-full">
                Register now
              </ButtonLink>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs text-muted">
                <div className="rounded-[8px] bg-white/[0.04] p-3">
                  <QrCode className="mx-auto mb-2 size-4 text-steel" />
                  QR
                </div>
                <div className="rounded-[8px] bg-white/[0.04] p-3">
                  <Shirt className="mx-auto mb-2 size-4 text-steel" />
                  Merch
                </div>
                <div className="rounded-[8px] bg-white/[0.04] p-3">
                  <Trophy className="mx-auto mb-2 size-4 text-steel" />
                  Prizes
                </div>
              </div>
            </Panel>
          </section>

          <div className="relative mt-14 h-[420px] overflow-hidden rounded-[8px] border border-line">
            <Image
              src={event.image}
              alt={`${event.title} event atmosphere`}
              fill
              className="object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${event.palette}`} />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-sm text-white/75">{event.tagline}</p>
              <div className="mt-5 flex -space-x-3">
                {["R", "V", "S", "P", "D"].map((avatar) => (
                  <span key={avatar} className="grid size-10 place-items-center rounded-full border border-black bg-white text-sm font-semibold text-black">
                    {avatar}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <nav className="mt-16 flex gap-3 overflow-x-auto border-y border-line py-4 scrollbar-none">
            {sections.map((section) => (
              <a key={section} href={`#${section.toLowerCase()}`} className="shrink-0 text-sm text-muted hover:text-foreground">
                {section}
              </a>
            ))}
          </nav>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {sections.map((section) => (
              <Panel key={section} id={section.toLowerCase()} className="min-h-64 p-6">
                <h2 className="text-3xl font-medium tracking-[-0.03em]">{section}</h2>
                <p className="mt-4 leading-7 text-muted">
                  {section} content is modeled as modular event-builder blocks so
                  organizers can share the story, coordinate people, and keep
                  the event page alive as the community gathers.
                </p>
              </Panel>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
