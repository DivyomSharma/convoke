import { Shell } from "@/components/Shell";
import { AmbientGlow } from "@/components/AmbientGlow";
import Link from "next/link";
import { Building2, CircleDollarSign, MapPin } from "lucide-react";

const mockOpportunities = [
  { id: 1, title: "Frontend Engineer Intern", org: "Vercel", type: "Internship", compensation: "$8k/mo", location: "Remote", skills: ["React", "Next.js", "TypeScript"] },
  { id: 2, title: "Founding Product Designer", org: "Convoke Core", type: "Full Time", compensation: "$120k + Equity", location: "San Francisco", skills: ["Figma", "UI/UX", "Prototyping"] },
  { id: 3, title: "AI Research Fellow", org: "OpenAI Labs", type: "Fellowship", compensation: "Grant provided", location: "Remote", skills: ["Python", "PyTorch", "LLMs"] },
  { id: 4, title: "Campus Ambassador", org: "Notion", type: "Volunteer", compensation: "Swag & Perks", location: "Various Universities", skills: ["Community", "Marketing"] },
];

export default function OpportunitiesPage() {
  return (
    <Shell>
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-12 relative">
        <AmbientGlow className="bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] opacity-[0.02] dark:opacity-[0.05]" color="var(--brand)" />
        
        <div className="flex items-end justify-between hairline-b pb-6 relative z-10">
          <div>
            <h1 className="serif text-5xl md:text-6xl tracking-tight">Opportunities</h1>
            <p className="text-g5 mt-3 text-lg">Internships, roles, grants, and fellowships.</p>
          </div>
          <button className="bg-ink text-paper px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-ink-2 transition-colors">
            Post Opportunity
          </button>
        </div>

        <div className="flex flex-col gap-4 mt-10 relative z-10">
          {mockOpportunities.map((opp) => (
            <Link key={opp.id} href={`/opportunities/${opp.id}`} className="premium-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between group">
              <div className="flex-1">
                <h3 className="serif text-3xl group-hover:text-[var(--brand)] transition-colors">{opp.title}</h3>
                <div className="flex items-center gap-4 mt-3 text-[14px] text-g5">
                  <div className="flex items-center gap-1.5 font-medium text-ink"><Building2 size={16} className="text-g4" /> {opp.org}</div>
                  <div className="flex items-center gap-1.5"><MapPin size={16} className="text-g4" /> {opp.location}</div>
                  <div className="flex items-center gap-1.5"><CircleDollarSign size={16} className="text-g4" /> {opp.compensation}</div>
                </div>
                <div className="flex items-center gap-2 mt-5">
                  <span className="mono text-[11px] font-medium uppercase tracking-wider bg-g1 px-2.5 py-1 rounded-md">{opp.type}</span>
                  {opp.skills.map(s => (
                    <span key={s} className="mono text-[11px] font-medium uppercase tracking-wider border border-g3 px-2.5 py-1 rounded-md">{s}</span>
                  ))}
                </div>
              </div>
              <div className="mt-6 md:mt-0 md:ml-10">
                <div className="w-10 h-10 rounded-full border border-g3 flex items-center justify-center text-ink group-hover:bg-[var(--brand)] group-hover:text-white group-hover:border-[var(--brand)] transition-all duration-300 shadow-sm">
                  <span className="mono text-[16px] leading-none">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Shell>
  );
}
