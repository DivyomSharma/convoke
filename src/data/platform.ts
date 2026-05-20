// ─── CONVOKE ECOSYSTEM SEED DATA ────────────────────────────────────────────
// This file is the single source of truth for all demo content that makes
// Convoke feel like a living, breathing ecosystem on day one.

import {
  BadgeCheck, Boxes, CalendarDays, Handshake, Megaphone, QrCode,
  Shirt, Sparkles, Users, Workflow,
} from "lucide-react";

// ─── CATEGORIES ─────────────────────────────────────────────────────────────

export const categories = [
  "Hackathons", "Gaming", "Startups", "NGOs", "College", "School",
  "Corporate", "MUNs", "Creator", "Workshops", "Esports", "AI/ML",
  "Design", "Open Source", "Social Impact",
];

// ─── FEATURED EVENTS ────────────────────────────────────────────────────────

export const featuredEvents = [
  {
    slug: "summit-zero",
    title: "Summit Zero",
    tagline: "Founders, builders, and campus startup crews under one roof.",
    city: "Bengaluru",
    date: "Aug 24, 2026",
    category: "Startups",
    price: 1499,
    mode: "Offline" as const,
    organizer: "PlotArmour Studio",
    organizerSlug: "plotarmour-studio",
    attendees: 820,
    volunteers: 45,
    speakers: 12,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=85",
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
    mode: "Hybrid" as const,
    organizer: "North Grid Societies",
    organizerSlug: "north-grid",
    attendees: 2400,
    volunteers: 120,
    speakers: 8,
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=1200&q=85",
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
    mode: "Offline" as const,
    organizer: "Convoke Labs",
    organizerSlug: "convoke-labs",
    attendees: 1200,
    volunteers: 65,
    speakers: 6,
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=85",
    palette: "from-steel/55 via-black/20 to-bronze/35",
  },
  {
    slug: "creator-con",
    title: "Creator Con",
    tagline: "Where YouTube, design, music, and brand culture collide.",
    city: "Mumbai",
    date: "Nov 18, 2026",
    category: "Creator",
    price: 999,
    mode: "Offline" as const,
    organizer: "The Creator Collective",
    organizerSlug: "creator-collective",
    attendees: 1800,
    volunteers: 80,
    speakers: 15,
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=85",
    palette: "from-bronze/60 via-black/15 to-steel/40",
  },
  {
    slug: "neural-nights",
    title: "Neural Nights",
    tagline: "48 hours of AI hacking, open models, and GPU-powered chaos.",
    city: "Hyderabad",
    date: "Sep 28, 2026",
    category: "AI/ML",
    price: 299,
    mode: "Offline" as const,
    organizer: "DeepMind Campus",
    organizerSlug: "deepmind-campus",
    attendees: 600,
    volunteers: 30,
    speakers: 10,
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=85",
    palette: "from-steel/60 via-black/20 to-rust/30",
  },
  {
    slug: "design-sprint-delhi",
    title: "Design Sprint Delhi",
    tagline: "UX research, rapid prototyping, and portfolio reviews with top studios.",
    city: "Delhi NCR",
    date: "Oct 22, 2026",
    category: "Design",
    price: 0,
    mode: "Hybrid" as const,
    organizer: "Pixel Society",
    organizerSlug: "pixel-society",
    attendees: 450,
    volunteers: 20,
    speakers: 8,
    image: "https://images.unsplash.com/photo-1528605105345-5344ea20e269?auto=format&fit=crop&w=1200&q=85",
    palette: "from-rust/50 via-black/20 to-bronze/35",
  },
  {
    slug: "open-source-saturday",
    title: "Open Source Saturday",
    tagline: "Contribute, review, merge. Every Saturday, real PRs to real repos.",
    city: "Bengaluru",
    date: "Every Saturday",
    category: "Open Source",
    price: 0,
    mode: "Hybrid" as const,
    organizer: "FOSS United",
    organizerSlug: "foss-united",
    attendees: 200,
    volunteers: 10,
    speakers: 4,
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=85",
    palette: "from-bronze/45 via-black/20 to-steel/30",
  },
  {
    slug: "esports-arena-cup",
    title: "Esports Arena Cup",
    tagline: "Valorant, CS2, and League tournaments with ₹10L in prizes.",
    city: "Chennai",
    date: "Dec 05, 2026",
    category: "Esports",
    price: 199,
    mode: "Offline" as const,
    organizer: "Arena Esports",
    organizerSlug: "arena-esports",
    attendees: 3200,
    volunteers: 90,
    speakers: 0,
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=85",
    palette: "from-steel/55 via-black/25 to-rust/35",
  },
];

