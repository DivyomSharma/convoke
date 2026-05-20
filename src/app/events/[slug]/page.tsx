import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Calendar,
  ChevronRight,
  ExternalLink,
  Gift,
  Heart,
  ImageIcon,
  MapPin,
  Mic2,
  QrCode,
  Share2,
  Shirt,
  Sparkles,
  Star,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { Footer } from "@/components/marketing/footer";
import { MotionShell } from "@/components/marketing/motion-shell";
import { SiteHeader } from "@/components/marketing/site-header";
import { ButtonLink } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { communities, featuredEvents, seedPeople } from "@/data/platform";
import { formatInr } from "@/lib/utils";
import { FAQSection } from "./faq-section";
import { ApplyButton } from "@/components/ui/apply-button";
import { SaveButton } from "@/components/ui/save-button";

// ─── PER-EVENT SPEAKERS ────────────────────────────────────────────────────

type Speaker = {
  name: string;
  title: string;
  org: string;
  topic: string;
  image: string;
};

const eventSpeakers: Record<string, Speaker[]> = {
  "summit-zero": [
    { name: "Priya Sharma", title: "Founder & CEO", org: "Zephyr Labs", topic: "Building B2B SaaS for Global Markets from India", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" },
    { name: "Arjun Patel", title: "CTO", org: "FlutterWave India", topic: "Scaling Payment Infra to 10M Users", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
    { name: "Dr. Meera Kapoor", title: "Professor", org: "IIT Delhi", topic: "Academia-Industry Innovation Pipelines", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80" },
    { name: "Rohan Desai", title: "Partner", org: "Sequoia India", topic: "What VCs Actually Look For in Seed Rounds", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" },
    { name: "Sneha Reddy", title: "DevRel Lead", org: "Google India", topic: "Developer Communities That Ship", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80" },
    { name: "Vikram Singh", title: "Founder", org: "Cult.fit", topic: "From Fitness App to Lifestyle Platform", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
  ],
  "campus-protocol": [
    { name: "Maya Krishnan", title: "VP, Student Affairs", org: "North Grid", topic: "How 15 Colleges Align Under One Flag", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" },
    { name: "Aarav Mehta", title: "Robotics Club Lead", org: "IIT Delhi", topic: "Hacking Campus Culture from the Inside", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
    { name: "Naina Kapoor", title: "Design Lead", org: "Pixel Society", topic: "Design Systems for Student Orgs", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80" },
    { name: "Kabir Singh", title: "Hackathon Lead", org: "Convoke Labs", topic: "Running 48-Hour Events Without Burnout", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" },
    { name: "Ananya Iyer", title: "Impact Lead", org: "North Grid", topic: "Social Impact Projects That Actually Ship", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80" },
    { name: "Dev Patel", title: "Full-Stack Engineer", org: "PlotArmour Studio", topic: "Building Event Tech on a Student Budget", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
  ],
  "forge-hack": [
    { name: "Arya Sen", title: "Founder", org: "Convoke Labs", topic: "Why Hackathons Need Better Infrastructure", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
    { name: "Kabir Singh", title: "Hackathon Lead", org: "Convoke Labs", topic: "Judging Criteria That Actually Work", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" },
    { name: "Sneha Reddy", title: "DevRel Lead", org: "FOSS United", topic: "Open Source as a Career Launchpad", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80" },
    { name: "Vikram Joshi", title: "AI Researcher", org: "DeepMind Campus", topic: "Shipping ML in 48 Hours", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" },
    { name: "Ishita Gupta", title: "UX Researcher", org: "Pixel Society", topic: "Designing Under Pressure", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80" },
    { name: "Rahul Verma", title: "OSS Contributor", org: "FOSS United", topic: "From PR to Product: The Builder Path", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" },
  ],
};

// ─── PER-EVENT SCHEDULES ───────────────────────────────────────────────────

type ScheduleSession = { time: string; title: string; speaker?: string; type: "talk" | "workshop" | "break" | "keynote" | "hackathon" };
type ScheduleDay = { day: string; date: string; sessions: ScheduleSession[] };

const eventSchedules: Record<string, ScheduleDay[]> = {
  "summit-zero": [
    {
      day: "Day 1", date: "Aug 24, 2026",
      sessions: [
        { time: "09:30 AM", title: "Registration & Welcome Coffee", type: "break" },
        { time: "10:30 AM", title: "Opening Keynote — The Future of Indian Startups", speaker: "Priya Sharma", type: "keynote" },
        { time: "12:00 PM", title: "Networking Lunch", type: "break" },
        { time: "01:30 PM", title: "Scaling Payment Infra to 10M Users", speaker: "Arjun Patel", type: "talk" },
        { time: "03:00 PM", title: "Workshop — Product-Market Fit for Seed Stage", speaker: "Rohan Desai", type: "workshop" },
        { time: "05:00 PM", title: "Evening Mixer & Open Networking", type: "break" },
      ],
    },
    {
      day: "Day 2", date: "Aug 25, 2026",
      sessions: [
        { time: "10:00 AM", title: "Fireside Chat — Lessons from Unicorn Founders", speaker: "Vikram Singh", type: "keynote" },
        { time: "11:30 AM", title: "Developer Communities That Ship", speaker: "Sneha Reddy", type: "talk" },
        { time: "01:00 PM", title: "Lunch & Mentor Sessions", type: "break" },
        { time: "02:30 PM", title: "Workshop — Academia-Industry Pipelines", speaker: "Dr. Meera Kapoor", type: "workshop" },
        { time: "04:30 PM", title: "Pitch Competition Finals", type: "talk" },
        { time: "06:00 PM", title: "Awards Ceremony & Closing", type: "keynote" },
      ],
    },
  ],
  "forge-hack": [
    {
      day: "Day 1", date: "Oct 03, 2026",
      sessions: [
        { time: "09:00 AM", title: "Check-in & Team Formation", type: "break" },
        { time: "10:00 AM", title: "Hackathon Kickoff & Theme Reveal", speaker: "Arya Sen", type: "keynote" },
        { time: "10:30 AM", title: "Hacking Begins", type: "hackathon" },
        { time: "01:00 PM", title: "Lunch & Lightning Talks", type: "break" },
        { time: "02:00 PM", title: "Mentor Office Hours — Round 1", type: "workshop" },
        { time: "06:00 PM", title: "Dinner & Night Hacking", type: "break" },
      ],
    },
    {
      day: "Day 2", date: "Oct 04, 2026",
      sessions: [
        { time: "09:00 AM", title: "Breakfast & Final Sprint", type: "break" },
        { time: "12:00 PM", title: "Code Freeze & Submission", type: "hackathon" },
        { time: "01:00 PM", title: "Lunch", type: "break" },
        { time: "02:00 PM", title: "Demo Presentations", type: "talk" },
        { time: "04:30 PM", title: "Judging & Deliberation", type: "talk" },
        { time: "05:30 PM", title: "Awards & Closing Ceremony", type: "keynote" },
      ],
    },
  ],
};

// ─── PER-EVENT SPONSORS ────────────────────────────────────────────────────

type SponsorTier = { tier: string; names: string[] };

const eventSponsors: Record<string, SponsorTier[]> = {
  "summit-zero": [
    { tier: "Title", names: ["PlotArmour Studio"] },
    { tier: "Platinum", names: ["Google Cloud for Startups", "Razorpay", "MongoDB"] },
    { tier: "Gold", names: ["AWS Activate", "HubSpot for Startups", "Intercom"] },
    { tier: "Silver", names: ["Vercel", "Supabase", "Netlify"] },
    { tier: "Community", names: ["TiE Delhi-NCR", "NASSCOM", "Indian Angel Network"] },
  ],
  "campus-protocol": [
    { tier: "Title", names: ["North Grid Societies"] },
    { tier: "Platinum", names: ["Google for Education", "Microsoft Imagine Cup"] },
    { tier: "Gold", names: ["GitHub Education", "Notion for Students", "Canva"] },
    { tier: "Silver", names: ["Replit", "Figma", "Digital Ocean"] },
    { tier: "Community", names: ["ACM Delhi", "GDG Delhi-NCR", "MLH"] },
  ],
  "forge-hack": [
    { tier: "Title", names: ["Convoke Labs"] },
    { tier: "Platinum", names: ["AWS Activate", "MongoDB Atlas", "Vercel"] },
    { tier: "Gold", names: ["Supabase", "Twilio", "Postman"] },
    { tier: "Silver", names: ["Replit", "Netlify", "Railway"] },
    { tier: "Community", names: ["FOSS United", "MLH", "Devfolio"] },
  ],
};

// ─── PER-EVENT PRIZES ──────────────────────────────────────────────────────

type Prize = { place: string; amount: string; extras: string; icon: typeof Trophy };

const eventPrizes: Record<string, Prize[]> = {
  "summit-zero": [
    { place: "Grand Prize", amount: "₹2,50,000", extras: "Mentorship from PlotArmour Studio + 6-month co-working pass", icon: Trophy },
    { place: "Runner Up", amount: "₹1,50,000", extras: "AWS Credits worth ₹5,00,000 + Google Cloud subscription", icon: Award },
    { place: "Third Place", amount: "₹1,00,000", extras: "Google Cloud Credits worth ₹3,00,000", icon: Star },
    { place: "Best Innovation", amount: "₹75,000", extras: "Product Hunt Feature + investor intro", icon: Zap },
    { place: "Best Design", amount: "₹50,000", extras: "Figma Professional Team Plan (1 year)", icon: Sparkles },
    { place: "Best Social Impact", amount: "₹75,000", extras: "NITI Aayog connection + media coverage", icon: Heart },
  ],
  "forge-hack": [
    { place: "Grand Prize", amount: "₹3,00,000", extras: "Incubation at Convoke Labs + 3-month mentorship", icon: Trophy },
    { place: "Runner Up", amount: "₹1,50,000", extras: "MongoDB Atlas credits + Vercel Pro plan", icon: Award },
    { place: "Third Place", amount: "₹75,000", extras: "AWS credits worth ₹2,00,000", icon: Star },
    { place: "Best DX Tool", amount: "₹50,000", extras: "Feature on FOSS United blog + DevRel intro", icon: Zap },
    { place: "Best Use of AI", amount: "₹50,000", extras: "GPU credits + research paper co-authorship", icon: Sparkles },
    { place: "Community Choice", amount: "₹25,000", extras: "Audience-voted winner + swag box", icon: Heart },
  ],
};

// ─── PER-EVENT FAQS ────────────────────────────────────────────────────────

type FAQ = { q: string; a: string };

const eventFAQs: Record<string, FAQ[]> = {
  "summit-zero": [
    { q: "Who should attend Summit Zero?", a: "Founders, developers, designers, product managers, and anyone passionate about building technology products and communities in India." },
    { q: "Is there a dress code?", a: "Smart casual. We encourage you to wear something that represents your personal or brand identity — startup tees welcome." },
    { q: "Are meals included?", a: "Yes, breakfast, lunch, and snacks are provided both days. Dinner is on your own with curated restaurant recommendations nearby." },
    { q: "Is there accommodation assistance?", a: "We've partnered with nearby hotels to offer discounted rates. Details are emailed within 48 hours of registration." },
    { q: "Can I get a refund?", a: "Tickets are transferable but non-refundable. Contact us for exceptional circumstances and we'll work something out." },
    { q: "Will sessions be recorded?", a: "All main stage talks are recorded and available to registered attendees within a week of the event." },
    { q: "Is there a code of conduct?", a: "Absolutely. We're committed to providing a harassment-free, inclusive experience for everyone. Full policy available on registration." },
  ],
  "forge-hack": [
    { q: "Do I need a team to participate?", a: "No — solo hackers are welcome. We have a team formation session on Day 1 morning. Teams of 2-4 are ideal." },
    { q: "What tech stack can I use?", a: "Anything you want. Web, mobile, ML, hardware — if you can demo it, you can build it." },
    { q: "Is food and drinks provided?", a: "Yes. Breakfast, lunch, dinner, midnight snacks, unlimited coffee, and energy drinks — we've got you covered for 48 hours." },
    { q: "Can I sleep at the venue?", a: "Yes, we have designated rest areas with bean bags and blankets. Many hackers prefer to code through the night." },
    { q: "What should I bring?", a: "Laptop, charger, any hardware you're hacking with, toiletries, a change of clothes, and your best ideas." },
    { q: "How is judging done?", a: "Panels of 3 judges per track. Criteria: innovation (30%), execution (30%), design (20%), impact (20%). You get 5 minutes to demo." },
  ],
};

// ─── PER-EVENT GALLERY ─────────────────────────────────────────────────────

const eventGallery: Record<string, string[]> = {
  "summit-zero": [
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1591115765373-5f9cf1da241c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1528605105345-5344ea20e269?auto=format&fit=crop&w=600&q=80",
  ],
  "forge-hack": [
    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80",
  ],
};

// ─── DEFAULTS FOR EVENTS WITHOUT SPECIFIC DATA ─────────────────────────────

const defaultSpeakers: Speaker[] = [
  { name: "Arya Sen", title: "Founder", org: "Convoke Labs", topic: "Building Community Infrastructure", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
  { name: "Maya Krishnan", title: "Community Lead", org: "North Grid", topic: "Scaling Student Communities", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" },
  { name: "Kabir Singh", title: "Hackathon Lead", org: "Convoke Labs", topic: "Events That People Remember", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80" },
  { name: "Sneha Reddy", title: "DevRel Lead", org: "FOSS United", topic: "Open Source for Campus Communities", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80" },
];

const defaultSchedule: ScheduleDay[] = [
  {
    day: "Day 1", date: "Event Day",
    sessions: [
      { time: "09:30 AM", title: "Doors Open & Registration", type: "break" },
      { time: "10:30 AM", title: "Opening Keynote", type: "keynote" },
      { time: "12:00 PM", title: "Networking Lunch", type: "break" },
      { time: "01:30 PM", title: "Afternoon Sessions", type: "talk" },
      { time: "03:30 PM", title: "Workshops & Breakouts", type: "workshop" },
      { time: "05:30 PM", title: "Closing & Mixer", type: "break" },
    ],
  },
];

const defaultSponsors: SponsorTier[] = [
  { tier: "Title", names: ["Convoke"] },
  { tier: "Gold", names: ["Google Cloud", "Razorpay"] },
  { tier: "Silver", names: ["Vercel", "Supabase"] },
  { tier: "Community", names: ["MLH", "Devfolio"] },
];

const defaultPrizes: Prize[] = [
  { place: "Winner", amount: "₹1,00,000", extras: "Mentorship + platform credits", icon: Trophy },
  { place: "Runner Up", amount: "₹50,000", extras: "Cloud credits + merch", icon: Award },
  { place: "Third Place", amount: "₹25,000", extras: "Swag box + certificates", icon: Star },
];

const defaultFAQs: FAQ[] = [
  { q: "Who can attend?", a: "Anyone passionate about building, creating, and connecting. Students, professionals, hobbyists — all welcome." },
  { q: "Are meals included?", a: "Yes, meals and refreshments are provided for all attendees." },
  { q: "Will sessions be recorded?", a: "Main stage sessions are recorded and shared with registered attendees after the event." },
  { q: "Is there a code of conduct?", a: "Yes. We're committed to a harassment-free, inclusive experience for everyone." },
];

const defaultGallery = [
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1528605105345-5344ea20e269?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80",
];

// ─── HELPERS ───────────────────────────────────────────────────────────────

const sessionTypeStyles: Record<string, string> = {
  keynote: "border-bronze/40 bg-bronze/10 text-bronze",
  talk: "border-steel/40 bg-steel/10 text-steel",
  workshop: "border-rust/40 bg-rust/10 text-rust",
  break: "border-line bg-white/[0.04] text-muted",
  hackathon: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
};

const tierStyles: Record<string, { bg: string; text: string; border: string; size: string }> = {
  Title: { bg: "bg-gradient-to-br from-bronze/20 to-bronze/5", text: "text-bronze", border: "border-bronze/40", size: "text-lg font-semibold" },
  Platinum: { bg: "bg-white/[0.06]", text: "text-foreground", border: "border-line", size: "text-base font-medium" },
  Gold: { bg: "bg-white/[0.04]", text: "text-foreground/80", border: "border-line", size: "text-sm font-medium" },
  Silver: { bg: "bg-white/[0.03]", text: "text-muted", border: "border-line", size: "text-sm" },
  Community: { bg: "bg-white/[0.02]", text: "text-muted", border: "border-transparent", size: "text-xs" },
};

// ─── STATIC PARAMS ─────────────────────────────────────────────────────────

export function generateStaticParams() {
  return featuredEvents.map((event) => ({ slug: event.slug }));
}

// ─── METADATA ──────────────────────────────────────────────────────────────

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = featuredEvents.find((e) => e.slug === slug) ?? featuredEvents[0];

  return {
    title: `${event.title} — ${event.city} | Convoke`,
    description: `${event.tagline} ${event.date} in ${event.city}. Organized by ${event.organizer} on Convoke.`,
    openGraph: {
      title: event.title,
      description: `${event.city} / ${event.date} / ${event.category}`,
      type: "website",
      images: [event.image],
    },
  };
}

// ─── PAGE ──────────────────────────────────────────────────────────────────

export default async function EventDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const event = featuredEvents.find((e) => e.slug === slug) ?? featuredEvents[0];
  const community = communities.find((c) => c.slug === event.organizerSlug);
  const speakers = eventSpeakers[event.slug] ?? defaultSpeakers;
  const schedule = eventSchedules[event.slug] ?? defaultSchedule;
  const sponsors = eventSponsors[event.slug] ?? defaultSponsors;
  const prizes = eventPrizes[event.slug] ?? defaultPrizes;
  const faqs = eventFAQs[event.slug] ?? defaultFAQs;
  const gallery = eventGallery[event.slug] ?? defaultGallery;

  // Pick attendee avatars from seedPeople
  const attendeeAvatars = seedPeople.slice(0, 8);
  const capacityPercent = Math.min(95, Math.round((event.attendees / (event.attendees * 1.25)) * 100));
  const spotsLeft = Math.round(event.attendees * 0.25);

  const sections = ["Overview", "Schedule", "Speakers", "Sponsors", "Prizes", "FAQs", "Gallery"];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.tagline,
    eventAttendanceMode: event.mode === "Offline"
      ? "https://schema.org/OfflineEventAttendanceMode"
      : event.mode === "Hybrid"
        ? "https://schema.org/MixedEventAttendanceMode"
        : "https://schema.org/OnlineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: event.city,
      address: { "@type": "PostalAddress", addressLocality: event.city, addressCountry: "IN" },
    },
    startDate: "2026-08-24T10:00:00+05:30",
    organizer: { "@type": "Organization", name: event.organizer },
    offers: {
      "@type": "Offer",
      price: event.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
    image: event.image,
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

          {/* ── HERO ───────────────────────────────────────────────── */}
          <section className="grid gap-10 lg:grid-cols-[1fr_380px]">
            <div>
              <MotionShell>
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-bronze/30 bg-bronze/10 px-3 py-1 text-bronze">
                    {event.category}
                  </span>
                  <span className="text-muted">/</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-muted">
                    {event.mode}
                  </span>
                </div>
              </MotionShell>

              <MotionShell delay={0.05}>
                <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-[-0.04em] md:text-8xl lg:text-9xl">
                  {event.title}
                </h1>
              </MotionShell>

              <MotionShell delay={0.1}>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
                  {event.tagline}
                </p>
              </MotionShell>

              <MotionShell delay={0.15}>
                <div className="mt-8 flex flex-wrap gap-3">
                  {[
                    [Calendar, event.date],
                    [MapPin, event.city],
                    [Users, `${event.attendees.toLocaleString("en-IN")} attending`],
                    [Mic2, `${event.speakers} speakers`],
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
              </MotionShell>

              {/* Attendee avatars & volunteer count */}
              <MotionShell delay={0.2}>
                <div className="mt-8 flex items-center gap-4">
                  <div className="flex -space-x-2.5">
                    {attendeeAvatars.map((person) => (
                      <span
                        key={person.initials}
                        className="grid size-9 place-items-center rounded-full border-2 border-background bg-surface text-xs font-semibold text-foreground"
                        title={person.name}
                      >
                        {person.initials}
                      </span>
                    ))}
                    <span className="grid size-9 place-items-center rounded-full border-2 border-background bg-bronze/20 text-xs font-medium text-bronze">
                      +{event.attendees - attendeeAvatars.length}
                    </span>
                  </div>
                  <div className="text-sm text-muted">
                    <span className="text-foreground font-medium">{event.volunteers}</span> volunteers
                  </div>
                </div>
              </MotionShell>

              {/* Organizer cross-link */}
              <MotionShell delay={0.25}>
                <Link
                  href={`/communities/${event.organizerSlug}`}
                  className="group mt-8 inline-flex items-center gap-3 rounded-full border border-line bg-white/[0.03] px-4 py-2.5 text-sm transition hover:border-bronze/40 hover:bg-white/[0.06]"
                >
                  <span className="text-muted">Organized by</span>
                  <span className="font-medium text-foreground">{event.organizer}</span>
                  <ChevronRight className="size-3.5 text-muted transition group-hover:text-bronze group-hover:translate-x-0.5" />
                </Link>
              </MotionShell>
            </div>

            {/* ── STICKY SIDEBAR ──────────────────────────────── */}
            <MotionShell delay={0.15}>
              <Panel className="sticky top-24 h-fit p-6">
                <p className="text-xs font-medium uppercase tracking-widest text-muted">Registration</p>
                <p className="mt-3 text-4xl font-semibold tracking-tight">
                  {event.price ? formatInr(event.price) : "Free"}
                </p>
                {event.price > 0 && (
                  <p className="mt-1 text-xs text-muted">per person · taxes included</p>
                )}

                {/* Capacity indicator */}
                <div className="mt-5">
                  <div className="flex justify-between text-xs text-muted">
                    <span>{capacityPercent}% filled</span>
                    <span className="text-bronze">{spotsLeft} spots left</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-bronze to-rust transition-all"
                      style={{ width: `${capacityPercent}%` }}
                    />
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3">
                  <ApplyButton label="Register now" />
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <SaveButton />
                    </div>
                    <ButtonLink href="/auth/sign-in" variant="secondary" className="flex-1">
                      <Share2 className="size-4" />
                      Share
                    </ButtonLink>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs text-muted">
                  <div className="rounded-lg bg-white/[0.04] p-3">
                    <QrCode className="mx-auto mb-1.5 size-4 text-steel" />
                    QR Check-in
                  </div>
                  <div className="rounded-lg bg-white/[0.04] p-3">
                    <Shirt className="mx-auto mb-1.5 size-4 text-steel" />
                    Merch Drop
                  </div>
                  <div className="rounded-lg bg-white/[0.04] p-3">
                    <Trophy className="mx-auto mb-1.5 size-4 text-steel" />
                    Prizes
                  </div>
                </div>

                {/* Community link in sidebar */}
                {community && (
                  <Link
                    href={`/communities/${community.slug}`}
                    className="mt-5 flex items-center gap-3 rounded-lg border border-line bg-white/[0.025] p-3 text-sm transition hover:border-bronze/30"
                  >
                    <div className="relative size-8 shrink-0 overflow-hidden rounded-md">
                      <Image src={community.image} alt={community.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-foreground text-xs">{community.name}</p>
                      <p className="truncate text-xs text-muted">{community.members.toLocaleString("en-IN")} members</p>
                    </div>
                    <ExternalLink className="ml-auto size-3.5 shrink-0 text-muted" />
                  </Link>
                )}
              </Panel>
            </MotionShell>
          </section>

          {/* ── HERO IMAGE ────────────────────────────────────── */}
          <MotionShell delay={0.1}>
            <div className="relative mt-14 h-[320px] overflow-hidden rounded-xl border border-line md:h-[460px]">
              <Image
                src={event.image}
                alt={`${event.title} atmosphere`}
                fill
                priority
                className="object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${event.palette}`} />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <p className="max-w-lg text-sm text-white/80 md:text-base">{event.tagline}</p>
              </div>
            </div>
          </MotionShell>

          {/* ── SECTION NAV ───────────────────────────────────── */}
          <nav className="mt-14 flex gap-4 overflow-x-auto border-y border-line py-4 scrollbar-none md:gap-6">
            {sections.map((section) => (
              <a
                key={section}
                href={`#${section.toLowerCase()}`}
                className="shrink-0 text-sm text-muted transition hover:text-foreground"
              >
                {section}
              </a>
            ))}
          </nav>

          {/* ── OVERVIEW ──────────────────────────────────────── */}
          <section id="overview" className="mt-16">
            <MotionShell>
              <h2 className="text-4xl font-semibold tracking-[-0.03em] md:text-5xl">Overview</h2>
            </MotionShell>
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <MotionShell delay={0.05} className="lg:col-span-2">
                <Panel className="p-6 md:p-8">
                  <p className="text-base leading-relaxed text-muted">
                    Join {event.attendees.toLocaleString("en-IN")}+ ambitious builders, creators, and leaders
                    for <span className="text-foreground font-medium">{event.title}</span> in {event.city}.
                    {event.category === "Hackathons"
                      ? " Build something real in 48 hours, ship it, pitch it, and walk away with prizes, connections, and momentum."
                      : event.category === "Startups"
                        ? " Two days of keynotes, workshops, pitch competitions, and the kind of hallway conversations that change trajectories."
                        : event.category === "College"
                          ? " A weekend celebrating student societies, arts, tech, and leadership across campuses. No walls between disciplines."
                          : event.category === "AI/ML"
                            ? " Open models, GPU clusters, and 48 hours of pure hacking. From transformers to production pipelines, bring your best ideas."
                            : event.category === "Creator"
                              ? " YouTube, design, music, and brand culture — all under one roof. Workshops, collabs, and creator-first conversations."
                              : event.category === "Design"
                                ? " UX research sprints, rapid prototyping sessions, and portfolio reviews with designers from India's top studios."
                                : event.category === "Esports"
                                  ? " Competitive tournaments, live streams, and the energy of thousands of gamers pushing for the top."
                                  : " Real contributions, real code, real community. Every session is about shipping, not just talking."}
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-muted">
                    Organized by <span className="text-foreground font-medium">{event.organizer}</span>,
                    with {event.volunteers} volunteers making it happen behind the scenes. This is where ecosystems get built.
                  </p>
                </Panel>
              </MotionShell>
              <MotionShell delay={0.1}>
                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                  {[
                    { label: "Attendees", value: event.attendees.toLocaleString("en-IN"), icon: Users },
                    { label: "Volunteers", value: String(event.volunteers), icon: Heart },
                    { label: "Speakers", value: String(event.speakers), icon: Mic2 },
                  ].map(({ label, value, icon: Icon }) => (
                    <Panel key={label} className="flex items-center gap-4 p-5">
                      <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-bronze/10">
                        <Icon className="size-5 text-bronze" />
                      </div>
                      <div>
                        <p className="text-2xl font-semibold tracking-tight">{value}</p>
                        <p className="text-xs text-muted">{label}</p>
                      </div>
                    </Panel>
                  ))}
                </div>
              </MotionShell>
            </div>
          </section>

          {/* ── SCHEDULE ──────────────────────────────────────── */}
          <section id="schedule" className="mt-24">
            <MotionShell>
              <h2 className="text-4xl font-semibold tracking-[-0.03em] md:text-5xl">Schedule</h2>
            </MotionShell>
            <div className="mt-8 space-y-10">
              {schedule.map((day, di) => (
                <MotionShell key={day.day} delay={di * 0.08}>
                  <div>
                    <div className="flex items-baseline gap-3">
                      <h3 className="text-xl font-semibold text-foreground">{day.day}</h3>
                      <span className="text-sm text-muted">{day.date}</span>
                    </div>
                    <div className="relative mt-5 space-y-0">
                      {/* Timeline line */}
                      <div className="absolute left-[67px] top-0 bottom-0 w-px bg-line md:left-[83px]" />
                      {day.sessions.map((session, si) => (
                        <div key={si} className="relative flex gap-4 pb-4 md:gap-6">
                          <div className="w-14 shrink-0 pt-3.5 text-right text-xs font-medium text-muted md:w-[70px] md:text-sm">
                            {session.time}
                          </div>
                          <div className="relative pt-3.5">
                            <div className="absolute left-0 top-[18px] size-2.5 -translate-x-1/2 rounded-full border-2 border-background bg-bronze" />
                          </div>
                          <Panel className={`flex-1 p-4 ml-2 ${session.type === "break" ? "border-dashed" : ""}`}>
                            <div className="flex flex-wrap items-start justify-between gap-2">
                              <div>
                                <p className="font-medium text-foreground text-sm">{session.title}</p>
                                {session.speaker && (
                                  <p className="mt-1 text-xs text-muted">{session.speaker}</p>
                                )}
                              </div>
                              <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${sessionTypeStyles[session.type]}`}>
                                {session.type}
                              </span>
                            </div>
                          </Panel>
                        </div>
                      ))}
                    </div>
                  </div>
                </MotionShell>
              ))}
            </div>
          </section>

          {/* ── SPEAKERS ──────────────────────────────────────── */}
          {event.speakers > 0 && (
            <section id="speakers" className="mt-24">
              <MotionShell>
                <h2 className="text-4xl font-semibold tracking-[-0.03em] md:text-5xl">Speakers</h2>
              </MotionShell>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {speakers.map((speaker, i) => (
                  <MotionShell key={speaker.name} delay={i * 0.06}>
                    <Panel className="flex gap-4 p-5">
                      <div className="relative size-14 shrink-0 overflow-hidden rounded-lg">
                        <Image src={speaker.image} alt={speaker.name} fill className="object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{speaker.name}</p>
                        <p className="mt-0.5 text-xs text-muted truncate">{speaker.title}, {speaker.org}</p>
                        <p className="mt-2 text-xs text-bronze leading-relaxed line-clamp-2">&ldquo;{speaker.topic}&rdquo;</p>
                      </div>
                    </Panel>
                  </MotionShell>
                ))}
              </div>
            </section>
          )}

          {/* ── SPONSORS ──────────────────────────────────────── */}
          <section id="sponsors" className="mt-24">
            <MotionShell>
              <h2 className="text-4xl font-semibold tracking-[-0.03em] md:text-5xl">Sponsors</h2>
              <p className="mt-3 text-muted">
                The partners and communities making {event.title} possible.
              </p>
            </MotionShell>
            <div className="mt-8 space-y-6">
              {sponsors.map((tier, ti) => {
                const style = tierStyles[tier.tier] ?? tierStyles.Silver;
                return (
                  <MotionShell key={tier.tier} delay={ti * 0.06}>
                    <div>
                      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted">{tier.tier} {tier.tier === "Community" ? "Partners" : "Sponsor" + (tier.names.length > 1 ? "s" : "")}</p>
                      <div className={`flex flex-wrap gap-3 ${tier.tier === "Title" ? "" : ""}`}>
                        {tier.names.map((name) => (
                          <div
                            key={name}
                            className={`inline-flex items-center gap-2 rounded-xl border px-5 py-3 ${style.bg} ${style.border} ${style.text} ${style.size}`}
                          >
                            <Gift className={`size-4 ${tier.tier === "Title" ? "text-bronze" : "text-muted"}`} />
                            {name}
                          </div>
                        ))}
                      </div>
                    </div>
                  </MotionShell>
                );
              })}
            </div>
          </section>

          {/* ── PRIZES ────────────────────────────────────────── */}
          <section id="prizes" className="mt-24">
            <MotionShell>
              <h2 className="text-4xl font-semibold tracking-[-0.03em] md:text-5xl">Prizes</h2>
            </MotionShell>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {prizes.map((prize, i) => {
                const Icon = prize.icon;
                const isGrand = i === 0;
                return (
                  <MotionShell key={prize.place} delay={i * 0.06}>
                    <Panel className={`relative overflow-hidden p-6 ${isGrand ? "sm:col-span-2 lg:col-span-1 border-bronze/30" : ""}`}>
                      {isGrand && (
                        <div className="absolute inset-0 bg-gradient-to-br from-bronze/10 via-transparent to-transparent" />
                      )}
                      <div className="relative">
                        <div className={`grid size-10 place-items-center rounded-lg ${isGrand ? "bg-bronze/20" : "bg-white/[0.06]"}`}>
                          <Icon className={`size-5 ${isGrand ? "text-bronze" : "text-steel"}`} />
                        </div>
                        <p className="mt-4 text-xs font-medium uppercase tracking-widest text-muted">{prize.place}</p>
                        <p className={`mt-1 font-semibold tracking-tight ${isGrand ? "text-3xl text-bronze" : "text-2xl text-foreground"}`}>
                          {prize.amount}
                        </p>
                        <p className="mt-3 text-xs leading-relaxed text-muted">{prize.extras}</p>
                      </div>
                    </Panel>
                  </MotionShell>
                );
              })}
            </div>
            <MotionShell delay={0.3}>
              <Panel className="mt-4 p-5">
                <p className="text-sm text-muted">
                  <span className="text-foreground font-medium">All participants</span> receive a Convoke Premium membership (3 months), certificate of participation, and access to event recordings.
                </p>
              </Panel>
            </MotionShell>
          </section>

          {/* ── FAQS ──────────────────────────────────────────── */}
          <section id="faqs" className="mt-24">
            <MotionShell>
              <h2 className="text-4xl font-semibold tracking-[-0.03em] md:text-5xl">FAQs</h2>
            </MotionShell>
            <MotionShell delay={0.08}>
              <div className="mt-8">
                <FAQSection faqs={faqs} />
              </div>
            </MotionShell>
          </section>

          {/* ── GALLERY ───────────────────────────────────────── */}
          <section id="gallery" className="mt-24">
            <MotionShell>
              <div className="flex items-center gap-3">
                <h2 className="text-4xl font-semibold tracking-[-0.03em] md:text-5xl">Gallery</h2>
                <span className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1 text-xs text-muted">
                  <ImageIcon className="size-3" />
                  {gallery.length} photos
                </span>
              </div>
            </MotionShell>
            <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
              {gallery.map((src, i) => (
                <MotionShell key={i} delay={i * 0.05}>
                  <div className={`group relative overflow-hidden rounded-xl border border-line ${i === 0 ? "col-span-2 row-span-2 h-[300px] md:h-[420px]" : "h-[180px] md:h-[200px]"}`}>
                    <Image
                      src={src}
                      alt={`${event.title} gallery photo ${i + 1}`}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 transition group-hover:opacity-100" />
                  </div>
                </MotionShell>
              ))}
            </div>
          </section>

          {/* ── BOTTOM CTA ────────────────────────────────────── */}
          <MotionShell>
            <Panel className="mt-24 overflow-hidden">
              <div className="relative px-6 py-12 text-center md:px-12 md:py-16">
                <div className="absolute inset-0 bg-gradient-to-br from-bronze/10 via-transparent to-rust/10" />
                <div className="relative">
                  <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                    Ready to join {event.title}?
                  </h2>
                  <p className="mx-auto mt-3 max-w-md text-muted">
                    {event.attendees.toLocaleString("en-IN")} builders are already in. {spotsLeft} spots remaining.
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <ButtonLink href="/auth/sign-in">
                      Register now — {event.price ? formatInr(event.price) : "Free"}
                    </ButtonLink>
                    <ButtonLink href={`/communities/${event.organizerSlug}`} variant="secondary">
                      Visit {event.organizer}
                    </ButtonLink>
                  </div>
                </div>
              </div>
            </Panel>
          </MotionShell>
        </div>
      </main>
      <Footer />
    </>
  );
}
