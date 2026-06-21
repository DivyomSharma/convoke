import { Shell } from "@/components/Shell";
import { AmbientGlow } from "@/components/AmbientGlow";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Hash, Building2, Users, FileText, ChevronRight } from "lucide-react";
import { SpaceChatClient } from "./SpaceChatClient";
import Link from "next/link";
import { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(props: { params?: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const id = params?.id;
  if (!id) return { title: "Space not found" };

  const space = await prisma.space.findUnique({
    where: { id: id },
  });

  if (!space) return { title: "Space not found" };

  const title = `${space.name} · Space | Convoke`;
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
    where: { id: id },
    include: {
      organization: {
        include: {
          members: {
            include: {
              user: true,
            },
          },
        },
      },
      messages: {
        orderBy: {
          createdAt: "asc",
        },
        include: {
          user: true,
        },
      },
    },
  }).catch(() => null);

  if (!space) {
    return notFound();
  }

  // Format messages to match ChatMessage interface
  const formattedMessages = space.messages.map((msg) => ({
    id: msg.id,
    content: msg.content,
    createdAt: msg.createdAt,
    user: {
      name: msg.user.name,
      handle: msg.user.handle,
      avatarUrl: msg.user.avatarUrl,
    },
  }));

  return (
    <Shell wide>
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 py-10 relative min-h-screen">
        <AmbientGlow className="top-10 -left-20 w-[600px] h-[600px] opacity-[0.03] dark:opacity-[0.08]" color="var(--brand)" />
        <AmbientGlow className="bottom-40 right-10 w-[700px] h-[700px] opacity-[0.02] dark:opacity-[0.05]" color="var(--brand)" />

        <div className="grid grid-cols-12 gap-10">
          {/* LEFT SIDEBAR — Space details */}
          <aside className="col-span-12 lg:col-span-4 space-y-8 relative z-10">
            <div className="hairline-b pb-6">
              <div className="flex items-center gap-2 eyebrow text-[var(--brand)] font-medium">
                <Hash size={14} />
                <span>Space details</span>
              </div>
              <h1 className="serif text-4xl mt-3 leading-[1.1]">{space.name}</h1>
              <p className="text-g5 text-[14px] mt-2 leading-relaxed">{space.description || "No description provided."}</p>
            </div>

            {/* Parent Org Card */}
            <div className="premium-card p-5">
              <h3 className="mono text-[11px] uppercase tracking-wider text-g5 mb-3 font-semibold">Community Org</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-g1 flex items-center justify-center border border-g3 overflow-hidden shrink-0">
                  {space.organization.logoUrl ? (
                    <img src={space.organization.logoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Building2 size={16} className="text-g4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/org/${space.organization.slug}`} className="text-[14px] font-semibold text-ink hover:underline hover:text-[var(--brand)] transition-colors block truncate">
                    {space.organization.name}
                  </Link>
                  <span className="text-[12px] text-g5 block truncate">{space.organization.industry || "Builder Hub"}</span>
                </div>
                <ChevronRight size={16} className="text-g4" />
              </div>
            </div>

            {/* Rules / Description */}
            {space.rules && (
              <div className="premium-card p-5">
                <h3 className="mono text-[11px] uppercase tracking-wider text-g5 mb-3 font-semibold">Space Rules</h3>
                <p className="text-g6 text-[13px] leading-relaxed whitespace-pre-line bg-g1/30 p-4 rounded-xl border border-g3/40">
                  {space.rules}
                </p>
              </div>
            )}

            {/* Members in space */}
            <div className="premium-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="mono text-[11px] uppercase tracking-wider text-g5 font-semibold">Active Members</h3>
                <div className="flex items-center gap-1 text-[12px] text-g5 font-medium">
                  <Users size={12} />
                  <span>{space.organization.members.length}</span>
                </div>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {space.organization.members.slice(0, 12).map((m) => (
                  <Link key={m.id} href={`/profile/${m.user.handle || "builder"}`} title={m.user.name || "Member"}>
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-g1 border border-g3 hover:scale-105 transition-transform duration-200">
                      {m.user.avatarUrl ? (
                        <img src={m.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-g4 text-[12px] font-semibold">
                          {(m.user.name || "M").slice(0, 1)}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT SIDE — Discussion Stream */}
          <main className="col-span-12 lg:col-span-8 relative z-10">
            <SpaceChatClient 
              spaceId={space.id} 
              initialMessages={formattedMessages} 
            />
          </main>
        </div>
      </div>
    </Shell>
  );
}