// ─── COMMUNITIES ────────────────────────────────────────────────────────────

export const communities = [
  {
    slug: "north-grid",
    name: "North Grid Societies",
    tagline: "Delhi's premier student collective across 15+ colleges.",
    location: "Delhi NCR",
    members: 12400,
    eventsPerYear: 200,
    tags: ["Technology", "Entrepreneurship", "Arts & Culture", "Social Impact"],
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=600&q=85",
  },
  {
    slug: "convoke-labs",
    name: "Convoke Labs",
    tagline: "Shipping products, running hackathons, mentoring builders.",
    location: "Pune",
    members: 3200,
    eventsPerYear: 48,
    tags: ["Hackathons", "Startups", "Product", "Engineering"],
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=85",
  },
  {
    slug: "creator-collective",
    name: "The Creator Collective",
    tagline: "YouTubers, designers, musicians, and brand builders in one room.",
    location: "Mumbai",
    members: 5600,
    eventsPerYear: 36,
    tags: ["Creator", "Design", "Media", "Branding"],
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=600&q=85",
  },
  {
    slug: "deepmind-campus",
    name: "DeepMind Campus",
    tagline: "AI researchers, ML engineers, and GPU nerds building the future.",
    location: "Hyderabad",
    members: 2800,
    eventsPerYear: 24,
    tags: ["AI/ML", "Research", "Deep Learning", "Open Source"],
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=600&q=85",
  },
  {
    slug: "foss-united",
    name: "FOSS United",
    tagline: "Open source contributors shipping real code every weekend.",
    location: "Bengaluru",
    members: 4200,
    eventsPerYear: 52,
    tags: ["Open Source", "Linux", "DevOps", "Community"],
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=85",
  },
  {
    slug: "pixel-society",
    name: "Pixel Society",
    tagline: "UX researchers, visual designers, and interaction thinkers.",
    location: "Delhi NCR",
    members: 1900,
    eventsPerYear: 18,
    tags: ["Design", "UX Research", "Figma", "Product Design"],
    image: "https://images.unsplash.com/photo-1528605105345-5344ea20e269?auto=format&fit=crop&w=600&q=85",
  },
  {
    slug: "arena-esports",
    name: "Arena Esports",
    tagline: "Tournament organizers and competitive gaming culture.",
    location: "Chennai",
    members: 8900,
    eventsPerYear: 40,
    tags: ["Esports", "Gaming", "Valorant", "Tournaments"],
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=85",
  },
  {
    slug: "plotarmour-studio",
    name: "PlotArmour Studio",
    tagline: "Design, dev, merch, and growth support for ambitious builders.",
    location: "Pan-India",
    members: 720,
    eventsPerYear: 12,
    tags: ["Startups", "Branding", "Growth", "Merch"],
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=85",
  },
];

// ─── OPPORTUNITIES ──────────────────────────────────────────────────────────

export type OpportunityData = {
  id: string;
  title: string;
  organization: string;
  organizationSlug: string;
  type: "Internship" | "Full-time" | "Freelance" | "Volunteer" | "Ambassador" | "Hackathon Team";
  location: string;
  isRemote: boolean;
  stipend: string | null;
  deadline: string;
  description: string;
  skills: string[];
  applicants: number;
  postedAgo: string;
};

