import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Megaphone, Users } from "lucide-react";
import { Footer } from "@/components/marketing/footer";
import { MotionShell } from "@/components/marketing/motion-shell";
import { SiteHeader } from "@/components/marketing/site-header";
import { ButtonLink } from "@/components/ui/button";
import { JoinCommunityButton } from "@/components/ui/join-community-button";
import { Panel } from "@/components/ui/panel";
import { SaveButton } from "@/components/ui/save-button";
import { getCommunityPageData } from "@/lib/platform-service";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const community = await getCommunityPageData(slug);

  return {
    title: community ? community.name : "Community",
    description:
      community?.description || "Community details, events, opportunities, and members on Convoke.",
  };
}

export default async function CommunityPage({ params }: PageProps) {
  const { slug } = await params;
  const community = await getCommunityPageData(slug);

  if (!community) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          <section className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div>
              <p className="text-sm uppercase tracking-wider text-bronze">{community.type}</p>
              <h1 className="mt-4 text-5xl font-semibold tracking-[-0.04em] md:text-7xl">
                {community.name}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
                {community.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <JoinCommunityButton organizationId={community.id} />
                <div className="w-full sm:w-auto">
                  <SaveButton organizationId={community.id} />
                </div>
              </div>
            </div>
            <Panel className="p-5">
              <div className="space-y-3">
                {community.stats.map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between rounded-[8px] border border-line bg-black/30 px-4 py-3">
                    <span className="text-sm text-muted">{stat.label}</span>
                    <span className="font-mono text-bronze">{stat.value}</span>
                  </div>
                ))}
              </div>
            </Panel>
          </section>

          <section className="mt-12">
            <div className="grid gap-4 md:grid-cols-3">
              {community.events.slice(0, 3).map((event, index) => (
                <MotionShell key={event.id} delay={index * 0.05}>
                  <Link href={`/events/${event.slug}`}>
                    <Panel className="group overflow-hidden p-0 transition hover:border-bronze/50">
                      <div className="relative h-56">
                        <Image src={event.image} alt={event.title} fill className="object-cover" />
                        <div className={`absolute inset-0 bg-gradient-to-t ${event.palette}`} />
                        <div className="absolute bottom-0 p-5">
                          <h2 className="text-2xl font-medium">{event.title}</h2>
                          <p className="mt-2 text-sm text-white/75">{event.city} / {event.date}</p>
                        </div>
                      </div>
                    </Panel>
                  </Link>
                </MotionShell>
              ))}
            </div>
          </section>

          <section className="mt-16 grid gap-6 lg:grid-cols-[1fr_1fr]">
            <Panel className="p-5">
              <div className="flex items-center gap-2 text-lg font-medium">
                <Megaphone className="size-5 text-bronze" />
                Announcements
              </div>
              <div className="mt-5 space-y-3">
                {community.announcements.map((announcement) => (
                  <div key={announcement.id} className="rounded-[8px] border border-line bg-black/30 p-4">
                    <p className="font-medium">{announcement.title}</p>
                    <p className="mt-2 text-sm leading-6 text-muted">{announcement.content}</p>
                    <p className="mt-3 text-xs text-bronze">{announcement.publishedAt}</p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel className="p-5">
              <div className="flex items-center gap-2 text-lg font-medium">
                <Users className="size-5 text-bronze" />
                Members
              </div>
              <div className="mt-5 space-y-3">
                {community.members.map((member) => (
                  <Link
                    key={member.id}
                    href={`/u/${member.username}`}
                    className="flex items-center gap-3 rounded-[8px] border border-line bg-black/30 p-4 transition hover:border-bronze/50"
                  >
                    <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-bronze to-rust text-sm font-semibold text-black">
                      {member.initials}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted">{member.headline}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </Panel>
          </section>

          <section className="mt-16">
            <div className="mb-6 flex items-end justify-between">
              <h2 className="text-3xl font-medium tracking-[-0.03em] md:text-4xl">Open roles</h2>
              <ButtonLink href="/opportunities" variant="secondary">
                View all
              </ButtonLink>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {community.opportunities.slice(0, 3).map((opportunity) => (
                <Panel key={opportunity.id} className="p-5">
                  <p className="text-xs uppercase tracking-wider text-bronze">{opportunity.type}</p>
                  <h3 className="mt-3 text-xl font-medium">{opportunity.title}</h3>
                  <p className="mt-2 text-sm text-muted">{opportunity.location}</p>
                  <p className="mt-4 text-sm leading-6 text-muted">{opportunity.description}</p>
                </Panel>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
