import { Shell } from "@/components/Shell";
import { AmbientGlow } from "@/components/AmbientGlow";
import Link from "next/link";
import { Code, MapPin, Trophy, Users, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function ChallengesPage() {
  const challenges = await prisma.opportunity.findMany({
    where: {
      type: {
        in: ["HACKATHON", "CHALLENGE"],
      },
    },
    include: {
      organization: true,
      applications: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  }).catch(() => []);

  return (
    <Shell>
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-12 relative min-h-screen">
        <AmbientGlow className="top-20 -left-40 w-[800px] h-[800px] opacity-[0.03] dark:opacity-[0.08]" color="var(--brand)" />
        
        <div className="flex items-end justify-between hairline-b pb-6 relative z-10">
          <div>
            <h1 className="serif text-5xl md:text-6xl tracking-tight">Challenges</h1>
            <p className="text-g5 mt-3 text-lg">Build the future. Win prizes. Push your limits.</p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-ink text-paper px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-ink-2 transition-all active:scale-95 border border-[var(--brand)]/20 shadow-md">
            <Plus size={16} />
            <span>Host a Challenge</span>
          </button>
        </div>

        {challenges.length === 0 ? (
          <div className="py-32 text-center relative z-10 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center text-g5 mb-6">
              <Trophy size={28} className="text-[var(--brand)]" />
            </div>
            <h3 className="serif text-3xl text-ink mb-2">No challenges open</h3>
            <p className="text-g5 text-[15px] max-w-[40ch] leading-relaxed mb-8">
              Host a challenge to gather campus builders.
            </p>
            <button className="bg-ink text-paper px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-ink-2 transition-all active:scale-95 border border-[var(--brand)]/20 shadow-md">
              Host Challenge
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 relative z-10">
            {challenges.map((challenge) => (
              <Link key={challenge.id} href={`/challenges/${challenge.id}`} className="premium-card overflow-hidden group flex flex-col">
                <div className="h-32 relative overflow-hidden bg-gradient-to-br from-g2 to-g1 flex items-center justify-center border-b border-g3">
                  {challenge.bannerUrl ? (
                    <img src={challenge.bannerUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : challenge.organization.logoUrl ? (
                    <div className="w-16 h-16 rounded-2xl overflow-hidden border border-g3/80 shadow-md">
                      <img src={challenge.organization.logoUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <Code size={40} className="text-g3 group-hover:scale-110 transition-transform duration-500" />
                  )}
                  <div className="absolute top-4 right-4 bg-paper text-[var(--brand)] border border-[var(--brand)]/20 px-3 py-1 rounded-full text-[11px] font-medium uppercase tracking-wide shadow-sm">
                    {challenge.type}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="serif text-2xl group-hover:text-[var(--brand)] transition-colors">{challenge.title}</h3>
                  <p className="text-g5 text-[14px] mt-1">by {challenge.organization.name}</p>
                  
                  <div className="mt-6 flex-1 flex flex-col justify-end gap-3 text-[13px] text-g6">
                    <div className="flex items-center gap-2">
                      <Trophy size={14} className="text-[var(--brand)]" /> 
                      <span className="font-medium text-ink">{challenge.compensation || "Awards & Prizes"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-g4" /> 
                      {challenge.applications.length} builders registered
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-g4" /> 
                      {challenge.location || "Online"} · {challenge.deadline ? new Date(challenge.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Ongoing"}
                    </div>
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
