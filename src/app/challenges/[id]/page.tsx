import { Shell } from "@/components/Shell";
import { AmbientGlow } from "@/components/AmbientGlow";
import { notFound, redirect } from "next/navigation";
import { 
  Trophy, Calendar, Users, MapPin, Building2, ChevronDown, 
  BookOpen, Star, FileText, Layout, Info 
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { RegisterClient } from "./RegisterClient";
import Link from "next/link";
import { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata(props: { params?: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const id = params?.id;
  if (!id) return { title: "Challenge not found" };

  const opp = await prisma.opportunity.findUnique({
    where: { id: id },
  });

  if (!opp) return { title: "Challenge not found" };

  const title = `${opp.title} | Convoke Challenge`;
  const description = opp.description || `${opp.title} on Convoke.`;
  const image = opp.bannerUrl || "https://convoke.xyz/og-challenge.jpg";

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
      canonical: `https://convoke.xyz/challenges/${id}`,
    },
  };
}

export default async function ChallengeDetailPage(props: { params?: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params?.id;
  if (!id) return notFound();

  const opp = await prisma.opportunity.findUnique({
    where: { id: id },
    include: {
      organization: true,
      applications: true,
      faqs: true,
      resources: true,
    },
  }).catch(() => null);

  if (!opp) {
    return notFound();
  }

  // Redirect standard job roles to opportunities
  if (opp.type !== "HACKATHON" && opp.type !== "CHALLENGE") {
    redirect(`/opportunities/${opp.id}`);
  }

  const dbUser = await requireUser().catch(() => null);
  const initialRegistered = dbUser ? opp.applications.some(a => a.userId === dbUser.id) : false;
  const initialBookmarked = dbUser ? (await prisma.bookmark.findFirst({
    where: { userId: dbUser.id, itemId: opp.id, itemType: "OPPORTUNITY" }
  })) !== null : false;

  const deadlineStr = opp.deadline 
    ? new Date(opp.deadline).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "Open Enrollment";

  return (
    <Shell wide>
      <div className="relative min-h-screen bg-paper pb-20">
        
        {/* HERO BANNER */}
        <div className="relative h-[220px] md:h-[300px] w-full overflow-hidden bg-g1">
          {opp.bannerUrl ? (
            <img src={opp.bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-80" />
          ) : (
            <div className="w-full h-full bg-g1 flex items-center justify-center">
              <AmbientGlow className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10" color="var(--brand)" />
              <Trophy size={64} className="text-g3" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/50 to-transparent" />
        </div>

        {/* MAIN CONTENT OVERLAP */}
        <div className="mx-auto max-w-[1000px] px-5 sm:px-8 relative -mt-20 z-10">
          
          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* LEFT COLUMN */}
            <div className="flex-1 space-y-12">
              
              {/* Header Info */}
              <div>
                <div className="inline-block mono text-[11px] font-medium uppercase tracking-wider bg-[var(--brand)]/10 text-[var(--brand)] px-3 py-1 rounded-full mb-4">
                  {opp.type}
                </div>
                <h1 className="serif text-4xl md:text-5xl tracking-tight leading-[1.1] mb-6">{opp.title}</h1>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-[15px] text-g6">
                  <div className="flex items-center gap-2">
                    <Building2 size={18} className="text-[var(--brand)]" />
                    <Link href={`/org/${opp.organization.slug}`} className="font-medium text-ink hover:underline">
                      {opp.organization.name}
                    </Link>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-g4" />
                    <span>{opp.location || "Online"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy size={18} className="text-[var(--brand)]" />
                    <span className="font-medium text-ink">{opp.compensation || "Awards & Prizes"}</span>
                  </div>
                </div>
              </div>

              {/* Organizer panel */}
              <div className="flex items-center justify-between p-4 rounded-md glass-panel">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-sm bg-g1 flex-shrink-0 flex items-center justify-center border border-g3 overflow-hidden">
                    {opp.organization.logoUrl ? (
                      <img src={opp.organization.logoUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Building2 size={16} className="text-g4" />
                    )}
                  </div>
                  <div>
                    <div className="text-[12px] text-g5 uppercase tracking-wider font-medium">Organized By</div>
                    <div className="text-[15px] font-semibold text-ink">{opp.organization.name}</div>
                  </div>
                </div>
                <Link href={`/org/${opp.organization.slug}`} className="text-[13px] font-medium px-4 py-1.5 rounded-full border border-g3 hover:bg-g2 transition-colors">
                  View Org
                </Link>
              </div>

              {/* Description */}
              <section>
                <h2 className="serif text-2xl mb-4">About Challenge</h2>
                <div className="text-g6 text-[16px] leading-relaxed whitespace-pre-line">
                  {opp.description || "No challenge description provided."}
                </div>
              </section>

              {/* Prizes / Tracks section */}
              {opp.benefits && (
                <section>
                  <h2 className="serif text-2xl mb-4">Prizes & Tracks</h2>
                  <div className="text-g6 text-[15px] leading-relaxed whitespace-pre-line p-5 rounded-md glass-panel border border-[var(--brand)]/10">
                    {opp.benefits}
                  </div>
                  
                  {/* Contextual Commerce */}
                  <div className="mt-4 flex items-center justify-between p-4 rounded-md bg-g1/50 border border-g3/50">
                    <div>
                      <div className="text-[14px] font-medium text-ink">Level up the experience</div>
                      <div className="text-[13px] text-g5 mt-0.5">Winner Merchandise • Sponsor Gifts • Participant Kits</div>
                    </div>
                    <a href="https://merch.theplotarmour.xyz" target="_blank" rel="noopener noreferrer" className="px-4 py-2 text-[12px] font-medium bg-paper border border-g3 rounded-full hover:bg-g2 transition-colors text-ink">
                      Order Swag
                    </a>
                  </div>
                </section>
              )}

              {/* FAQs */}
              {opp.faqs.length > 0 && (
                <section>
                  <h2 className="serif text-2xl mb-4">Frequently Asked</h2>
                  <div className="space-y-3">
                    {opp.faqs.map((faq) => (
                      <details key={faq.id} className="group rounded-sm p-4 [&_summary::-webkit-details-marker]:hidden cursor-pointer glass-panel">
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

            {/* RIGHT COLUMN */}
            <div className="lg:w-[320px] shrink-0">
              <div className="sticky top-20 space-y-6">
                
                {/* Registration Panel */}
                <RegisterClient 
                  challengeId={opp.id}
                  initialRegistered={initialRegistered}
                  initialBookmarked={initialBookmarked}
                  deadlineStr={deadlineStr}
                />

                {/* Challenge Stats */}
                <div className="premium-card p-5 space-y-4">
                  <h3 className="mono text-[11px] uppercase tracking-wider text-g5 font-medium">Challenge Stats</h3>
                  <div className="flex items-center justify-between text-[14px] text-g6">
                    <div className="flex items-center gap-2"><Users size={16} className="text-g4" /> Registered</div>
                    <span className="font-semibold text-ink">{opp.applications.length} builders</span>
                  </div>
                </div>

                {/* Resources */}
                {opp.resources.length > 0 && (
                  <div className="premium-card p-5">
                    <h3 className="mono text-[11px] uppercase tracking-wider text-g5 mb-4 font-medium">Resources & Rules</h3>
                    <div className="flex flex-col gap-2">
                      {opp.resources.map(res => (
                        <a 
                          key={res.id} 
                          href={res.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="flex items-center gap-2 text-[13px] text-g6 hover:text-[var(--brand)] transition-colors"
                        >
                          <FileText size={14} className="text-g4" />
                          <span className="truncate">{res.name}</span>
                        </a>
                      ))}
                    </div>
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
