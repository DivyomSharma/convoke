import { ArrowRight, Building2, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { CommandPreview } from "@/components/marketing/command-preview";
import { Footer } from "@/components/marketing/footer";
import { MotionShell } from "@/components/marketing/motion-shell";
import { SiteHeader } from "@/components/marketing/site-header";
import {
  categories,
  communityMoments,
  featuredEvents,
  platformModules,
  workflowCards,
} from "@/data/platform";
import { formatInr } from "@/lib/utils";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="overflow-hidden bg-background">
        <section className="relative min-h-screen px-5 pb-24 pt-32 md:px-8 md:pt-40">
          <div className="metal-grid absolute inset-x-0 top-0 h-[620px]" />
          <div className="absolute left-1/2 top-24 h-[420px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(185,101,53,0.22),transparent_62%)] blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <MotionShell>
              <div>
                <h1 className="max-w-5xl text-balance text-6xl font-semibold leading-[0.9] tracking-[-0.04em] text-foreground md:text-8xl lg:text-9xl">
                  For events, ideas, and people moving things forward.
                </h1>
                <p className="mt-8 max-w-2xl text-lg leading-8 text-muted md:text-xl">
                  Discover communities in motion. Join hackathons, campus
                  societies, creator circles, startup rooms, NGO drives, and the
                  people turning ambition into culture.
                </p>
                <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                  <ButtonLink href="/discover" className="group">
                    Find your next community
                    <ArrowRight className="size-4 transition group-hover:translate-x-1" />
                  </ButtonLink>
                  <ButtonLink href="/merch" variant="secondary">
                    Plan merchandise
                  </ButtonLink>
                </div>
              </div>
            </MotionShell>
            <MotionShell delay={0.12}>
              <div className="grid gap-4">
                <div className="relative min-h-[520px] overflow-hidden rounded-[8px] border border-line">
                  <Image
                    src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=90"
                    alt="Students gathering at a community event"
                    fill
                    priority
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-sm text-bronze">Campus Protocol</p>
                    <h2 className="mt-2 text-4xl font-semibold tracking-[-0.04em]">
                      Where ambitious people gather.
                    </h2>
                    <div className="mt-5 flex -space-x-3">
                      {["A", "M", "N", "K", "S"].map((avatar) => (
                        <span
                          key={avatar}
                          className="grid size-10 place-items-center rounded-full border border-black bg-gradient-to-br from-bronze to-rust text-sm font-semibold text-black"
                        >
                          {avatar}
                        </span>
                      ))}
                      <span className="grid size-10 place-items-center rounded-full border border-line bg-black/70 text-xs text-muted">
                        +2k
                      </span>
                    </div>
                  </div>
                </div>
                <CommandPreview />
              </div>
            </MotionShell>
          </div>
        </section>

        <section className="border-y border-line bg-[#080808] px-5 py-16 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.7fr_1fr] md:items-end">
            <MotionShell>
              <h2 className="text-3xl font-medium tracking-[-0.03em] md:text-5xl">
                Built for communities that create momentum.
              </h2>
            </MotionShell>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {platformModules.map((item, index) => (
                <MotionShell key={item.title} delay={index * 0.04}>
                  <div className="h-full rounded-[8px] border border-line bg-white/[0.025] p-5 transition hover:border-bronze/50 hover:bg-white/[0.05]">
                    <item.icon className="size-5 text-bronze" />
                    <h3 className="mt-5 text-lg font-medium">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-muted">
                      {item.description}
                    </p>
                  </div>
                </MotionShell>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-24 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <h2 className="max-w-2xl text-4xl font-medium tracking-[-0.03em] md:text-6xl">
                Featured events with a pulse.
              </h2>
              <ButtonLink href="/discover" variant="secondary">
                View all
              </ButtonLink>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {featuredEvents.map((event, index) => (
                <MotionShell key={event.slug} delay={index * 0.05}>
                  <a href={`/events/${event.slug}`}>
                    <Panel className="group h-full overflow-hidden p-0 transition hover:-translate-y-1 hover:border-bronze/50">
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={event.image}
                          alt={`${event.title} event poster`}
                          fill
                          className="object-cover transition duration-700 group-hover:scale-105"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-t ${event.palette}`} />
                        <div className="absolute left-4 right-4 top-4 flex items-center justify-between text-xs text-white/80">
                          <span>{event.category}</span>
                          <span>{event.mode}</span>
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-3xl font-medium tracking-[-0.03em]">
                          {event.title}
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-muted">
                          {event.tagline}
                        </p>
                        <div className="mt-8 flex items-center justify-between border-t border-line pt-5 text-sm">
                          <span>{event.city} / {event.date}</span>
                          <span className="font-mono text-bronze">
                            {event.price ? formatInr(event.price) : "Free"}
                          </span>
                        </div>
                      </div>
                    </Panel>
                  </a>
                </MotionShell>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#0a0908] px-5 py-24 md:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <MotionShell>
              <h2 className="text-4xl font-medium tracking-[-0.03em] md:text-6xl">
                Culture, merch, startups, and stories in one place.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
                Studio support, fashion-aware merch, store drops, sponsor kits,
                creator collections, and startup onboarding sit close to the
                communities already making things happen.
              </p>
            </MotionShell>
            <div className="grid gap-4 sm:grid-cols-2">
              {["PlotArmour", "Studio", "Merch", "Store"].map((name, index) => (
                <MotionShell key={name} delay={index * 0.05}>
                  <Panel className="flex min-h-40 flex-col justify-between p-5">
                    <Building2 className="size-5 text-steel" />
                    <div>
                      <h3 className="text-2xl font-medium">{name}</h3>
                      <p className="mt-2 text-sm text-muted">
                        Integrated as a premium capability layer.
                      </p>
                    </div>
                  </Panel>
                </MotionShell>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 py-24 md:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-16 grid gap-4 md:grid-cols-3">
              {communityMoments.map((moment) => (
                <Panel key={moment.title} className="overflow-hidden p-0">
                  <div className="relative h-72">
                    <Image
                      src={moment.image}
                      alt={moment.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                    <div className="absolute bottom-0 p-5">
                      <h3 className="text-2xl font-medium">{moment.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-white/75">
                        {moment.copy}
                      </p>
                    </div>
                  </div>
                </Panel>
              ))}
            </div>
            <h2 className="max-w-3xl text-4xl font-medium tracking-[-0.03em] md:text-6xl">
              One platform for every community format.
            </h2>
            <div className="mt-10 flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((category) => (
                <a
                  key={category}
                  href={`/discover?category=${category}`}
                  className="shrink-0 rounded-full border border-line bg-white/[0.035] px-5 py-3 text-sm text-muted transition hover:border-rust/70 hover:text-foreground"
                >
                  {category}
                </a>
              ))}
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-4">
              {workflowCards.map((card) => (
                <Panel key={card.label} className="p-5">
                  <card.icon className="size-5 text-rust" />
                  <p className="mt-8 text-sm text-muted">{card.label}</p>
                  <p className="mt-1 text-xl font-medium">{card.value}</p>
                </Panel>
              ))}
            </div>
          </div>
        </section>

        <section className="px-5 pb-24 md:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[8px] border border-bronze/30 bg-[linear-gradient(135deg,rgba(198,161,111,0.18),rgba(185,101,53,0.12)_38%,rgba(141,161,184,0.08))] p-8 md:p-12">
            <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <h2 className="max-w-3xl text-4xl font-semibold tracking-[-0.04em] md:text-7xl">
                  Operate the next ambitious community.
                </h2>
                <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                  Start with discovery, gather the right people, bring sponsors
                  into the story, coordinate volunteers, launch merch, and turn
                  participation into reputation.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  "Custom native auth pages",
                  "Collaborative organizer hubs",
                  "SEO and schema-ready event surfaces",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="size-5 text-bronze" />
                    {item}
                  </div>
                ))}
                <ButtonLink href="/auth/sign-in" className="mt-5 w-full sm:w-auto">
                  Enter Convoke
                </ButtonLink>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
