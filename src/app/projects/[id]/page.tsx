import { Shell } from "@/components/Shell";
import { AmbientGlow } from "@/components/AmbientGlow";
import { notFound } from "next/navigation";
import { 
  Eye, Download, Share2, Globe, Layers, Calendar, 
  MessageSquare, ChevronDown, Sparkles, User, Link2 
} from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(props: { params?: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const id = params?.id;
  if (!id) return { title: "Project not found" };

  const proj = await prisma.project.findUnique({
    where: { id: id },
  });

  if (!proj) return { title: "Project not found" };

  const title = `${proj.title} | Convoke Project`;
  const description = proj.description || `Explore ${proj.title} on Convoke.`;
  const image = proj.bannerUrl || "https://convoke.xyz/og-image.jpg";

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
      canonical: `https://convoke.xyz/projects/${id}`,
    },
  };
}

export default async function ProjectDetailPage(props: { params?: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params?.id;
  if (!id) return notFound();

  const proj = await prisma.project.findUnique({
    where: { id: id },
    include: {
      user: true,
      faqs: true,
      gallery: true,
      timeline: { orderBy: { date: "desc" } },
      resources: true,
    },
  }).catch(() => null);

  if (!proj) {
    return notFound();
  }

  // Parse stack tags
  const stack = proj.stack ? proj.stack.split(",").map(s => s.trim()).filter(Boolean) : [];

  return (
    <Shell wide>
      <div className="relative min-h-screen bg-paper pb-20">
        <AmbientGlow className="top-40 left-1/4 w-[600px] h-[600px] opacity-[0.03] dark:opacity-[0.08]" color="var(--brand)" />
        <AmbientGlow className="bottom-40 right-1/4 w-[700px] h-[700px] opacity-[0.02] dark:opacity-[0.05]" color="var(--brand)" />

        {/* HERO BANNER SECTION */}
        <div className="relative h-[250px] md:h-[350px] w-full overflow-hidden bg-g1">
          {proj.bannerUrl ? (
            <img src={proj.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-g1 flex items-center justify-center text-g3">
              <Layers size={64} className="text-g3/80" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/20 to-transparent" />
        </div>

        {/* PROJECT HEADER OVERLAP */}
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8 relative -mt-24 sm:-mt-32 z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            {/* Identity */}
            <div className="flex items-end gap-5">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl glass-panel p-2 shadow-2xl relative">
                <div className="w-full h-full rounded-md bg-g1 overflow-hidden flex items-center justify-center text-[var(--brand)] font-semibold text-2xl uppercase">
                  {proj.title.slice(0, 2)}
                </div>
              </div>

              <div className="pb-2">
                <h1 className="serif text-4xl md:text-5xl tracking-tight leading-none text-ink">{proj.title}</h1>
                <div className="flex items-center gap-3 mt-3 text-g5 text-[14px]">
                  <span className="mono uppercase tracking-wider text-[var(--brand)] font-medium">Project</span>
                  <span>·</span>
                  <div className="flex items-center gap-1.5">
                    <User size={14} /> Shipped by {proj.user.name || "Builder"}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pb-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-g3 text-g5 hover:text-ink hover:bg-g1 transition-colors shadow-sm">
                <Share2 size={16} />
              </button>
              {proj.url && (
                <a 
                  href={proj.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="bg-ink text-paper px-8 py-2.5 rounded-full text-[14px] font-medium hover:bg-ink-2 transition-all active:scale-95 border border-[var(--brand)]/20 flex items-center gap-1.5"
                >
                  <Globe size={14} />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
            {/* MAIN CONTENT */}
            <div className="lg:col-span-2 space-y-16">
              
              {/* About Section */}
              <section>
                <h2 className="serif text-3xl mb-4 text-ink">About</h2>
                <div className="text-g6 text-[16px] leading-relaxed whitespace-pre-line">
                  {proj.description || "No description provided."}
                </div>
              </section>

              {/* Technologies / Stack */}
              {stack.length > 0 && (
                <section>
                  <h2 className="serif text-2xl mb-4 text-ink font-medium">Stack</h2>
                  <div className="flex flex-wrap gap-2">
                    {stack.map((s) => (
                      <span key={s} className="mono text-[12px] font-semibold bg-g1 border border-g3 text-ink px-3 py-1.5 rounded-lg uppercase tracking-wider shadow-sm">
                        {s}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {/* Timeline / Milestones */}
              {proj.timeline.length > 0 && (
                <section>
                  <h2 className="serif text-3xl mb-6 text-ink">Timeline</h2>
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-g3 before:to-transparent">
                    {proj.timeline.map((item) => (
                      <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
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
                </section>
              )}

              {/* Gallery */}
              {proj.gallery.length > 0 && (
                <section>
                  <h2 className="serif text-3xl mb-6 text-ink">Gallery</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {proj.gallery.map((img) => (
                      <div key={img.id} className="aspect-video rounded-md overflow-hidden border border-g3 bg-g1 group">
                        <img src={img.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={img.caption || ""} />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* FAQs */}
              {proj.faqs.length > 0 && (
                <section>
                  <h2 className="serif text-3xl mb-6 text-ink">FAQ</h2>
                  <div className="space-y-3">
                    {proj.faqs.map((faq) => (
                      <details key={faq.id} className="group premium-card p-5 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
                        <summary className="flex items-center justify-between font-medium text-ink outline-none">
                          {faq.question}
                          <ChevronDown size={18} className="text-g4 group-open:rotate-180 transition-transform" />
                        </summary>
                        <p className="text-g5 mt-3 text-[14px] leading-relaxed pt-3 border-t border-g3">{faq.answer}</p>
                      </details>
                    ))}
                  </div>
                </section>
              )}

            </div>

            {/* SIDEBAR */}
            <div className="space-y-6">
              {/* Creator Card */}
              <div className="premium-card p-6 text-center flex flex-col items-center">
                <Avatar src={proj.user.avatarUrl || ""} name={proj.user.name || "Builder"} size={80} />
                <h3 className="serif text-2xl mt-4 text-ink">{proj.user.name || "Builder"}</h3>
                <span className="text-g5 text-[13px]">@{proj.user.handle || "builder"}</span>
                <p className="text-g5 text-[14px] mt-2 max-w-[24ch]">{proj.user.role || "Creator"}</p>
                <Link 
                  href={`/profile/${proj.user.handle || "builder"}`}
                  className="mt-6 w-full py-2 border border-g3 hover:bg-g1 text-[13px] font-medium rounded-full text-ink transition-colors block text-center"
                >
                  View Profile
                </Link>
              </div>

              {/* Stats Card */}
              <div className="premium-card p-6 space-y-4">
                <h3 className="mono text-[11px] uppercase tracking-wider text-g5 font-medium">Project Statistics</h3>
                <div className="flex items-center justify-between text-[14px] text-g6">
                  <div className="flex items-center gap-2"><Eye size={16} className="text-g4" /> Views</div>
                  <span className="font-semibold text-ink">{proj.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-[14px] text-g6">
                  <div className="flex items-center gap-2"><Download size={16} className="text-g4" /> Downloads</div>
                  <span className="font-semibold text-ink">{proj.downloads.toLocaleString()}</span>
                </div>
              </div>

              {/* Links Card */}
              <div className="premium-card p-6 space-y-4">
                <h3 className="mono text-[11px] uppercase tracking-wider text-g5 font-medium">Resources & Links</h3>
                {proj.githubUrl && (
                  <a href={proj.githubUrl} className="flex items-center gap-3 text-[14px] text-g6 hover:text-ink transition-colors" target="_blank" rel="noopener noreferrer">
                    <Link2 size={16} className="text-g4" /> GitHub Repository
                  </a>
                )}
                {proj.figmaUrl && (
                  <a href={proj.figmaUrl} className="flex items-center gap-3 text-[14px] text-g6 hover:text-ink transition-colors" target="_blank" rel="noopener noreferrer">
                    <Link2 size={16} className="text-g4" /> Figma File
                  </a>
                )}
                {proj.resources.map(res => (
                  <a key={res.id} href={res.url} className="flex items-center gap-3 text-[14px] text-g6 hover:text-ink transition-colors" target="_blank" rel="noopener noreferrer">
                    <Link2 size={16} className="text-g4" /> {res.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
