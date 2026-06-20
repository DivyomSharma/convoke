import { Shell } from "@/components/Shell";
import { AmbientGlow } from "@/components/AmbientGlow";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Building2, Users, MapPin, Plus } from "lucide-react";

export const revalidate = 60;

export default async function OrganizationsPage() {
  // Query all organizations from database
  const orgs = await prisma.organization.findMany({
    include: {
      members: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  }).catch(() => []);

  return (
    <Shell>
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-12 relative min-h-screen">
        <AmbientGlow className="top-20 -left-20 w-[600px] h-[600px] opacity-[0.03] dark:opacity-[0.08]" color="var(--brand)" />
        
        <div className="flex items-end justify-between hairline-b pb-6 relative z-10">
          <div>
            <h1 className="serif text-5xl md:text-6xl tracking-tight">Organizations</h1>
            <p className="text-g5 mt-3 text-lg">Discover communities, startups, and college clubs.</p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-ink text-paper px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-ink-2 transition-all active:scale-95 border border-[var(--brand)]/20 shadow-md">
            <Plus size={16} />
            <span>Create Organization</span>
          </button>
        </div>

        {orgs.length === 0 ? (
          <div className="py-32 text-center relative z-10 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center text-g5 mb-6">
              <Building2 size={28} />
            </div>
            <h3 className="serif text-3xl text-ink mb-2">No organizations yet</h3>
            <p className="text-g5 text-[15px] max-w-[40ch] leading-relaxed mb-8">
              Start a builder community, startup hub, or university club to bring people together.
            </p>
            <button className="bg-ink text-paper px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-ink-2 transition-all active:scale-95 border border-[var(--brand)]/20 shadow-md">
              Start a builder community
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 relative z-10">
            {orgs.map((org) => (
              <Link key={org.id} href={`/org/${org.slug}`} className="premium-card p-6 flex flex-col group">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-g1 border border-g3 overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                    {org.logoUrl ? (
                      <img src={org.logoUrl} alt={org.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-g4 bg-g2">
                        <Building2 size={24} />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="serif text-2xl group-hover:text-[var(--brand)] transition-colors">{org.name}</h3>
                    <span className="mono text-[11px] text-g5 uppercase tracking-wider">{org.industry || "Ecosystem Hub"}</span>
                  </div>
                </div>
                <div className="mt-8 flex items-center justify-between text-g5 text-[13px]">
                  <div className="flex items-center gap-1.5">
                    <Users size={14} /> {org.members.length} members
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} /> {org.location || "Remote"}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Shell>
  );
}