export const opportunities: OpportunityData[] = [
  {
    id: "opp-1",
    title: "Frontend Engineering Intern",
    organization: "PlotArmour Studio",
    organizationSlug: "plotarmour-studio",
    type: "Internship",
    location: "Remote",
    isRemote: true,
    stipend: "₹25,000/month",
    deadline: "Aug 30, 2026",
    description: "Build premium React/Next.js interfaces for startup clients. Work directly with the founding team on Convoke, merch portals, and studio projects.",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
    applicants: 142,
    postedAgo: "2 days ago",
  },
  {
    id: "opp-2",
    title: "Community Manager — Campus Operations",
    organization: "North Grid Societies",
    organizationSlug: "north-grid",
    type: "Internship",
    location: "Delhi NCR",
    isRemote: false,
    stipend: "₹15,000/month",
    deadline: "Sep 15, 2026",
    description: "Lead community operations across 15 Delhi colleges. Coordinate events, manage volunteer pipelines, and grow the North Grid brand on campus.",
    skills: ["Community Building", "Event Management", "Social Media", "Leadership"],
    applicants: 89,
    postedAgo: "5 days ago",
  },
  {
    id: "opp-3",
    title: "AI/ML Research Intern",
    organization: "DeepMind Campus",
    organizationSlug: "deepmind-campus",
    type: "Internship",
    location: "Hyderabad",
    isRemote: false,
    stipend: "₹35,000/month",
    deadline: "Sep 20, 2026",
    description: "Work on open-source ML projects, contribute to research papers, and help organize Neural Nights hackathons.",
    skills: ["Python", "PyTorch", "TensorFlow", "Research", "NLP"],
    applicants: 234,
    postedAgo: "1 day ago",
  },
  {
    id: "opp-4",
    title: "Campus Ambassador — Convoke",
    organization: "Convoke Labs",
    organizationSlug: "convoke-labs",
    type: "Ambassador",
    location: "Pan-India",
    isRemote: true,
    stipend: null,
    deadline: "Oct 01, 2026",
    description: "Represent Convoke at your college. Organize local meetups, recruit communities, and earn exclusive merch, event passes, and platform credits.",
    skills: ["Networking", "Public Speaking", "Social Media", "Event Planning"],
    applicants: 567,
    postedAgo: "3 days ago",
  },
  {
    id: "opp-5",
    title: "Graphic Designer — Event Posters & Merch",
    organization: "The Creator Collective",
    organizationSlug: "creator-collective",
    type: "Freelance",
    location: "Remote",
    isRemote: true,
    stipend: "₹8,000–₹15,000 per project",
    deadline: "Rolling",
    description: "Design event posters, social media creatives, and merch mockups for Creator Con and monthly creator meetups in Mumbai.",
    skills: ["Figma", "Photoshop", "Illustration", "Brand Design"],
    applicants: 76,
    postedAgo: "1 week ago",
  },
  {
    id: "opp-6",
    title: "Backend Engineer — Event Infrastructure",
    organization: "Convoke Labs",
    organizationSlug: "convoke-labs",
    type: "Full-time",
    location: "Pune",
    isRemote: false,
    stipend: "₹8–12 LPA",
    deadline: "Sep 30, 2026",
    description: "Build scalable event registration, ticketing, and QR check-in systems. Own the API layer that powers thousands of community events.",
    skills: ["Node.js", "PostgreSQL", "Redis", "Docker", "TypeScript"],
    applicants: 198,
    postedAgo: "4 days ago",
  },
  {
    id: "opp-7",
    title: "Volunteer Coordinator — Forge Hack",
    organization: "Convoke Labs",
    organizationSlug: "convoke-labs",
    type: "Volunteer",
    location: "Pune",
    isRemote: false,
    stipend: null,
    deadline: "Sep 25, 2026",
    description: "Coordinate 65 volunteers for check-in, logistics, judging, and social media during Forge Hack weekend. Free merch + certificate included.",
    skills: ["Team Management", "Communication", "Problem Solving"],
    applicants: 43,
    postedAgo: "6 days ago",
  },
  {
    id: "opp-8",
    title: "Esports Tournament Organizer",
    organization: "Arena Esports",
    organizationSlug: "arena-esports",
    type: "Internship",
    location: "Chennai",
    isRemote: false,
    stipend: "₹18,000/month",
    deadline: "Nov 01, 2026",
    description: "Plan and execute competitive gaming tournaments with 3000+ participants. Manage brackets, streaming, and sponsor activations.",
    skills: ["Event Production", "Gaming", "Streaming", "Sponsorships"],
    applicants: 112,
    postedAgo: "3 days ago",
  },
  {
    id: "opp-9",
    title: "Open Source Maintainer — DevTools",
    organization: "FOSS United",
    organizationSlug: "foss-united",
    type: "Volunteer",
    location: "Remote",
    isRemote: true,
    stipend: null,
    deadline: "Open",
    description: "Maintain popular open-source developer tools. Review PRs, mentor new contributors, and represent the project at meetups.",
    skills: ["Git", "Go", "Rust", "Code Review", "Documentation"],
    applicants: 31,
    postedAgo: "2 weeks ago",
  },
  {
    id: "opp-10",
    title: "UX Research Intern",
    organization: "Pixel Society",
    organizationSlug: "pixel-society",
    type: "Internship",
    location: "Delhi NCR",
    isRemote: false,
    stipend: "₹20,000/month",
    deadline: "Oct 15, 2026",
    description: "Conduct user research, usability testing, and design audits for Design Sprint Delhi sponsors. Build a portfolio of real case studies.",
    skills: ["User Research", "Usability Testing", "Figma", "Data Analysis"],
    applicants: 67,
    postedAgo: "1 week ago",
  },
  {
    id: "opp-11",
    title: "Content Writer — Startup Stories",
    organization: "PlotArmour Studio",
    organizationSlug: "plotarmour-studio",
    type: "Freelance",
    location: "Remote",
    isRemote: true,
    stipend: "₹3,000–₹5,000 per article",
    deadline: "Rolling",
    description: "Write compelling founder stories, community spotlights, and ecosystem updates for the Convoke blog and PlotArmour newsletter.",
    skills: ["Writing", "SEO", "Storytelling", "Research"],
    applicants: 54,
    postedAgo: "4 days ago",
  },
  {
    id: "opp-12",
    title: "Sponsorship Lead — Campus Protocol",
    organization: "North Grid Societies",
    organizationSlug: "north-grid",
    type: "Volunteer",
    location: "Delhi NCR",
    isRemote: false,
    stipend: null,
    deadline: "Aug 20, 2026",
    description: "Lead sponsor outreach for Campus Protocol 2026. Pitch to 50+ brands, negotiate deals, and manage the sponsor experience on-ground.",
    skills: ["Sales", "Negotiation", "Pitching", "Relationship Management"],
    applicants: 28,
    postedAgo: "1 day ago",
  },
];

