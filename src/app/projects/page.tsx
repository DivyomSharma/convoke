import { Shell } from "@/components/Shell";
import { AmbientGlow } from "@/components/AmbientGlow";
import Link from "next/link";
import { Eye, Download, Share2, Plus } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  }).catch(() => []);

  return (
    <Shell>
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-12 relative min-h-screen">
        <AmbientGlow className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] opacity-[0.02] dark:opacity-[0.04]" color="var(--brand)" />
        
        <div className="flex items-end justify-between hairline-b pb-6 relative z-10">
          <div>
            <h1 className="serif text-5xl md:text-6xl tracking-tight">Projects Gallery</h1>
            <p className="text-g5 mt-3 text-lg">Proof of work. Discover what ambitious people are building.</p>
          </div>
          <button className="flex items-center justify-center gap-2 bg-ink text-paper px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-ink-2 transition-all active:scale-95 border border-[var(--brand)]/20 shadow-md">
            <Plus size={16} />
            <span>Launch Project</span>
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="py-32 text-center relative z-10 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center text-g5 mb-6">
              <Eye size={28} className="text-[var(--brand)]" />
            </div>
            <h3 className="serif text-3xl text-ink mb-2">No projects shipped yet</h3>
            <p className="text-g5 text-[15px] max-w-[40ch] leading-relaxed mb-8">
              Share what you are building.
            </p>
            <button className="bg-ink text-paper px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-ink-2 transition-all active:scale-95 border border-[var(--brand)]/20 shadow-md">
              Launch Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10 relative z-10">
            {projects.map((proj) => (
              <div key={proj.id} className="premium-card overflow-hidden flex flex-col group">
                <Link href={`/projects/${proj.id}`} className="block relative h-48 overflow-hidden bg-gradient-to-br from-g2 to-g1 flex items-center justify-center border-b border-g3">
                  {proj.bannerUrl ? (
                    <img src={proj.bannerUrl} alt={proj.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-g3/80 bg-paper flex items-center justify-center shadow-md">
                      {proj.user.avatarUrl ? (
                        <img src={proj.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <span className="serif text-xl text-g5 font-bold uppercase">
                          {(proj.user.name || "B").slice(0, 1)}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar src={proj.user.avatarUrl || ""} name={proj.user.name || "Builder"} size={24} />
                    <Link href={`/profile/${proj.user.handle || proj.user.id}`} className="text-[13px] font-medium text-ink hover:underline">
                      {proj.user.name || "Builder"}
                    </Link>
                  </div>
                  <Link href={`/projects/${proj.id}`} className="block flex-1">
                    <h3 className="serif text-2xl group-hover:text-[var(--brand)] transition-colors">{proj.title}</h3>
                    <p className="text-g5 text-[14px] mt-2 line-clamp-2">{proj.description}</p>
                  </Link>
                  
                  <div className="mt-6 flex items-center justify-between text-g5 text-[13px] hairline-t pt-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5"><Eye size={16} /> {proj.views}</div>
                      <div className="flex items-center gap-1.5"><Download size={16} /> {proj.downloads}</div>
                    </div>
                    <button className="hover:text-ink transition-colors"><Share2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Shell>
  );
}
