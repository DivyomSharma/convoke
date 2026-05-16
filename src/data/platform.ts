import {
  BadgeCheck,
  Boxes,
  CalendarDays,
  Handshake,
  Megaphone,
  QrCode,
  Shirt,
  Sparkles,
  Users,
  Workflow,
} from "lucide-react";

export const categories = [
  "Hackathons",
  "Gaming",
  "Startups",
  "NGOs",
  "College",
  "School",
  "Corporate",
  "MUNs",
  "Creator",
  "Workshops",
  "Esports",
];

export const featuredEvents = [
  {
    slug: "summit-zero",
    title: "Summit Zero",
    tagline: "Founders, builders, and campus startup crews under one roof.",
    city: "Bengaluru",
    date: "Aug 24, 2026",
    category: "Startups",
    price: 1499,
    mode: "Offline",
    organizer: "PlotArmour Studio",
    attendees: 820,
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=85",
    palette: "from-rust/65 via-black/20 to-steel/35",
  },
  {
    slug: "campus-protocol",
    title: "Campus Protocol",
    tagline: "A weekend for societies, artists, makers, and student leaders.",
    city: "Delhi NCR",
    date: "Sep 12, 2026",
    category: "College",
    price: 0,
    mode: "Hybrid",
    organizer: "North Grid Societies",
    attendees: 2400,
    image:
      "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=85",
    palette: "from-bronze/60 via-black/15 to-rust/35",
  },
  {
    slug: "forge-hack",
    title: "Forge Hack",
    tagline: "Hack, ship, pitch, and meet the people building what comes next.",
    city: "Pune",
    date: "Oct 03, 2026",
    category: "Hackathons",
    price: 499,
    mode: "Offline",
    organizer: "Convoke Labs",
    attendees: 1200,
    image:
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=85",
    palette: "from-steel/55 via-black/20 to-bronze/35",
  },
];

export const platformModules = [
  {
    icon: CalendarDays,
    title: "Events",
    description:
      "Registrations, ticketing, waitlists, schedules, galleries, certificates, and QR check-ins.",
  },
  {
    icon: Handshake,
    title: "Sponsor Pipeline",
    description:
      "Warm outreach, sponsor conversations, decks, replies, and partnership momentum.",
  },
  {
    icon: Shirt,
    title: "Merch Drops",
    description:
      "Apparel planning, creator drops, sponsor kits, quote requests, and WhatsApp handoff.",
  },
  {
    icon: Users,
    title: "Communities",
    description:
      "Profiles, members, reputation, hosted events, media, socials, and community spaces.",
  },
  {
    icon: Workflow,
    title: "Collaboration",
    description:
      "Teams, volunteer approvals, shared tasks, invites, and clear ownership for the people making it happen.",
  },
  {
    icon: BadgeCheck,
    title: "Identity",
    description:
      "LinkedIn-style profiles with Discord, GitHub, socials, badges, analytics, and event history.",
  },
];

export const dashboardStats = [
  ["People joining", "3,842", "+18.4%"],
  ["Sponsor chats", "42", "7 warm replies"],
  ["Volunteer energy", "1,260 hrs", "94 approved"],
  ["Merch plans", "23", "₹7.2L est."],
];

export const sponsorPipeline = [
  ["Prospecting", "48", "Steel Blue"],
  ["Contacted", "31", "Bronze"],
  ["Replied", "14", "Rust"],
  ["Negotiating", "8", "Graphite"],
  ["Confirmed", "5", "Gold"],
];

export const merchProducts = [
  "Oversized tees",
  "Hoodies",
  "Jerseys",
  "Startup kits",
  "Sponsor kits",
  "Lanyards",
  "Stickers",
  "Tote bags",
  "Caps",
  "Swag boxes",
];

export const roles = [
  "Owner",
  "Admin",
  "Sponsorship Lead",
  "Volunteer Lead",
  "Design Lead",
  "Operations",
  "Finance",
  "Community Lead",
];

export const workflowCards = [
  { icon: Megaphone, label: "Sponsor notes", value: "12 templates" },
  { icon: QrCode, label: "Entry flow", value: "Mobile QR" },
  { icon: Boxes, label: "Merch CRM", value: "6 statuses" },
  { icon: Sparkles, label: "Creator support", value: "Studio linked" },
];

export const communityMoments = [
  {
    title: "Campus nights",
    copy: "Societies, artists, founders, and volunteers turning a week on campus into something people remember.",
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Build weekends",
    copy: "Hackathons and startup communities with the right mix of pressure, friends, mentors, and momentum.",
    image:
      "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Creator circles",
    copy: "Drops, workshops, screenings, meetups, and launches designed around people, not admin work.",
    image:
      "https://images.unsplash.com/photo-1528605105345-5344ea20e269?auto=format&fit=crop&w=1000&q=85",
  },
];

export const activityFeed = [
  ["Maya", "added 18 volunteers to check-in crew", "4 min"],
  ["Aarav", "shared a sponsor deck with Zephyr Labs", "12 min"],
  ["Naina", "uploaded hoodie references for the merch drop", "28 min"],
  ["Kabir", "approved 42 students from the waitlist", "1 hr"],
];