// ─── SEED USERS / PEOPLE ────────────────────────────────────────────────────

export const seedPeople = [
  { name: "Arya Sen", initials: "AS", role: "Founder & Community Builder", community: "Convoke Labs" },
  { name: "Maya Krishnan", initials: "MK", role: "Volunteer Lead", community: "North Grid Societies" },
  { name: "Aarav Mehta", initials: "AM", role: "Robotics Club Lead", community: "IIT Delhi" },
  { name: "Naina Kapoor", initials: "NK", role: "Design Lead", community: "Pixel Society" },
  { name: "Kabir Singh", initials: "KS", role: "Hackathon Organizer", community: "Convoke Labs" },
  { name: "Sneha Reddy", initials: "SR", role: "DevRel Lead", community: "FOSS United" },
  { name: "Rohan Desai", initials: "RD", role: "Esports Captain", community: "Arena Esports" },
  { name: "Priya Sharma", initials: "PS", role: "Content Creator", community: "Creator Collective" },
  { name: "Vikram Joshi", initials: "VJ", role: "AI Researcher", community: "DeepMind Campus" },
  { name: "Ananya Iyer", initials: "AI", role: "Social Impact Lead", community: "North Grid" },
  { name: "Dev Patel", initials: "DP", role: "Full-Stack Dev", community: "PlotArmour Studio" },
  { name: "Ishita Gupta", initials: "IG", role: "UX Researcher", community: "Pixel Society" },
  { name: "Rahul Verma", initials: "RV", role: "Open Source Contributor", community: "FOSS United" },
  { name: "Meera Nair", initials: "MN", role: "Event Producer", community: "Creator Collective" },
  { name: "Aditya Kumar", initials: "AK", role: "Campus Ambassador", community: "Convoke" },
];

