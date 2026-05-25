import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Megaphone, TrendingUp, Users } from "lucide-react";
import { Footer } from "@/components/marketing/footer";
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
    description: community?.description || "Community details and ecosystem activity on Convoke.",
  };
}

export default async function CommunityPage({ params }: PageProps) {
  const { slug } = await params;
  const community = await getCommunityPageData(slug);

  if (!community) notFound();

  return (
    <>
      <SiteHeader />
      <main className="px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          <section className="overflow-hidden rounded-[8px] border border-line">
            <div className="relative h-64 md:h-96">
              {community.bannerUrl ? (
                <Image src={community.bannerUrl} alt={community.name} fill priority className="object-cover" />
              ) : null}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.88))]" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <p className="text-sm uppercase tracking-[0.24em] text-bronze">{community.type}</p>
                <h1 className="mt-3 text-5xl font-semibold tracking-[-0.05em] md:text-7xl">{community.name}</h1>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-white/78">{community.description}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <JoinCommunityButton communityId={community.id} initialJoined={community.joined} />
                  <div className="w-full sm:w-auto">
                    <SaveButton communityId={community.id} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                {community.stats.map((stat) => (
                  <Panel key={stat.label} className="p-5">
                    <p className="text-xs text-muted">{stat.label}</p>
                    <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
                  </Panel>
                ))}
              </div>

              <Panel className="p-5">
                <div className="flex items-center gap-2 text-2xl font-medium">
                  <Megaphone className="size-5 text-bronze" />
                  Announcements
                </div>
                <div className="mt-5 space-y-3">
                  {community.announcements.length ? (
                    community.announcements.map((announcement) => (
                      <div key={announcement.id} className="rounded-[8px] border border-line bg-black/30 p-4">
                        <p className="font-medium">{announcement.title}</p>
                        <p className="mt-2 text-sm leading-6 text-muted">{announcement.content}</p>
                        <p className="mt-3 text-xs text-bronze">{announcement.publishedAt}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted">No announcements published yet.</p>
                  )}
                </div>
              </Panel>

              <Panel className="p-5">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-2xl font-medium">
                    <TrendingUp className="size-5 text-bronze" />
                    Active events
                  </div>
                  <ButtonLink href="/events" variant="secondary">All events</ButtonLink>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {community.events.length ? (
                    community.events.map((event) => (
                      <Link key={event.id} href={`/events/${event.slug}`}>
                        <Panel className="overflow-hidden p-0 transition hover:border-bronze/50">
                          <div className="relative h-56">
                            <Image src={event.image} alt={event.title} fill className="object-cover" />
                            <div className={`absolute inset-0 bg-gradient-to-t ${event.palette}`} />
                            <div className="absolute inset-x-0 bottom-0 p-4">
                              <p className="text-xs uppercase tracking-wider text-white/75">{event.category}</p>
                              <h3 className="mt-2 text-2xl font-medium">{event.title}</h3>
                              <p className="mt-2 text-sm text-white/75">{event.city} / {event.date}</p>
                            </div>
                          </div>
                        </Panel>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-muted">This community has not published any events yet.</p>
                  )}
                </div>
              </Panel>
            </div>

            <div className="space-y-6">
              <Panel className="p-5">
                <div className="flex items-center gap-2 text-2xl font-medium">
                  <Users className="size-5 text-bronze" />
                  Members
                </div>
                <div className="mt-5 space-y-3">
                  {community.members.length ? (
                    community.members.map((member) => (
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
                    ))
                  ) : (
                    <p className="text-sm text-muted">No public members visible yet.</p>
                  )}
                </div>
              </Panel>

              <Panel className="p-5">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-medium">Open opportunities</h2>
                  <ButtonLink href="/opportunities" variant="secondary">Browse all</ButtonLink>
                </div>
                <div className="space-y-3">
                  {community.opportunities.length ? (
                    community.opportunities.map((opportunity) => (
                      <Link key={opportunity.id} href={`/opportunities/${opportunity.slug}`} className="block rounded-[8px] border border-line bg-black/30 p-4 transition hover:border-bronze/50">
                        <p className="text-xs uppercase tracking-wider text-bronze">{opportunity.type}</p>
                        <h3 className="mt-2 font-medium">{opportunity.title}</h3>
                        <p className="mt-2 text-sm text-muted">{opportunity.location}</p>
                        <p className="mt-3 text-sm leading-6 text-muted">{opportunity.description}</p>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-muted">No active opportunities yet.</p>
                  )}
                </div>
              </Panel>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
