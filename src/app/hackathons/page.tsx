import { Shell } from "@/components/Shell";
import { AmbientGlow } from "@/components/AmbientGlow";
import Link from "next/link";
import { Code, MapPin, Trophy, Users } from "lucide-react";

const mockHackathons = [
  { id: 1, title: "Global AI Hackathon", status: "Live", participants: 1240, prize: "$50k", date: "Oct 20 - Nov 10", location: "Online", org: "OpenAI Labs" },
  { id: 2, title: "Web3 Builders Summit", status: "Upcoming", participants: 450, prize: "$20k", date: "Dec 1 - Dec 3", location: "San Francisco", org: "Vercel" },
  { id: 3, title: "Hack Delhi 2026", status: "Registration Open", participants: 800, prize: "₹5 Lakhs", date: "Jan 15 - Jan 17", location: "New Delhi", org: "IIITD" },
];

export default function HackathonsPage() {
  return (
    <Shell>
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-12 relative">
        <AmbientGlow className="top-20 -left-40 w-[800px] h-[800px] opacity-[0.03] dark:opacity-[0.08]" color="var(--brand)" />
        
        <div className="flex items-end justify-between hairline-b pb-6 relative z-10">
          <div>
            <h1 className="serif text-5xl md:text-6xl tracking-tight">Hackathons</h1>
            <p className="text-g5 mt-3 text-lg">Build the future. Win prizes. Find co-founders.</p>
          </div>
          <button className="bg-ink text-paper px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-ink-2 transition-colors">
            Organize Hackathon
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 relative z-10">
          {mockHackathons.map((hack) => (
            <Link key={hack.id} href={`/hackathons/${hack.id}`} className="premium-card overflow-hidden group flex flex-col">
              <div className="h-32 bg-g1 relative overflow-hidden flex items-center justify-center border-b border-g3">
                <Code size={48} className="text-g3 group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-paper text-ink px-3 py-1 rounded-full text-[11px] font-medium uppercase tracking-wide hairline shadow-sm">
                  {hack.status}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="serif text-2xl group-hover:text-[var(--brand)] transition-colors">{hack.title}</h3>
                <p className="text-g5 text-[14px] mt-1">by {hack.org}</p>
                
                <div className="mt-6 flex-1 flex flex-col justify-end gap-3 text-[13px] text-g6">
                  <div className="flex items-center gap-2"><Trophy size={14} className="text-g4" /> <span className="font-medium text-ink">{hack.prize}</span> in prizes</div>
                  <div className="flex items-center gap-2"><Users size={14} className="text-g4" /> {hack.participants} builders going</div>
                  <div className="flex items-center gap-2"><MapPin size={14} className="text-g4" /> {hack.location} · {hack.date}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Shell>
  );
}
