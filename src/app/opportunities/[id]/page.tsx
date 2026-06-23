import { Shell } from "@/components/Shell";
import { AmbientGlow } from "@/components/AmbientGlow";
import { notFound, redirect } from "next/navigation";
import { 
  Building2, MapPin, CircleDollarSign, Calendar, Users, 
  ChevronDown, BookOpen, Heart, FileText, ArrowLeft 
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { ApplyClient } from "./ApplyClient";
import Link from "next/link";
import { Metadata } from "next";
import { isChallengeType } from "@/lib/challenge-types";

export const revalidate = 60;

export async function generateMetadata(props: { params?: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const id = params?.id;
  if (!id) return { title: "Opportunity not found" };

  const opp = await prisma.opportunity.findUnique({
    where: { id: id },
  });

  if (!opp) return { title: "Opportunity not found" };

  const title = `${opp.title} | Convoke Opportunity`;
  const description = opp.description || `Apply for ${opp.title} on Convoke.`;
  const image = opp.bannerUrl || "https://convoke.xyz/og-image.jpg";

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
      canonical: `https://convoke.xyz/opportunities/${id}`,
    },
  };
}

export default async function OpportunityDetailPage(props: { params?: Promise<{ id: string }> }) {
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

  // Redirect hackathons or challenges to their designated challenges page
  if (isChallengeType(opp.type)) {
    redirect(`/challenges/${opp.id}`);
  }

  const dbUser = await requireUser().catch(() => null);
  const initialApplied = dbUser ? opp.applications.some(a => a.userId === dbUser.id) : false;
  const initialBookmarked = dbUser ? (await prisma.bookmark.findFirst({
    where: { userId: dbUser.id, itemId: opp.id, itemType: "OPPORTUNITY" }
  })) !== null : false;

  const deadlineStr = opp.deadline 
    ? new Date(opp.deadline).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "Open Enrollment";

  const logistics = [
    { label: "Department", value: opp.department },
    { label: "Job Type", value: opp.jobType },
    { label: "Employment Type", value: opp.employmentType },
    { label: "Work Style", value: opp.remoteHybrid },
    { label: "Openings", value: opp.openings ? `${opp.openings} positions` : null },
    { label: "Experience Required", value: opp.experience },
  ].filter(l => Boolean(l.value));

  return (
    <Shell wide>
      <div className="relative min-h-screen bg-paper pb-20">
        
        {/* HERO BANNER */}
        <div className="relative h-[200px] md:h-[280px] w-full overflow-hidden bg-g1">
          {opp.bannerUrl ? (
            <img src={opp.bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-80" />
          ) : (
            <div className="w-full h-full bg-g1 flex items-center justify-center">
              <AmbientGlow className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10" color="var(--brand)" />
              <Building2 size={64} className="text-g3" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/50 to-transparent" />
        </div>

        {/* MAIN CONTENT OVERLAP */}
        <div className="mx-auto max-w-[1000px] px-5 sm:px-8 relative -mt-16 z-10">
          
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
                    <span>{opp.location || "Remote"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CircleDollarSign size={18} className="text-g4" />
                    <span>{opp.compensation || "Competitive"}</span>
                  </div>
                </div>
              </div>

              {/* Company manifesto block */}
              <div className="flex items-center justify-between p-5 rounded-md glass-panel">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-sm bg-g1 flex-shrink-0 flex items-center justify-center border border-g3 overflow-hidden">
                    {opp.organization.logoUrl ? (
                      <img src={opp.organization.logoUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Building2 size={16} className="text-g4" />
                    )}
                  </div>
                  <div>
                    <h3 className="serif text-xl text-ink leading-tight">{opp.organization.name}</h3>
                    <p className="text-[13px] text-g5 mt-1 line-clamp-2">{opp.organization.description || "Building future-facing tools."}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <section>
                <h2 className="serif text-2xl mb-4">Role Description</h2>
                <div className="text-g6 text-[16px] leading-relaxed whitespace-pre-line">
                  {opp.description || "No description provided."}
                </div>
              </section>

              {/* Role details table */}
              {logistics.length > 0 && (
                <section>
                  <h2 className="serif text-2xl mb-4">Job Specifications</h2>
                  <div className="rounded-md overflow-hidden glass-panel divide-y divide-g3">
                    {logistics.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 md:p-5 hover:bg-g1/50 transition-colors">
                        <div className="mono text-[13px] font-medium text-g5 uppercase">{item.label}</div>
                        <div className="text-[14px] font-semibold text-ink text-right">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Benefits */}
              {opp.benefits && (
                <section>
                  <h2 className="serif text-2xl mb-4">Perks & Benefits</h2>
                  <div className="text-g6 text-[15px] leading-relaxed whitespace-pre-line p-5 rounded-md glass-panel">
                    {opp.benefits}
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
                
                {/* Apply Panel */}
                <ApplyClient 
                  opportunityId={opp.id} 
                  initialApplied={initialApplied}
                  initialBookmarked={initialBookmarked}
                  deadlineStr={deadlineStr} 
                  type={opp.type}
                />

                {/* Resources */}
                {opp.resources.length > 0 && (
                  <div className="premium-card p-5">
                    <h3 className="mono text-[11px] uppercase tracking-wider text-g5 mb-4 font-medium">Resources</h3>
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
