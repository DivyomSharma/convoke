import { Shell } from "@/components/Shell";
import { AmbientGlow } from "@/components/AmbientGlow";
import Link from "next/link";
import { Hash, MessageCircle, Users, Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function SpacesPage() {
  const spaces = await prisma.space.findMany({
    include: {
      organization: {
        include: {
          members: true,
        },
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  }).catch(() => []);

  return (
    <Shell>
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-12 relative min-h-screen">
        <AmbientGlow className="top-10 -right-20 w-[600px] h-[600px] opacity-[0.03] dark:opacity-[0.08]" color="var(--brand)" />
        
        <div className="flex items-end justify-between hairline-b pb-6 relative z-10">
          <div>
            <h1 className="serif text-5xl md:text-6xl tracking-tight">Spaces</h1>
            <p className="text-g5 mt-3 text-lg">Gather with your tribe. Discussion, voice, and collaboration.</p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-ink text-paper px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-ink-2 transition-all active:scale-95 border border-[var(--brand)]/20 shadow-md">
            <Plus size={16} />
            <span>Create Space</span>
          </button>
        </div>

        {spaces.length === 0 ? (
          <div className="py-32 text-center relative z-10 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center text-g5 mb-6">
              <Hash size={28} className="text-[var(--brand)]" />
            </div>
            <h3 className="serif text-3xl text-ink mb-2">No spaces yet</h3>
            <p className="text-g5 text-[15px] max-w-[40ch] leading-relaxed mb-8">
              Start a builder space.
            </p>
            <button className="bg-ink text-paper px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-ink-2 transition-all active:scale-95 border border-[var(--brand)]/20 shadow-md">
              Create Space
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 relative z-10">
            {spaces.map((space) => (
              <Link key={space.id} href={`/spaces/${space.id}`} className="premium-card p-8 flex flex-col group">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-g1 flex items-center justify-center text-g5 group-hover:bg-[var(--brand)] group-hover:text-white transition-colors duration-300">
                    <Hash size={24} />
                  </div>
                  <div>
                    <h3 className="serif text-3xl group-hover:italic transition-all duration-300">{space.name}</h3>
                    <span className="mono text-[11px] text-[var(--brand)] uppercase tracking-wider">{space.organization.name}</span>
                  </div>
                </div>
                <p className="text-g5 text-[15px] mt-4 leading-relaxed max-w-[50ch] flex-1">{space.description || "No description provided."}</p>
                
                <div className="mt-8 flex items-center gap-6 text-[13px] text-g6 border-t border-g3 pt-4">
                  <div className="flex items-center gap-1.5"><Users size={16} className="text-g4" /> {space.organization.members.length} members</div>
                  <div className="flex items-center gap-1.5"><MessageCircle size={16} className="text-g4" /> {space._count.messages} messages</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Shell>
  );
}
