import { Shell } from "@/components/Shell";
import { AmbientGlow } from "@/components/AmbientGlow";
import Link from "next/link";
import { Hash, MessageCircle, Users } from "lucide-react";

const mockSpaces = [
  { id: 1, name: "Web Startups", description: "Founders building the next generation of SaaS and consumer web apps.", members: 1240, threads: 342, category: "Startups" },
  { id: 2, title: "AI & Machine Learning", description: "Discussions on LLMs, generative AI, research papers, and models.", members: 4500, threads: 1205, category: "AI" },
  { id: 3, title: "UI/UX Design", description: "Share portfolios, critique designs, and discuss the latest trends.", members: 890, threads: 156, category: "Design" },
  { id: 4, title: "Challenge Teambuilding", description: "Find teammates for upcoming global and local challenges.", members: 3200, threads: 890, category: "Collaboration" },
];

export default function SpacesPage() {
  return (
    <Shell>
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-12 relative">
        <AmbientGlow className="top-10 -right-20 w-[600px] h-[600px] opacity-[0.03] dark:opacity-[0.08]" color="var(--brand)" />
        
        <div className="flex items-end justify-between hairline-b pb-6 relative z-10">
          <div>
            <h1 className="serif text-5xl md:text-6xl tracking-tight">Spaces</h1>
            <p className="text-g5 mt-3 text-lg">Gather with your tribe. Discussion, voice, and collaboration.</p>
          </div>
          <button className="bg-ink text-paper px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-ink-2 transition-colors">
            Create Space
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-10 relative z-10">
          {mockSpaces.map((space) => (
            <Link key={space.id} href={`/spaces/${space.id}`} className="premium-card p-8 flex flex-col group">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-g1 flex items-center justify-center text-g5 group-hover:bg-[var(--brand)] group-hover:text-white transition-colors duration-300">
                  <Hash size={24} />
                </div>
                <div>
                  <h3 className="serif text-3xl group-hover:italic transition-all duration-300">{space.name || space.title}</h3>
                  <span className="mono text-[11px] text-[var(--brand)] uppercase tracking-wider">{space.category}</span>
                </div>
              </div>
              <p className="text-g5 text-[15px] mt-4 leading-relaxed max-w-[50ch]">{space.description}</p>
              
              <div className="mt-8 flex items-center gap-6 text-[13px] text-g6">
                <div className="flex items-center gap-1.5"><Users size={16} className="text-g4" /> {space.members.toLocaleString()} members</div>
                <div className="flex items-center gap-1.5"><MessageCircle size={16} className="text-g4" /> {space.threads.toLocaleString()} threads</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Shell>
  );
}
