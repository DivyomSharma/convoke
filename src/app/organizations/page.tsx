import { Shell } from "@/components/Shell";
import { AmbientGlow } from "@/components/AmbientGlow";
import Link from "next/link";
import { Building2, Users, MapPin } from "lucide-react";

const mockOrgs = [
  { id: 1, name: "Google DSC", type: "Community", members: 1200, location: "Global", logo: "https://api.dicebear.com/9.x/shapes/svg?seed=g" },
  { id: 2, name: "YC Startup Hub", type: "Incubator", members: 450, location: "SF / Remote", logo: "https://api.dicebear.com/9.x/shapes/svg?seed=y" },
  { id: 3, name: "OpenAI Labs", type: "Research", members: 890, location: "San Francisco", logo: "https://api.dicebear.com/9.x/shapes/svg?seed=o" },
  { id: 4, name: "Vercel Next.js", type: "Open Source", members: 5000, location: "Global", logo: "https://api.dicebear.com/9.x/shapes/svg?seed=v" },
  { id: 5, name: "IIT Delhi Robotics", type: "College Club", members: 150, location: "New Delhi", logo: "https://api.dicebear.com/9.x/shapes/svg?seed=i" },
  { id: 6, name: "Convoke Core", type: "Startup", members: 12, location: "Remote", logo: "https://api.dicebear.com/9.x/shapes/svg?seed=c" },
];

export default function OrganizationsPage() {
  return (
    <Shell>
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-12 relative">
        <AmbientGlow className="top-20 -left-20 w-[600px] h-[600px] opacity-[0.03] dark:opacity-[0.08]" color="var(--brand)" />
        
        <div className="flex items-end justify-between hairline-b pb-6 relative z-10">
          <div>
            <h1 className="serif text-5xl md:text-6xl tracking-tight">Organizations</h1>
            <p className="text-g5 mt-3 text-lg">Discover communities, startups, and college clubs.</p>
          </div>
          <button className="bg-ink text-paper px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-ink-2 transition-colors">
            Create Organization
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 relative z-10">
          {mockOrgs.map((org) => (
            <Link key={org.id} href={`/organizations/${org.id}`} className="premium-card p-6 flex flex-col group">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-g1 border border-g3 overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <img src={org.logo} alt={org.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="serif text-2xl group-hover:text-[var(--brand)] transition-colors">{org.name}</h3>
                  <span className="mono text-[11px] text-g5 uppercase tracking-wider">{org.type}</span>
                </div>
              </div>
              <div className="mt-8 flex items-center justify-between text-g5 text-[13px]">
                <div className="flex items-center gap-1.5"><Users size={14} /> {org.members.toLocaleString()} members</div>
                <div className="flex items-center gap-1.5"><MapPin size={14} /> {org.location}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Shell>
  );
}
