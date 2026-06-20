import { Shell } from "@/components/Shell";
import { AmbientGlow } from "@/components/AmbientGlow";
import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";

const mockEvents = [
  { id: 1, title: "Next.js Conf 2026", type: "Conference", date: "Oct 24, 2026", location: "San Francisco", org: "Vercel", attendees: 1200 },
  { id: 2, title: "Founder Mixer & Pitch", type: "Meetup", date: "Nov 12, 2026", location: "New York", org: "YC Startup Hub", attendees: 150 },
  { id: 3, title: "AI in Production", type: "Tech Talk", date: "Dec 05, 2026", location: "Remote", org: "OpenAI Labs", attendees: 3400 },
  { id: 4, title: "Web Design Systems", type: "Workshop", date: "Dec 10, 2026", location: "London", org: "Figma", attendees: 80 },
];

export default function EventsPage() {
  return (
    <Shell>
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-12 relative">
        <AmbientGlow className="top-0 -right-20 w-[800px] h-[800px] opacity-[0.02] dark:opacity-[0.05]" color="var(--brand)" />
        
        <div className="flex items-end justify-between hairline-b pb-6 relative z-10">
          <div>
            <h1 className="serif text-5xl md:text-6xl tracking-tight">Events</h1>
            <p className="text-g5 mt-3 text-lg">Meetups, tech talks, webinars, and conferences.</p>
          </div>
          <button className="bg-ink text-paper px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-ink-2 transition-colors">
            Host Event
          </button>
        </div>

        <div className="flex flex-col gap-4 mt-10 relative z-10">
          {mockEvents.map((evt) => (
            <Link key={evt.id} href={`/events/${evt.id}`} className="premium-card p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between group">
              <div className="flex-1">
                <span className="mono text-[11px] text-[var(--brand)] font-medium uppercase tracking-wider bg-[var(--brand)]/10 px-3 py-1 rounded-full">
                  {evt.type}
                </span>
                <h3 className="serif text-3xl mt-4 group-hover:italic transition-all duration-300">{evt.title}</h3>
                <p className="text-g5 mt-2 text-[15px]">Hosted by <span className="font-medium text-ink">{evt.org}</span></p>
              </div>
              
              <div className="mt-6 md:mt-0 flex flex-col md:items-end gap-3 md:min-w-[200px]">
                <div className="flex items-center gap-2 text-ink font-medium"><CalendarDays size={16} className="text-g4" /> {evt.date}</div>
                <div className="flex items-center gap-2 text-g5 text-[14px]"><MapPin size={16} className="text-g4" /> {evt.location}</div>
                <div className="flex items-center gap-2 text-g5 text-[14px]"><Users size={16} className="text-g4" /> {evt.attendees} attending</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Shell>
  );
}
