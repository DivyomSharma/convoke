import { Shell } from "@/components/Shell";
import { AmbientGlow } from "@/components/AmbientGlow";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Building2, Calendar, FileText, Link2, MapPin, Users, Share, 
  Bookmark, CheckCircle2, ChevronDown, Plus 
} from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(props: { params?: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const slug = params?.slug;
  if (!slug) return { title: "Organization not found" };

  const org = await prisma.organization.findUnique({
    where: { slug: slug },
  });

  if (!org) return { title: "Organization not found" };

  const title = `${org.name} | Convoke`;
  const description = org.description || `${org.name} on Convoke.`;
  const image = org.bannerUrl || org.logoUrl || "https://convoke.xyz/og-image.jpg";

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
      canonical: `https://convoke.xyz/org/${slug}`,
    },
  };
}

export default async function OrgDetailPage(props: { params?: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params?.slug;
  if (!slug) return notFound();

  // Query organization by Slug with all relations
  const org = await prisma.organization.findUnique({
    where: { slug: slug },
    include: {
      members: { include: { user: true } },
      spaces: true,
      opportunities: true,
      faqs: true,
      sponsors: true,
      gallery: true,
      timeline: { orderBy: { date: "desc" } },
      resources: true,
    },
  }).catch(() => null);

  if (!org) {
    return notFound();
  }

  // Count open roles
  const openRolesCount = org.opportunities.filter(o => o.type === "ROLE").length;

  return (
    <Shell wide>
      <div className="relative min-h-screen bg-paper pb-20">
        {/* Ambient background glows for glassmorphism */}
        <AmbientGlow className="top-40 left-1/4 w-[600px] h-[600px] opacity-[0.03] dark:opacity-[0.08]" color="var(--brand)" />
        <AmbientGlow className="bottom-40 right-1/4 w-[700px] h-[700px] opacity-[0.02] dark:opacity-[0.05]" color="var(--brand)" />

        {/* HERO BANNER SECTION */}
        <div className="relative h-[250px] md:h-[350px] w-full overflow-hidden bg-g1">
          {org.bannerUrl ? (
            <img src={org.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-g1 flex items-center justify-center text-g3">
              <Building2 size={64} />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/20 to-transparent" />
        </div>

        {/* PROFILE HEADER OVERLAP */}
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8 relative -mt-24 sm:-mt-32 z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            {/* Identity */}
            <div className="flex items-end gap-5">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl glass-panel p-2 shadow-2xl relative">
                <div className="w-full h-full rounded-md bg-g1 overflow-hidden flex items-center justify-center">
                  {org.logoUrl ? (
                    <img src={org.logoUrl} alt={org.name} className="w-full h-full object-cover" />
                  ) : (
                    <Building2 size={40} className="text-g4" />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 glass-panel p-1 rounded-full shadow-sm">
                  <CheckCircle2 size={24} className="text-[var(--brand)] fill-[var(--brand)]/10" />
                </div>
              </div>

              <div className="pb-2">
                <h1 className="serif text-4xl md:text-5xl tracking-tight leading-none text-ink">{org.name}</h1>
                <div className="flex items-center gap-3 mt-3 text-g5 text-[14px]">
                  <span className="mono uppercase tracking-wider text-[var(--brand)] font-medium">
                    {org.industry || "Ecosystem"}
                  </span>
                  <span>·</span>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} /> {org.location || "Remote"}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pb-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-g3 text-g5 hover:text-ink hover:bg-g1 transition-colors shadow-sm">
                <Share size={16} />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-g3 text-g5 hover:text-ink hover:bg-g1 transition-colors shadow-sm">
                <Bookmark size={16} />
              </button>
              <button className="bg-ink text-paper px-8 py-2.5 rounded-full text-[14px] font-medium hover:bg-ink-2 transition-all active:scale-95 border border-[var(--brand)]/20">
                Join Space
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
            {/* MAIN CONTENT (Left 2 Columns) */}
            <div className="lg:col-span-2 space-y-16">
              
              {/* About Section */}
              <section>
                <h2 className="serif text-3xl mb-4 text-ink">About</h2>
                <div className="text-g6 text-[16px] leading-relaxed whitespace-pre-line">
                  {org.description || "No description available yet for this organization."}
                </div>
              </section>

              {/* Statistical Ribbon */}
              <section className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-g3">
                <div className="text-center md:text-left">
                  <div className="serif text-3xl text-ink">{org.spaces.length}</div>
                  <div className="text-g5 text-[13px] uppercase tracking-wider font-medium mt-1">Spaces</div>
                </div>
                <div className="text-center md:text-left">
                  <div className="serif text-3xl text-ink">{org.members.length}</div>
                  <div className="text-g5 text-[13px] uppercase tracking-wider font-medium mt-1">Members</div>
                </div>
                <div className="text-center md:text-left">
                  <div className="serif text-3xl text-ink">{openRolesCount}</div>
                  <div className="text-g5 text-[13px] uppercase tracking-wider font-medium mt-1">Open Roles</div>
                </div>
                <div className="text-center md:text-left">
                  <div className="serif text-3xl text-ink">{org.views}</div>
                  <div className="text-g5 text-[13px] uppercase tracking-wider font-medium mt-1">Views</div>
                </div>
              </section>

              {/* Gallery Section */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="serif text-3xl text-ink">Gallery</h2>
                </div>
                {org.gallery.length === 0 ? (
                  <div className="py-12 text-center text-g5 italic rounded-md glass-panel text-[14px]">
                    No images posted yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {org.gallery.map((img) => (
                      <div key={img.id} className="aspect-square rounded-md overflow-hidden border border-g3 bg-g1 group">
                        <img src={img.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={img.caption || ""} />
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Timeline Section */}
              <section>
                <h2 className="serif text-3xl mb-6 text-ink">Timeline</h2>
                {org.timeline.length === 0 ? (
                  <div className="py-12 text-center text-g5 italic rounded-md glass-panel text-[14px]">
                    No milestones recorded yet.
                  </div>
                ) : (
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-g3 before:to-transparent">
                    {org.timeline.map((item, i) => (
                      <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-g2 bg-paper text-g4 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -translate-x-2 z-10 group-hover:border-[var(--brand)] transition-colors" />
                        <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] p-5 premium-card ml-8 md:ml-0">
                          <span className="mono text-[11px] font-medium text-[var(--brand)]">
                            {new Date(item.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                          </span>
                          <h4 className="text-[15px] font-semibold text-ink mt-1">{item.title}</h4>
                          <p className="text-[13px] text-g5 mt-1">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* FAQ Section */}
              <section>
                <h2 className="serif text-3xl mb-6 text-ink">Frequently Asked</h2>
                {org.faqs.length === 0 ? (
                  <div className="py-12 text-center text-g5 italic rounded-md glass-panel text-[14px]">
                    No questions answered yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {org.faqs.map((faq) => (
                      <details key={faq.id} className="group premium-card p-5 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
                        <summary className="flex items-center justify-between font-medium text-ink outline-none">
                          {faq.question}
                          <ChevronDown size={18} className="text-g4 group-open:rotate-180 transition-transform" />
                        </summary>
                        <p className="text-g5 mt-3 text-[14px] leading-relaxed pt-3 border-t border-g3">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* SIDEBAR (Right Column) */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <div className="premium-card p-6 space-y-5">
                {org.website && (
                  <div className="flex items-center gap-3 text-[14px] text-g6">
                    <div className="w-8 h-8 rounded-full bg-g1 flex items-center justify-center text-g5">
                      <Link2 size={14} />
                    </div>
                    <a href={org.website} className="hover:text-ink hover:underline truncate" target="_blank" rel="noopener noreferrer">
                      {org.website.replace("https://", "").replace("http://", "")}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-3 text-[14px] text-g6">
                  <div className="w-8 h-8 rounded-full bg-g1 flex items-center justify-center text-g5">
                    <Users size={14} />
                  </div>
                  <span>{org.members.length.toLocaleString()} Members</span>
                </div>
                <div className="flex items-center gap-3 text-[14px] text-g6">
                  <div className="w-8 h-8 rounded-full bg-g1 flex items-center justify-center text-g5">
                    <FileText size={14} />
                  </div>
                  <span>{org.views.toLocaleString()} Views</span>
                </div>
              </div>

              {/* Team Members */}
              <div className="premium-card p-6 space-y-4">
                <h3 className="mono text-[11px] uppercase tracking-wider text-g5 font-medium">Team</h3>
                {org.members.length === 0 ? (
                  <div className="text-[13px] text-g5 italic">No members listed.</div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {org.members.slice(0, 5).map((m) => (
                      <div key={m.id} className="flex items-center gap-3">
                        <Avatar src={m.user.avatarUrl || ""} name={m.user.name || "Member"} size={32} />
                        <div>
                          <div className="text-[14px] font-medium text-ink">{m.user.name}</div>
                          <div className="text-[12px] text-g5">{m.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
