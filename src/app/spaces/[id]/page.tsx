import Link from "next/link";
import { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Building2, CalendarDays, ChevronRight, FileText, Hash, Image as ImageIcon, Trophy, Users } from "lucide-react";
import { Shell } from "@/components/Shell";
import { AmbientGlow } from "@/components/AmbientGlow";
import { prisma } from "@/lib/prisma";
import { getFallbackPhoto } from "@/lib/photos";
import { isChallengeType } from "@/lib/challenge-types";

export const revalidate = 60;

export async function generateMetadata(props: { params?: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const id = params?.id;
  if (!id) return { title: "Space not found" };

  const space = await prisma.space.findUnique({
    where: { id },
  });

  if (!space) return { title: "Space not found" };

  const title = `${space.name} - Space | Convoke`;
  const description = space.description || `${space.name} on Convoke.`;
  const image = space.bannerUrl || "https://convoke.xyz/og-image.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: `https://convoke.xyz/spaces/${id}`,
    },
  };
}

export default async function SpaceDetailPage(props: { params?: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params?.id;
  if (!id) return notFound();

  const space = await prisma.space.findUnique({
    where: { id },
    include: {
      organization: {
        include: {
          members: {
            include: { user: true },
          },
          opportunities: {
            orderBy: { createdAt: "desc" },
            take: 8,
          },
        },
      },
      meets: {
        orderBy: { startTime: "asc" },
        take: 8,
        include: { _count: { select: { attendance: true } } },
      },
    },
  }).catch(() => null);

  if (!space) return notFound();

  const challenges = space.organization.opportunities.filter((opportunity) => isChallengeType(opportunity.type));
  const opportunities = space.organization.opportunities.filter((opportunity) => !isChallengeType(opportunity.type));

  return (
    <Shell wide>
      <div className="relative mx-auto min-h-screen max-w-[1440px] px-5 py-10 sm:px-8">
        <AmbientGlow className="top-10 -left-20 h-[600px] w-[600px] opacity-[0.03] dark:opacity-[0.08]" color="var(--brand)" />
        <AmbientGlow className="bottom-40 right-10 h-[700px] w-[700px] opacity-[0.02] dark:opacity-[0.05]" color="var(--brand)" />

        <div className="grid grid-cols-12 gap-10">
          <aside className="relative z-10 col-span-12 space-y-8 lg:col-span-4">
            <div className="hairline-b pb-6">
              <div className="eyebrow flex items-center gap-2 font-medium text-[var(--brand)]">
                <Hash size={14} />
                <span>Space identity</span>
              </div>
              <h1 className="serif mt-3 text-4xl leading-[1.1]">{space.name}</h1>
              <p className="mt-2 text-[14px] leading-relaxed text-g5">{space.description || "No description provided."}</p>
            </div>

            <div className="premium-card p-5">
              <h3 className="mono mb-3 text-[11px] font-semibold uppercase tracking-wider text-g5">Parent Organization</h3>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-g3 bg-g1">
                  {space.organization.logoUrl ? (
                    <img src={space.organization.logoUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <Building2 size={16} className="text-g4" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link href={`/org/${space.organization.slug}`} className="block truncate text-[14px] font-semibold text-ink transition-colors hover:text-[var(--brand)] hover:underline">
                    {space.organization.name}
                  </Link>
                  <span className="block truncate text-[12px] text-g5">{space.organization.industry || "Builder Hub"}</span>
                </div>
                <ChevronRight size={16} className="text-g4" />
              </div>
            </div>

            {space.rules ? (
              <div className="premium-card p-5">
                <h3 className="mono mb-3 text-[11px] font-semibold uppercase tracking-wider text-g5">Space Rules</h3>
                <p className="whitespace-pre-line rounded-xl border border-g3/40 bg-g1/30 p-4 text-[13px] leading-relaxed text-g6">
                  {space.rules}
                </p>
              </div>
            ) : null}

            <div className="premium-card p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="mono text-[11px] font-semibold uppercase tracking-wider text-g5">Active Members</h3>
                <div className="flex items-center gap-1 text-[12px] font-medium text-g5">
                  <Users size={12} />
                  <span>{space.organization.members.length}</span>
                </div>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {space.organization.members.slice(0, 12).map((member) => (
                  <Link key={member.id} href={`/profile/${member.user.handle || "builder"}`} title={member.user.name || "Member"}>
                    <div className="h-10 w-10 overflow-hidden rounded-xl border border-g3 bg-g1 transition-transform duration-200 hover:scale-105">
                      {member.user.avatarUrl ? (
                        <img src={member.user.avatarUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[12px] font-semibold text-g4">
                          {(member.user.name || "M").slice(0, 1)}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="premium-card relative overflow-hidden border border-[var(--brand)]/20 bg-gradient-to-br from-g1 to-paper p-5">
              <h3 className="mono mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--brand)]">Community Drops</h3>
              <p className="text-[13px] font-medium text-ink">Rep your space</p>
              <p className="mt-1 text-[12px] leading-relaxed text-g5">Official hoodies, member drops, and collective identity wear.</p>
              <a href="https://merch.theplotarmour.xyz" target="_blank" rel="noopener noreferrer" className="relative z-10 mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-1.5 text-[12px] font-medium text-paper transition-colors hover:bg-ink-2">
                View Collection <ChevronRight size={14} />
              </a>
            </div>
          </aside>

          <main className="relative z-10 col-span-12 space-y-8 lg:col-span-8">
            <section className="grid gap-4 md:grid-cols-3">
              <Metric label="Members" value={space.organization.members.length} />
              <Metric label="Meets" value={space.meets.length} />
              <Metric label="Open Calls" value={challenges.length + opportunities.length} />
            </section>

            <section className="grid gap-6 xl:grid-cols-3">
              <div className="premium-card p-6 xl:col-span-2">
                <SectionHeader icon={<CalendarDays size={18} className="text-g5" />} eyebrow="Meets" title="Upcoming gatherings" />
                <EntityList
                  empty="No meets hosted by this space yet."
                  items={space.meets.map((meet) => ({
                    id: meet.id,
                    href: `/meets/${meet.id}`,
                    title: meet.title,
                    meta: `${meet.location || "Online"} - ${meet._count.attendance} attending`,
                    image: meet.bannerUrl || getFallbackPhoto(meet.id, "meet"),
                  }))}
                />
              </div>

              <div className="premium-card p-6">
                <SectionHeader icon={<ImageIcon size={18} className="text-g5" />} eyebrow="Gallery" title="Signals" />
                <div className="grid grid-cols-2 gap-3">
                  {[space.id, `${space.id}-meet`, `${space.id}-members`, `${space.id}-drop`].map((seed) => (
                    <div key={seed} className="aspect-square overflow-hidden rounded-lg border border-g3 bg-g1">
                      <img src={getFallbackPhoto(seed, "space")} alt="" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
              <div className="premium-card p-6">
                <SectionHeader icon={<Trophy size={18} className="text-g5" />} eyebrow="Challenges" title="Builder calls" />
                <EntityList
                  empty="No active challenges attached to this ecosystem yet."
                  items={challenges.map((challenge) => ({
                    id: challenge.id,
                    href: `/challenges/${challenge.id}`,
                    title: challenge.title,
                    meta: `${challenge.type} - ${challenge.location || "Online"}`,
                    image: challenge.bannerUrl || getFallbackPhoto(challenge.id, "opportunity"),
                  }))}
                />
              </div>

              <div className="premium-card p-6">
                <SectionHeader icon={<FileText size={18} className="text-g5" />} eyebrow="Opportunities" title="Open roles" />
                <EntityList
                  empty="No opportunities posted by the parent organization yet."
                  items={opportunities.map((opportunity) => ({
                    id: opportunity.id,
                    href: `/opportunities/${opportunity.id}`,
                    title: opportunity.title,
                    meta: `${opportunity.type} - ${opportunity.location || "Remote"}`,
                    image: opportunity.bannerUrl || getFallbackPhoto(opportunity.id, "opportunity"),
                  }))}
                />
              </div>
            </section>
          </main>
        </div>
      </div>
    </Shell>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-g3 bg-paper-card p-5">
      <div className="text-3xl font-light text-ink">{value}</div>
      <div className="mono mt-2 text-[10px] uppercase tracking-wider text-g5">{label}</div>
    </div>
  );
}

function SectionHeader({ eyebrow, title, icon }: { eyebrow: string; title: string; icon: ReactNode }) {
  return (
    <div className="mb-5 flex items-center justify-between border-b border-g3 pb-4">
      <div>
        <div className="eyebrow text-brand">{eyebrow}</div>
        <h2 className="serif mt-1 text-3xl">{title}</h2>
      </div>
      {icon}
    </div>
  );
}

function EntityList({
  items,
  empty,
}: {
  items: { id: string; href: string; title: string; meta: string; image: string }[];
  empty: string;
}) {
  if (items.length === 0) {
    return <div className="rounded-lg border border-dashed border-g3 p-5 text-[13px] leading-6 text-g5">{empty}</div>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Link key={item.id} href={item.href} className="group grid grid-cols-[56px_1fr_auto] items-center gap-4 rounded-lg border border-g3/70 bg-paper-elevated/50 p-3 transition hover:border-brand/30">
          <img src={item.image} alt="" className="h-14 w-14 rounded-md object-cover" />
          <div className="min-w-0">
            <div className="truncate text-[14px] font-medium text-ink group-hover:text-brand">{item.title}</div>
            <div className="mt-1 truncate text-[12px] text-g5">{item.meta}</div>
          </div>
          <ChevronRight size={16} className="text-g4" />
        </Link>
      ))}
    </div>
  );
}
