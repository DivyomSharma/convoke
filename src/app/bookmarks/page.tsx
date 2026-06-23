import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Shell } from "@/components/Shell";
import { Bookmark, Building2, ExternalLink } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isChallengeType } from "@/lib/challenge-types";

export const metadata = {
  title: "Bookmarks | Convoke",
};

export default async function BookmarksPage() {
  const user = await requireUser();
  if (!user) {
    return notFound();
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const opportunityIds = bookmarks.filter(b => b.itemType === "OPPORTUNITY").map(b => b.itemId);
  const orgIds = bookmarks.filter(b => b.itemType === "ORGANIZATION").map(b => b.itemId);

  const [opportunities, orgs] = await Promise.all([
    prisma.opportunity.findMany({
      where: { id: { in: opportunityIds } },
      include: { organization: true },
    }),
    prisma.organization.findMany({
      where: { id: { in: orgIds } },
    })
  ]);

  return (
    <Shell wide>
      <div className="min-h-screen bg-paper pb-20 pt-32">
        <div className="max-w-[1000px] mx-auto px-5 sm:px-8">
          
          <div className="mb-12">
            <h1 className="serif text-4xl text-ink">Saved Items</h1>
            <p className="text-g5 mt-2">Your bookmarked opportunities and watched organizations.</p>
          </div>

          <div className="space-y-12">
            
            {/* OPPORTUNITIES */}
            <section>
              <h2 className="text-[14px] uppercase tracking-widest text-g5 font-semibold mb-6 flex items-center gap-2">
                <Bookmark size={14} className="text-[var(--brand)]" /> Opportunities
              </h2>
              
              {opportunities.length === 0 ? (
                <div className="p-8 border border-g3 border-dashed rounded-2xl flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-g1 flex items-center justify-center text-g4 mb-3">
                    <Bookmark size={20} />
                  </div>
                  <div className="text-ink font-medium">No saved opportunities</div>
                  <div className="text-g5 text-[14px] mt-1">Opportunities you bookmark will appear here.</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {opportunities.map(opp => (
                    <Link key={opp.id} href={`/${isChallengeType(opp.type) ? "challenges" : "opportunities"}/${opp.id}`} className="premium-card p-5 group hover:border-[var(--brand)]/30 transition-colors">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-g1 overflow-hidden flex items-center justify-center shrink-0">
                            {opp.organization?.logoUrl ? (
                              <img src={opp.organization.logoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Building2 size={16} className="text-g4" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-ink group-hover:text-[var(--brand)] transition-colors">{opp.title}</div>
                            <div className="text-[13px] text-g5">{opp.organization?.name || "Community"}</div>
                          </div>
                        </div>
                        <ExternalLink size={14} className="text-g4 group-hover:text-[var(--brand)] transition-colors" />
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[12px]">
                        <span className="px-2.5 py-1 rounded-md bg-g1 text-g6 font-medium">{opp.type}</span>
                        {opp.location && <span className="px-2.5 py-1 rounded-md bg-g1 text-g6">{opp.location}</span>}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* ORGANIZATIONS */}
            <section>
              <h2 className="text-[14px] uppercase tracking-widest text-g5 font-semibold mb-6 flex items-center gap-2">
                <Building2 size={14} className="text-[var(--brand)]" /> Organizations
              </h2>
              
              {orgs.length === 0 ? (
                <div className="p-8 border border-g3 border-dashed rounded-2xl flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 rounded-full bg-g1 flex items-center justify-center text-g4 mb-3">
                    <Building2 size={20} />
                  </div>
                  <div className="text-ink font-medium">No watched organizations</div>
                  <div className="text-g5 text-[14px] mt-1">Organizations you follow will appear here.</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {orgs.map(org => (
                    <Link key={org.id} href={`/org/${org.slug}`} className="premium-card p-5 group flex flex-col items-center text-center hover:border-[var(--brand)]/30 transition-colors">
                      <div className="w-16 h-16 rounded-2xl bg-g1 overflow-hidden flex items-center justify-center mb-3">
                        {org.logoUrl ? (
                          <img src={org.logoUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Building2 size={24} className="text-g4" />
                        )}
                      </div>
                      <div className="font-medium text-ink group-hover:text-[var(--brand)] transition-colors">{org.name}</div>
                      <div className="text-[13px] text-g5 mt-1 line-clamp-2">{org.description || "Building the future."}</div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

          </div>
        </div>
      </div>
    </Shell>
  );
}
