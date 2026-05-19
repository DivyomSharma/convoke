import type { Metadata } from "next";
import Image from "next/image";
import { Calendar, MapPin, QrCode, Shirt, Trophy, Users } from "lucide-react";
import { Footer } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { ButtonLink } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { featuredEvents } from "@/data/platform";
import { formatInr } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = featuredEvents.find((item) => item.slug === slug) ?? featuredEvents[0];

  return {
    title: event.title,
    description: `${event.title} by ${event.organizer} on Convoke.`,
    openGraph: {
      title: event.title,
      description: `${event.city} / ${event.date} / ${event.category}`,
      type: "website",
    },
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = featuredEvents.find((item) => item.slug === slug) ?? featuredEvents[0];
  const sections = ["Overview", "Schedule", "Speakers", "Sponsors", "Prizes", "FAQs", "Gallery"];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    eventAttendanceMode: event.mode,
    location: event.city,
    startDate: "2026-08-24T10:00:00+05:30",
    organizer: { "@type": "Organization", name: event.organizer },
    offers: { "@type": "Offer", price: event.price, priceCurrency: "INR" },
  };

  return (
    <>
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="px-5 pb-28 pt-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          <section className="grid gap-10 lg:grid-cols-[1fr_360px]">
            <div>
              <div className="flex flex-wrap gap-3 text-sm text-muted">
                <span>{event.category}</span>
                <span>/</span>
                <span>{event.organizer}</span>
              </div>
              <h1 className="mt-6 max-w-4xl text-6xl font-semibold tracking-[-0.05em] md:text-9xl">
                {event.title}
              </h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-muted">
                A community invite for people who want to meet, build, learn,
                volunteer, sponsor, and become part of what happens next.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {[
                  [Calendar, event.date],
                  [MapPin, event.city],
                  [Users, `${event.attendees.toLocaleString("en-IN")} attending`],
                ].map(([Icon, label]) => (
                  <span
                    key={String(label)}
                    className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted"
                  >
                    <Icon className="size-4 text-bronze" />
                    {String(label)}
                  </span>
                ))}
              </div>
            </div>
            <Panel className="sticky top-24 h-fit p-5">
              <p className="text-sm text-muted">Registration</p>
              <p className="mt-2 text-4xl font-semibold">
                {event.price ? formatInr(event.price) : "Free"}
              </p>
              <ButtonLink href="/auth/sign-in" className="mt-6 w-full">
                Register now
              </ButtonLink>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs text-muted">
                <div className="rounded-[8px] bg-white/[0.04] p-3">
                  <QrCode className="mx-auto mb-2 size-4 text-steel" />
                  QR
                </div>
                <div className="rounded-[8px] bg-white/[0.04] p-3">
                  <Shirt className="mx-auto mb-2 size-4 text-steel" />
                  Merch
                </div>
                <div className="rounded-[8px] bg-white/[0.04] p-3">
                  <Trophy className="mx-auto mb-2 size-4 text-steel" />
                  Prizes
                </div>
              </div>
            </Panel>
          </section>

          <div className="relative mt-14 h-[420px] overflow-hidden rounded-[8px] border border-line">
            <Image
              src={event.image}
              alt={`${event.title} event atmosphere`}
              fill
              className="object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-t ${event.palette}`} />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <p className="text-sm text-white/75">{event.tagline}</p>
              <div className="mt-5 flex -space-x-3">
                {["R", "V", "S", "P", "D"].map((avatar) => (
                  <span key={avatar} className="grid size-10 place-items-center rounded-full border border-black bg-white text-sm font-semibold text-black">
                    {avatar}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <nav className="mt-16 flex gap-3 overflow-x-auto border-y border-line py-4 scrollbar-none">
            {sections.map((section) => (
              <a key={section} href={`#${section.toLowerCase()}`} className="shrink-0 text-sm text-muted hover:text-foreground">
                {section}
              </a>
            ))}
          </nav>

           <div className="mt-12 grid gap-4 md:grid-cols-2">
             {sections.map((section, index) => {
               // Custom content for each section based on the event
               let content = "";
               if (section === "Overview") {
                 content = `Join ${event.attendees.toLocaleString("en-IN")}+ ambitious builders, creators, and leaders for ${event.title}. 
                 This year's theme focuses on building the future of technology and community in India. 
                 Expect inspiring talks, hands-on workshops, and unparalleled networking opportunities.`;
               } else if (section === "Schedule") {
                 content = `Day 1 - August 24, 2026
                 10:00 AM - Registration & Welcome Coffee
                 11:00 AM - Opening Keynote: "The Future of Indian Startups"
                 12:30 PM - Networking Lunch
                 2:00 PM - Panel: "Building Scalable Tech Products"
                 3:30 PM - Workshop: "Product-Market Fit for Early Stage Startups"
                 5:00 PM - Evening Networking Session
                 
                 Day 2 - August 25, 2026
                 10:00 AM - Fireside Chat: "Lessons from Unicorn Founders"
                 11:30 AM - Hackathon Kickoff
                 1:00 PM - Lunch & Mentor Sessions
                 3:00 PM - Hackathon Development Continues
                 6:00 PM - Final Presentations & Awards`;
               } else if (section === "Speakers") {
                 content = `Featured Speakers:
                 
                 Priya Sharma - Founder & CEO, Zephyr Labs
                 "Building B2B SaaS for Global Markets from India"
                 
                 Arjun Patel - CTO, FlutterWave India
                 "Scaling Payment Infrastructure to Millions of Users"
                 
                 Dr. Meera Kapoor - Professor of Entrepreneurship, IIT Delhi
                 "Academia-Industry Collaboration for Innovation"
                 
                 Rohan Desai - Partner, Sequoia Capital India
                 "What VCs Look for in Early Stage Startups"
                 
                 Sneha Reddy - Head of Developer Relations, Google India
                 "Building Developer Communities That Scale"
                 
                 Vikram Singh - Founder, Cult.fit
                 "From Fitness App to Lifestyle Platform: The Journey"`;
               } else if (section === "Sponsors") {
                 content = `Our sponsors make events like Summit Zero possible:
                 
                 Title Sponsor: PlotArmour Studio
                 
                 Platinum Sponsors:
                 • Google Cloud for Startups
                 • Razorpay
                 • MongoDB
                 
                 Gold Sponsors:
                 • AWS Activate
                 • HubSpot for Startups
                 • Intercom
                 
                 Silver Sponsors:
                 • Vercel
                 • Supabase
                 • Netlify
                 
                 Community Partners:
                 • TiE Delhi-NCR
                 • NASSCOM Startups
                 • Indian Angel Network`;
               } else if (section === "Prizes") {
                 content = `Exciting prizes for hackathon participants and competition winners:
                 
                 Grand Prize: ₹2,50,000 + Mentorship from PlotArmour Studio
                 Second Prize: ₹1,50,000 + AWS Credits worth ₹5,00,000
                 Third Prize: ₹1,00,000 + Google Cloud Credits worth ₹3,00,000
                 
                 Category Winners:
                 • Best Innovation: ₹75,000 + Product Hunt Feature
                 • Best Design: ₹50,000 + Figma Professional Team Plan
                 • Best Social Impact: ₹75,000 + NITI Aayog Connection
                 
                 All participants get:
                 • Convoke Premium Membership (3 months)
                 • Certificate of Participation
                 • Access to event recordings and materials`;
               } else if (section === "FAQs") {
                 content = `Q: Who should attend Summit Zero?
                 A: Founders, developers, designers, product managers, and anyone passionate about building technology products and communities in India.
                 
                 Q: Is there a dress code?
                 A: Smart casual. We encourage you to wear something that represents your personal or brand identity.
                 
                 Q: Are meals included?
                 A: Yes, we provide breakfast, lunch, and snacks both days. Dinner is on your own with plenty of options nearby.
                 
                 Q: Is there accommodation assistance?
                 A: We've partnered with nearby hotels to offer discounted rates. Details will be emailed after registration.
                 
                 Q: Can I get a refund if I can't attend?
                 A: Tickets are transferable but non-refundable. Please contact us for exceptional circumstances.
                 
                 Q: Will the event be recorded?
                 A: Yes, all main stage talks will be recorded and available to attendees after the event.
                 
                 Q: Is there a code of conduct?
                 A: Absolutely. We're committed to providing a harassment-free experience for everyone.`;
               } else if (section === "Gallery") {
                 content = `Highlights from previous Summit Zero events:
                 
                 [Image: Collage of attendees networking at Summit Zero 2024]
                 [Image: Speaker delivering keynote on stage]
                 [Image: Hackathon teams working late into the night]
                 [Image: Award ceremony with winners celebrating]
                 [Image: Informal conversations during coffee break]
                 [Image: Workshop session with hands-on learning]
                 
                 Follow @convokeindia on Instagram for more behind-the-scenes moments and updates.`;
               } else {
                 content = `Details coming soon. Check back regularly for updates as we finalize the event program.`;
               }
               
               return (
                 <Panel key={section} id={section.toLowerCase()} className="min-h-64 p-6">
                   <h2 className="text-3xl font-medium tracking-[-0.03em]">{section}</h2>
                   <p className="mt-4 leading-7 text-muted">
                     {content}
                   </p>
                 </Panel>
               );
             })}
           </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