// ─── PLATFORM MODULES ───────────────────────────────────────────────────────

export const platformModules = [
  { icon: CalendarDays, title: "Events", description: "Registrations, ticketing, waitlists, schedules, galleries, certificates, and QR check-ins." },
  { icon: Handshake, title: "Sponsor Pipeline", description: "Warm outreach, sponsor conversations, decks, replies, and partnership momentum." },
  { icon: Shirt, title: "Merch Drops", description: "Apparel planning, creator drops, sponsor kits, quote requests, and WhatsApp handoff." },
  { icon: Users, title: "Communities", description: "Profiles, members, reputation, hosted events, media, socials, and community spaces." },
  { icon: Workflow, title: "Collaboration", description: "Teams, volunteer approvals, shared tasks, invites, and clear ownership for the people making it happen." },
  { icon: BadgeCheck, title: "Identity", description: "LinkedIn-style profiles with Discord, GitHub, socials, badges, analytics, and event history." },
];

// ─── DASHBOARD STATS ────────────────────────────────────────────────────────

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
  "Oversized tees", "Hoodies", "Jerseys", "Startup kits", "Sponsor kits",
  "Lanyards", "Stickers", "Tote bags", "Caps", "Swag boxes",
];

export const roles = [
  "Owner", "Admin", "Sponsorship Lead", "Volunteer Lead",
  "Design Lead", "Operations", "Finance", "Community Lead",
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
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Build weekends",
    copy: "Hackathons and startup communities with the right mix of pressure, friends, mentors, and momentum.",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=85",
  },
  {
    title: "Creator circles",
    copy: "Drops, workshops, screenings, meetups, and launches designed around people, not admin work.",
    image: "https://images.unsplash.com/photo-1528605105345-5344ea20e269?auto=format&fit=crop&w=1000&q=85",
  },
];

export const activityFeed = [
  ["Maya", "added 18 volunteers to check-in crew", "4 min"],
  ["Aarav", "shared a sponsor deck with Zephyr Labs", "12 min"],
  ["Naina", "uploaded hoodie references for the merch drop", "28 min"],
  ["Kabir", "approved 42 students from the waitlist", "1 hr"],
  ["Sneha", "merged 3 PRs for the event registration API", "2 hr"],
  ["Rohan", "set up Valorant tournament brackets for 128 teams", "3 hr"],
];

// ─── TRENDING DATA ──────────────────────────────────────────────────────────

export const trendingNow = [
  { label: "Forge Hack registrations", value: "+340 this week", trend: "up" },
  { label: "Neural Nights applications", value: "234 applied", trend: "up" },
  { label: "Campus Ambassador signups", value: "567 across 45 cities", trend: "up" },
  { label: "Creator Con early bird", value: "Sold out in 2 days", trend: "up" },
];

// ─── OPPORTUNITY TYPE COLORS ────────────────────────────────────────────────

export const opportunityTypeColors: Record<string, string> = {
  "Internship": "bg-bronze/15 text-bronze border-bronze/30",
  "Full-time": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "Freelance": "bg-violet-500/15 text-violet-400 border-violet-500/30",
  "Volunteer": "bg-steel/15 text-steel border-steel/30",
  "Ambassador": "bg-rust/15 text-rust border-rust/30",
  "Hackathon Team": "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
};
