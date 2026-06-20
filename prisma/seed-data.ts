import { photos, portraits } from "../src/lib/photos";

export type FeedKind =
  | "event"
  | "role"
  | "hackathon"
  | "project"
  | "space"
  | "drop"
  | "vouch"
  | "launch"
  | "office-hours";

export interface Person {
  handle: string;
  name: string;
  role: string;
  city: string;
  avatar: string;
}

export const people: Person[] = [
  { handle: "ananya", name: "Ananya Rao", role: "Founder, Lumen Labs", city: "Bangalore", avatar: portraits[1] },
  { handle: "marcus", name: "Marcus Hill", role: "ML researcher", city: "Brooklyn", avatar: portraits[2] },
  { handle: "kenji", name: "Kenji Watanabe", role: "Designer & builder", city: "Berlin", avatar: portraits[3] },
  { handle: "leo", name: "Leo Carrillo", role: "CS undergrad, MIT", city: "Cambridge", avatar: portraits[0] },
];

export interface Space {
  slug: string;
  name: string;
  tagline: string;
  members: number;
  cover: string;
  category: string;
}

export const spaces: Space[] = [
  { slug: "early-builders", name: "Early Builders", tagline: "Founders before product–market fit.", members: 1248, cover: photos.coworking, category: "Founders" },
  { slug: "research-collective", name: "Research Collective", tagline: "Papers, critiques, weekly readings.", members: 612, cover: photos.whiteboard, category: "Research" },
  { slug: "campus-makers", name: "Campus Makers", tagline: "Students shipping side projects.", members: 3104, cover: photos.hackathon, category: "Students" },
  { slug: "design-room", name: "The Design Room", tagline: "Crit nights for product designers.", members: 882, cover: photos.coffee, category: "Design" },
  { slug: "ai-tinkerers", name: "AI Tinkerers", tagline: "Weekend builds with frontier models.", members: 2240, cover: photos.code, category: "AI" },
  { slug: "open-source-sundays", name: "Open Source Sundays", tagline: "Maintainers and first-time contributors.", members: 1490, cover: photos.demoday, category: "Engineering" },
];

export interface Opportunity {
  id: string;
  title: string;
  org: string;
  location: string;
  comp: string;
  type: "Role" | "Fellowship" | "Grant" | "Hackathon";
  deadline: string;
  tags: string[];
}

export const opportunities: Opportunity[] = [
  { id: "r-1", title: "Founding engineer", org: "Lumen Labs", location: "SF · onsite", comp: "$160–200k + 1.5%", type: "Role", deadline: "Rolling", tags: ["TypeScript", "Postgres", "0→1"] },
  { id: "r-2", title: "Design engineer, web", org: "Arc", location: "Remote", comp: "$140–180k", type: "Role", deadline: "Mar 14", tags: ["React", "Motion", "Craft"] },
  { id: "f-1", title: "Winter research fellowship", org: "Sequoia Lab", location: "Remote · 12 weeks", comp: "$15k stipend", type: "Fellowship", deadline: "Feb 28", tags: ["LLMs", "Eval"] },
  { id: "h-1", title: "Bay Area hardware jam", org: "Hack Club", location: "Berkeley · 48h", comp: "$10k prize pool", type: "Hackathon", deadline: "Apr 4", tags: ["Hardware", "Demo"] },
  { id: "g-1", title: "Open source maintainer grant", org: "Convoke Fund", location: "Worldwide", comp: "$5–25k", type: "Grant", deadline: "Apr 20", tags: ["OSS"] },
  { id: "r-3", title: "ML research engineer", org: "Periphery", location: "London · hybrid", comp: "£90–130k", type: "Role", deadline: "Mar 30", tags: ["PyTorch", "Distributed"] },
];

export interface Event {
  id: string;
  title: string;
  host: string;
  when: string;
  city: string;
  cover: string;
  going: number;
  kind: "Meetup" | "Hackathon" | "Office hours" | "Talk" | "Demo day";
}

export const events: Event[] = [
  { id: "e-1", title: "Founders before product", host: "Early Builders", when: "Tonight · 7:00 PM", city: "San Francisco", cover: photos.meetup, going: 84, kind: "Meetup" },
  { id: "e-2", title: "Crit night: shipped this week", host: "The Design Room", when: "Thu · 6:30 PM", city: "Brooklyn", cover: photos.coffee, going: 42, kind: "Meetup" },
  { id: "e-3", title: "48h: build with on-device models", host: "AI Tinkerers", when: "Mar 22–24", city: "Berlin", cover: photos.code, going: 311, kind: "Hackathon" },
  { id: "e-4", title: "Office hours w/ Ananya Rao", host: "Lumen Labs", when: "Fri · 4:00 PM", city: "Online", cover: photos.pitch, going: 28, kind: "Office hours" },
  { id: "e-5", title: "Campus Makers demo day", host: "Campus Makers", when: "Apr 6 · 5:00 PM", city: "MIT, Cambridge", cover: photos.demoday, going: 612, kind: "Demo day" },
  { id: "e-6", title: "Reading: Mamba & friends", host: "Research Collective", when: "Sun · 11:00 AM", city: "Online", cover: photos.whiteboard, going: 96, kind: "Talk" },
];

export interface FeedItem {
  id: string;
  kind: FeedKind;
  who: Person;
  at: string;
  title: string;
  body?: string;
  cover?: string;
  meta?: string;
}

export const feed: FeedItem[] = [
  { id: "f1", kind: "launch", who: people[0], at: "12m", title: "Launched Lumen — calm tools for solo founders.", body: "Eight months of nights and weekends. First 100 users get free lifetime.", cover: photos.pitch, meta: "lumen.so" },
  { id: "f2", kind: "event",  who: people[3], at: "1h",  title: "Tonight — Founders before product-market fit", body: "84 going · The Mint Building, SF", cover: photos.meetup, meta: "RSVP" },
  { id: "f3", kind: "project", who: people[2], at: "2h", title: "Open-sourced our typography tooling.", body: "Variable axes, OT features, kerning helpers — all in 4kb.", meta: "github.com/kenji/typeset" },
  { id: "f4", kind: "role", who: people[0], at: "3h", title: "Hiring: Founding engineer at Lumen Labs", body: "SF · onsite · $160–200k + 1.5%. Looking for someone who's shipped 0→1." },
  { id: "f5", kind: "vouch", who: people[1], at: "4h", title: "Vouching for Leo Carrillo — sharp, kind, ships.", body: "Worked together on the Mamba reading group. He carries rooms." },
  { id: "f6", kind: "hackathon", who: people[2], at: "6h", title: "48h jam — on-device models in Berlin", body: "Mar 22–24 · $10k pool · 311 builders going.", cover: photos.code },
  { id: "f7", kind: "drop", who: people[1], at: "9h", title: "New paper: Latency-aware MoE routing", body: "Trained 7B with 35% lower p99. Comments welcome.", meta: "arxiv 2403.10412" },
  { id: "f8", kind: "office-hours", who: people[0], at: "12h", title: "Office hours Friday — pricing for solo founders", body: "30-minute slots. First come, first served." },
  { id: "f9", kind: "space", who: people[3], at: "1d", title: "Joined Campus Makers", body: "3,104 students shipping side projects. Come build with us.", cover: photos.hackathon },
];

export const orgs = [
  { slug: "lumen-labs", name: "Lumen Labs", kind: "Startup", members: 11, since: "2024" },
  { slug: "hack-club", name: "Hack Club", kind: "Community", members: 48201, since: "2014" },
  { slug: "sequoia-lab", name: "Sequoia Lab", kind: "Research", members: 32, since: "2022" },
];
