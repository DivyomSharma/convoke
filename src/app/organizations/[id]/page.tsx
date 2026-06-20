import { Shell } from "@/components/Shell";
import { AmbientGlow } from "@/components/AmbientGlow";
import Link from "next/link";
import { Building2, Calendar, FileText, Link2, MapPin, Users, Share, Bookmark, Flag, ChevronDown, CheckCircle2 } from "lucide-react";
import { Avatar } from "@/components/Avatar";

export default function OrganizationDetailPage({ params }: { params: { id: string } }) {
  // Mock Organization Data representing a "First-Class Microsite"
  const org = {
    id: params.id,
    name: "OpenAI Labs",
    slug: "openai-labs",
    industry: "Artificial Intelligence",
    location: "San Francisco, CA",
    website: "https://openai.com",
    membersCount: 890,
    views: 12500,
    logoUrl: "https://api.dicebear.com/9.x/shapes/svg?seed=o",
    bannerUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop",
    verified: true,
    about: `We are a research organization dedicated to ensuring that artificial general intelligence benefits all of humanity. 
    
Our research focuses on deep learning, reinforcement learning, and large-scale language models. Join our community to discuss the latest papers, participate in hackathons, and shape the future of AI.`,
    stats: [
      { label: "Spaces", value: "12" },
      { label: "Events", value: "45" },
      { label: "Open Roles", value: "8" },
      { label: "Research", value: "124" },
    ],
    gallery: [
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531297172867-4d1cc0d09c2a?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop"
    ],
    timeline: [
      { date: "Oct 2026", title: "GPT-6 Announcement", desc: "Revealed our next generation multimodal architecture." },
      { date: "Jun 2026", title: "Global Developer Conference", desc: "Hosted 5,000 developers in San Francisco." },
      { date: "Jan 2026", title: "Convoke Partnership", desc: "Launched our official ecosystem on Convoke." }
    ],
    faqs: [
      { q: "How do I apply for a role?", a: "Check the Opportunities tab below and submit your portfolio directly through Convoke." },
      { q: "Are the research spaces public?", a: "Yes, our core community spaces are open. Specific incubation spaces require an application." }
    ],
    admins: [
      { name: "Sam Altman", handle: "sama" },
      { name: "Ilya Sutskever", handle: "ilya" }
    ]
  };

  return (
    <Shell wide>
      <div className="relative min-h-screen bg-paper pb-20">
        
        {/* HERO BANNER SECTION */}
        <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden bg-g1">
          {org.bannerUrl ? (
            <img src={org.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
          ) : (
            <AmbientGlow className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10" color="var(--brand)" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/20 to-transparent" />
        </div>

        {/* PROFILE HEADER OVERLAP */}
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8 relative -mt-24 sm:-mt-32 z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            
            {/* Identity */}
            <div className="flex items-end gap-5">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl glass-panel p-2 shadow-2xl relative">
                <div className="w-full h-full rounded-2xl bg-g1 overflow-hidden">
                  {org.logoUrl && <img src={org.logoUrl} alt={org.name} className="w-full h-full object-cover" />}
                </div>
                {org.verified && (
                  <div className="absolute -bottom-2 -right-2 glass-panel p-1 rounded-full shadow-sm">
                    <CheckCircle2 size={28} className="text-[var(--brand)] fill-[var(--brand)]/10" />
                  </div>
                )}
              </div>
              
              <div className="pb-2">
                <h1 className="serif text-4xl md:text-5xl tracking-tight leading-none">{org.name}</h1>
                <div className="flex items-center gap-3 mt-3 text-g5 text-[14px]">
                  <span className="mono uppercase tracking-wider text-[var(--brand)] font-medium">{org.industry}</span>
                  <span>·</span>
                  <div className="flex items-center gap-1.5"><MapPin size={14} /> {org.location}</div>
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
              <button className="bg-ink text-paper px-8 py-2.5 rounded-full text-[14px] font-medium hover:bg-ink-2 transition-colors shadow-lg">
                Join Organization
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-12">
            
            {/* MAIN CONTENT (Left 2 Columns) */}
            <div className="lg:col-span-2 space-y-16">
              
              {/* About Section */}
              <section>
                <h2 className="serif text-3xl mb-4">About</h2>
                <div className="text-g6 text-[16px] leading-relaxed whitespace-pre-line">
                  {org.about}
                </div>
              </section>

              {/* Statistical Ribbon */}
              <section className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-g3">
                {org.stats.map(stat => (
                  <div key={stat.label} className="text-center md:text-left">
                    <div className="serif text-3xl text-ink">{stat.value}</div>
                    <div className="text-g5 text-[13px] uppercase tracking-wider font-medium mt-1">{stat.label}</div>
                  </div>
                ))}
              </section>

              {/* Gallery Section */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="serif text-3xl">Gallery</h2>
                  <button className="text-[13px] font-medium text-g5 hover:text-ink">View All</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {org.gallery.map((img, i) => (
                    <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-g3 bg-g1 group">
                      <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </section>

              {/* Timeline Section */}
              <section>
                <h2 className="serif text-3xl mb-6">Timeline</h2>
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-g3 before:to-transparent">
                  {org.timeline.map((item, i) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      {/* Marker */}
                      <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-g2 bg-paper text-g4 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -translate-x-2 z-10 group-hover:border-[var(--brand)] transition-colors" />
                      {/* Card */}
                      <div className="w-[calc(100%-2rem)] md:w-[calc(50%-2rem)] p-4 premium-card ml-8 md:ml-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="mono text-[11px] font-medium text-[var(--brand)]">{item.date}</span>
                        </div>
                        <h4 className="text-[15px] font-semibold text-ink">{item.title}</h4>
                        <p className="text-[13px] text-g5 mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQ Section */}
              <section>
                <h2 className="serif text-3xl mb-6">Frequently Asked</h2>
                <div className="space-y-3">
                  {org.faqs.map((faq, i) => (
                    <details key={i} className="group premium-card p-5 [&_summary::-webkit-details-marker]:hidden cursor-pointer">
                      <summary className="flex items-center justify-between font-medium text-ink outline-none">
                        {faq.q}
                        <ChevronDown size={18} className="text-g4 group-open:rotate-180 transition-transform" />
                      </summary>
                      <p className="text-g5 mt-3 text-[14px] leading-relaxed pt-3 hairline-t">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </section>

            </div>

            {/* SIDEBAR (Right Column) */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <div className="premium-card p-6 space-y-5">
                <div className="flex items-center gap-3 text-[14px] text-g6">
                  <div className="w-8 h-8 rounded-full bg-g1 flex items-center justify-center text-g5"><Link2 size={14} /></div>
                  <a href={org.website} className="hover:text-ink hover:underline truncate">{org.website.replace('https://', '')}</a>
                </div>
                <div className="flex items-center gap-3 text-[14px] text-g6">
                  <div className="w-8 h-8 rounded-full bg-g1 flex items-center justify-center text-g5"><Users size={14} /></div>
                  <span>{org.membersCount.toLocaleString()} Members</span>
                </div>
                <div className="flex items-center gap-3 text-[14px] text-g6">
                  <div className="w-8 h-8 rounded-full bg-g1 flex items-center justify-center text-g5"><FileText size={14} /></div>
                  <span>{org.views.toLocaleString()} Views</span>
                </div>
              </div>

              {/* Team / Admins */}
              <div className="premium-card p-6">
                <h3 className="serif text-xl mb-4">Core Team</h3>
                <div className="space-y-4">
                  {org.admins.map((admin, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Avatar src="" name={admin.name} size={36} />
                      <div>
                        <div className="text-[14px] font-medium text-ink">{admin.name}</div>
                        <div className="text-[12px] text-g5">@{admin.handle}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reporting */}
              <div className="pt-4 flex justify-center">
                <button className="flex items-center gap-2 text-[12px] text-g4 hover:text-red-500 transition-colors uppercase tracking-widest font-medium">
                  <Flag size={12} /> Report Organization
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
