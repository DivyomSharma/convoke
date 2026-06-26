import { Shell } from "@/components/Shell";
import { PublishStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AmbientGlow } from "@/components/AmbientGlow";
import { Building2, ArrowRight } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Sponsor Directory | Convoke",
  description: "Discover organizations ready to sponsor your next meet or challenge.",
};

export default async function SponsorsPage(props: { searchParams?: Promise<{ industry?: string }> }) {
  const searchParams = await props.searchParams;
  const industry = searchParams?.industry;

  const sponsors = await prisma.organization.findMany({
    where: {
      status: PublishStatus.PUBLISHED,
      isSponsorshipEnabled: true,
      ...(industry ? { industry } : {})
    },
    orderBy: { views: "desc" },
    take: 50
  });

  const industries = ["Tech", "AI", "Startup", "College", "Fintech", "Web3"];

  return (
    <Shell wide>
      <AmbientGlow />
      <div className="pt-[100px] px-5 sm:px-8 max-w-[1240px] mx-auto pb-20">
        <div className="mb-12 max-w-2xl">
          <h1 className="serif text-5xl leading-[1.1] mb-4 text-ink">Sponsor Directory</h1>
          <p className="text-lg text-g5">
            Discover organizations looking to invest in builder ecosystems. Find the perfect sponsor for your next hackathon or meetup.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <Link href="/sponsors" className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${!industry ? "bg-ink text-paper" : "bg-g2 text-ink hover:bg-g3"}`}>
            All
          </Link>
          {industries.map((ind) => (
            <Link key={ind} href={`/sponsors?industry=${ind}`} className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-colors ${industry === ind ? "bg-ink text-paper" : "bg-g2 text-ink hover:bg-g3"}`}>
              {ind}
            </Link>
          ))}
        </div>

        {sponsors.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-g3 rounded-xl bg-g1/20">
            <Building2 size={32} className="mx-auto text-g4 mb-3" />
            <p className="text-ink font-medium">No sponsors found.</p>
            <p className="text-g5 text-[14px]">There are currently no verified sponsors matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sponsors.map((sponsor) => (
              <div key={sponsor.id} className="premium-card p-6 flex flex-col group">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-g2 border border-g3 flex items-center justify-center overflow-hidden">
                    {sponsor.logoUrl ? (
                      <Image src={sponsor.logoUrl} alt={sponsor.name} width={48} height={48} className="object-cover" />
                    ) : (
                      <span className="text-xl font-bold text-g5">{sponsor.name[0]}</span>
                    )}
                  </div>
                  <span className="px-2 py-1 bg-[var(--brand)]/10 text-[var(--brand)] rounded text-[11px] font-bold uppercase tracking-wider">
                    {sponsor.sponsorBudgetRange || "Flexible"}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-ink mb-2">{sponsor.name}</h3>
                <p className="text-[14px] text-g5 leading-relaxed flex-grow line-clamp-3 mb-6">
                  {sponsor.description || "No description provided."}
                </p>
                
                <div className="flex items-center justify-between border-t border-g3 pt-4 mt-auto">
                  <div className="text-[12px] font-medium text-g5">
                    Prefers: {sponsor.sponsorAudience || "Any Audience"}
                  </div>
                  <Link href={`/org/${sponsor.slug}`} className="text-[13px] font-bold text-ink flex items-center gap-1 group-hover:text-[var(--brand)] transition-colors">
                    View <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Shell>
  );
}