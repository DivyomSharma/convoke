import { Shell } from "@/components/Shell";
import { AmbientGlow } from "@/components/AmbientGlow";
import { Calendar, Clock, MapPin, Share, Bookmark, Users, ChevronDown, CheckCircle2, Navigation, QrCode, Building2 } from "lucide-react";
import { Avatar } from "@/components/Avatar";

export default function EventDetailPage({ params }: { params: { id: string } }) {
  // Mock Event Data representing a Luma/Meetup style event page
  const event = {
    id: params.id,
    title: "Next.js Conf 2026: The Future of the Web",
    type: "Conference",
    host: "Vercel",
    date: "Thursday, October 24, 2026",
    time: "9:00 AM - 5:00 PM PST",
    location: "San Francisco, CA & Online",
    venue: "Moscone Center",
    bannerUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2000&auto=format&fit=crop",
    attendees: 1240,
    capacity: 1500,
    price: "Free",
    about: `Join us for the biggest Next.js Conf yet. We're gathering the brightest minds in web development to discuss the future of React, Next.js, and edge computing.

This year features hands-on workshops, deep technical dives into the new App Router architecture, and networking opportunities with the core team.`,
    schedule: [
      { time: "09:00 AM", title: "Registration & Breakfast", type: "Logistics" },
      { time: "10:00 AM", title: "Keynote: The Edge", type: "Talk", speaker: "Guillermo Rauch" },
      { time: "11:30 AM", title: "Server Components Deep Dive", type: "Workshop", speaker: "Lee Robinson" },
      { time: "01:00 PM", title: "Networking Lunch", type: "Break" }
    ],
    faqs: [
      { q: "Is there a virtual option?", a: "Yes, the keynote and main track will be streamed live for free." },
      { q: "Will there be recordings?", a: "All talks will be uploaded to YouTube within 48 hours." }
    ],
    sponsors: [
      { name: "Stripe", tier: "Platinum" },
      { name: "Clerk", tier: "Gold" },
      { name: "Supabase", tier: "Gold" }
    ]
  };

  const isFull = event.attendees >= event.capacity;

  return (
    <Shell wide>
      <div className="relative min-h-screen bg-paper pb-20">
        
        {/* HERO BANNER */}
        <div className="relative h-[250px] md:h-[350px] w-full overflow-hidden bg-g1">
          {event.bannerUrl ? (
            <img src={event.bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-80" />
          ) : (
            <AmbientGlow className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10" color="var(--brand)" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-paper via-paper/50 to-transparent" />
        </div>

        {/* MAIN CONTENT OVERLAP */}
        <div className="mx-auto max-w-[1000px] px-5 sm:px-8 relative -mt-20 z-10">
          
          <div className="flex flex-col lg:flex-row gap-10">
            
            {/* LEFT COLUMN (Details) */}
            <div className="flex-1 space-y-12">
              
              {/* Header Info */}
              <div>
                <div className="inline-block mono text-[11px] font-medium uppercase tracking-wider bg-[var(--brand)]/10 text-[var(--brand)] px-3 py-1 rounded-full mb-4">
                  {event.type}
                </div>
                <h1 className="serif text-4xl md:text-5xl tracking-tight leading-[1.1] mb-6">{event.title}</h1>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-[15px] text-g6">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-[var(--brand)]" />
                    <span className="font-medium text-ink">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-g4" />
                    <span>{event.time}</span>
                  </div>
                </div>
              </div>

              {/* Host Strip */}
              <div className="flex items-center justify-between p-4 rounded-2xl border border-g3 bg-g1/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-paper border border-g3 flex items-center justify-center text-ink"><Building2 size={16} /></div>
                  <div>
                    <div className="text-[12px] text-g5 uppercase tracking-wider font-medium">Hosted By</div>
                    <div className="text-[15px] font-medium text-ink">{event.host}</div>
                  </div>
                </div>
                <button className="text-[13px] font-medium px-4 py-1.5 rounded-full border border-g3 hover:bg-g2 transition-colors">Follow</button>
              </div>

              {/* About */}
              <section>
                <h2 className="serif text-2xl mb-4">About Event</h2>
                <div className="text-g6 text-[16px] leading-relaxed whitespace-pre-line">
                  {event.about}
                </div>
              </section>

              {/* Schedule */}
              <section>
                <h2 className="serif text-2xl mb-4">Schedule</h2>
                <div className="border border-g3 rounded-2xl overflow-hidden bg-paper">
                  {event.schedule.map((item, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 md:p-5 border-b border-g3 last:border-0 hover:bg-g1/50 transition-colors">
                      <div className="w-24 mono text-[13px] font-medium text-g5 shrink-0">{item.time}</div>
                      <div className="flex-1">
                        <div className="text-[15px] font-medium text-ink">{item.title}</div>
                        {item.speaker && <div className="text-[13px] text-g5 mt-1">Speaker: {item.speaker}</div>}
                      </div>
                      <div className="mono text-[10px] uppercase tracking-wider bg-g2 text-g6 px-2 py-1 rounded shrink-0 self-start sm:self-center">
                        {item.type}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQs */}
              <section>
                <h2 className="serif text-2xl mb-4">Frequently Asked</h2>
                <div className="space-y-3">
                  {event.faqs.map((faq, i) => (
                    <details key={i} className="group border border-g3 rounded-xl p-4 [&_summary::-webkit-details-marker]:hidden cursor-pointer bg-paper">
                      <summary className="flex items-center justify-between font-medium text-ink outline-none">
                        {faq.q}
                        <ChevronDown size={18} className="text-g4 group-open:rotate-180 transition-transform" />
                      </summary>
                      <p className="text-g5 mt-3 text-[14px] leading-relaxed">{faq.a}</p>
                    </details>
                  ))}
                </div>
              </section>

            </div>

            {/* RIGHT COLUMN (Registration & Meta) */}
            <div className="lg:w-[320px] shrink-0">
              <div className="sticky top-20 space-y-6">
                
                {/* Registration Card */}
                <div className="premium-card p-6 shadow-2xl border-[var(--brand)]/20">
                  <div className="flex items-center justify-between mb-6">
                    <span className="serif text-2xl">{event.price}</span>
                    <div className="flex items-center gap-1.5 text-[13px] text-[var(--brand)] font-medium bg-[var(--brand)]/10 px-2 py-1 rounded-md">
                      <Users size={14} /> {event.attendees} / {event.capacity}
                    </div>
                  </div>
                  
                  <button className={`w-full py-3.5 rounded-full text-[15px] font-medium transition-all shadow-lg ${isFull ? "bg-g2 text-g5 cursor-not-allowed" : "bg-[var(--brand)] text-white hover:opacity-90 hover:-translate-y-0.5"}`}>
                    {isFull ? "Join Waitlist" : "Register Now"}
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-4 border-t border-g3 pt-4">
                    <button className="flex items-center gap-2 text-[13px] text-g5 hover:text-ink transition-colors"><Share size={14} /> Share</button>
                    <button className="flex items-center gap-2 text-[13px] text-g5 hover:text-ink transition-colors"><Bookmark size={14} /> Save</button>
                  </div>
                </div>

                {/* Location Card */}
                <div className="premium-card p-5">
                  <h3 className="mono text-[11px] uppercase tracking-wider text-g5 mb-3 font-medium">Location & Venue</h3>
                  <div className="flex gap-3">
                    <div className="mt-1 text-g4"><MapPin size={18} /></div>
                    <div>
                      <div className="font-medium text-ink text-[15px]">{event.venue}</div>
                      <div className="text-[13px] text-g5 mt-0.5">{event.location}</div>
                      <button className="flex items-center gap-1.5 text-[12px] text-[var(--brand)] font-medium mt-2 hover:underline">
                        <Navigation size={12} /> Get Directions
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sponsors */}
                <div className="premium-card p-5">
                  <h3 className="mono text-[11px] uppercase tracking-wider text-g5 mb-4 font-medium">Supported By</h3>
                  <div className="flex flex-wrap gap-2">
                    {event.sponsors.map(s => (
                      <div key={s.name} className="px-3 py-1.5 bg-g1 border border-g3 rounded-md text-[13px] font-medium text-ink">
                        {s.name}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>
    </Shell>
  );
}
