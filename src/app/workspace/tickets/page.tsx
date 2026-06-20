import { Shell } from "@/components/Shell";
import { AmbientGlow } from "@/components/AmbientGlow";
import { DigitalPass, TicketState } from "@/components/DigitalPass";

export default function MyTicketsPage() {
  
  // Mock Tickets Data for the Wallet
  const myTickets = [
    {
      ticketId: "TKT-A9X72K",
      eventName: "Next.js Conf 2026: The Future of the Web",
      orgName: "Vercel",
      date: "Oct 24, 2026",
      time: "9:00 AM PST",
      venue: "Moscone Center, SF",
      userName: "Divyom Sharma",
      userAvatar: "",
      seat: "VIP-12",
      type: "Early Bird",
      state: "CONFIRMED" as TicketState,
      bannerUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop",
      orgLogo: "https://api.dicebear.com/9.x/shapes/svg?seed=v"
    },
    {
      ticketId: "TKT-B4M91P",
      eventName: "Global AI Challenge Finale",
      orgName: "OpenAI Labs",
      date: "Nov 10, 2026",
      time: "10:00 AM EST",
      venue: "Online",
      userName: "Divyom Sharma",
      userAvatar: "",
      seat: "HACK-4A",
      type: "Participant",
      state: "REGISTERED" as TicketState,
      orgLogo: "https://api.dicebear.com/9.x/shapes/svg?seed=o"
    },
    {
      ticketId: "TKT-C7V22L",
      eventName: "Founder Mixer & Pitch",
      orgName: "YC Startup Hub",
      date: "Nov 12, 2026",
      time: "6:00 PM EST",
      venue: "New York, NY",
      userName: "Divyom Sharma",
      userAvatar: "",
      seat: "GEN-01",
      type: "General Admission",
      state: "WAITLISTED" as TicketState,
      orgLogo: "https://api.dicebear.com/9.x/shapes/svg?seed=y"
    }
  ];

  return (
    <Shell>
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-12 relative min-h-screen">
        <AmbientGlow className="top-20 right-20 w-[800px] h-[800px] opacity-[0.03] dark:opacity-[0.05]" color="var(--brand)" />
        
        <div className="flex items-end justify-between hairline-b pb-6 relative z-10">
          <div>
            <h1 className="serif text-5xl md:text-6xl tracking-tight">My Wallet</h1>
            <p className="text-g5 mt-3 text-lg">Your digital passports for upcoming events and challenges.</p>
          </div>
          <div className="text-[13px] font-medium text-g5 uppercase tracking-wider mono bg-g1 px-4 py-2 rounded-full">
            {myTickets.length} Passes
          </div>
        </div>

        <div className="mt-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {myTickets.map((ticket, idx) => (
              <DigitalPass key={ticket.ticketId} {...ticket} />
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
