import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BadgeCheck, BarChart3, Camera, Code2, Link2, Trophy, Users, Workflow, CalendarDays } from "lucide-react";
import { Footer } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Panel } from "@/components/ui/panel";
import { seedPeople } from "@/data/platform";

type PageProps = {
  params: Promise<{ username: string }>;
};

// Generate slugs for seed people
function generateUsername(name: string) {
  return name.toLowerCase().replace(/\s+/g, "");
}

export async function generateStaticParams() {
  return seedPeople.map((p) => ({
    username: generateUsername(p.name),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const person = seedPeople.find(p => generateUsername(p.name) === username);
  
  if (!person) {
    return {
      title: "User Not Found — Convoke",
      description: "Profile not found.",
    };
  }

  return {
    title: `${person.name} (@${username}) — Convoke`,
    description: `Convoke community reputation profile for ${person.name}. ${person.role}.`,
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;
  const person = seedPeople.find(p => generateUsername(p.name) === username);

  if (!person) {
    notFound();
  }

  const socials = [Link2, Code2, Camera, BadgeCheck];

  return (
    <>
      <SiteHeader />
      <main className="px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          <Panel className="overflow-hidden">
            <div className="h-56 bg-[radial-gradient(circle_at_25%_20%,rgba(198,161,111,0.28),transparent_32%),linear-gradient(135deg,#111,#050505)]" />
            <div className="p-6 md:p-8">
              <div className="-mt-20 size-32 rounded-[8px] border border-bronze/50 bg-gradient-to-br from-bronze via-rust to-steel p-1">
                <div className="grid size-full place-items-center rounded-[6px] bg-black text-5xl font-semibold">
                  {person.initials}
                </div>
              </div>
              <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
                <div>
                  <h1 className="text-5xl font-semibold tracking-[-0.04em]">
                    {person.name}
                  </h1>
                  <p className="mt-2 text-muted">@{username}</p>
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                    {person.role} at {person.community} | Ex-Google Developer Relations | 
                    Building India's nextgen startup ecosystem through Convoke
                  </p>
                  <div className="mt-7 flex gap-3">
                    {socials.map((Icon, index) => (
                      <a
                        key={index}
                        href={[
                          `https://linkedin.com/in/${username}`,
                          `https://github.com/${username}`,
                          `https://instagram.com/${username}_`,
                          `https://youtube.com/@${username}`
                        ][index]}
                        target="_blank"
                        rel="noreferrer"
                        className="grid size-10 place-items-center rounded-full border border-line text-muted hover:text-foreground"
                      >
                        <Icon className="size-4" />
                      </a>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3">
                  {[
                    ["Reputation", (Math.random() * 2 + 8).toFixed(1)],
                    ["Events Organized", Math.floor(Math.random() * 20)],
                    ["Volunteer Hours", Math.floor(Math.random() * 500)],
                    ["Communities Led", Math.floor(Math.random() * 5) + 1],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between rounded-[8px] border border-line bg-black/35 px-4 py-3">
                      <span className="text-sm text-muted">{label}</span>
                      <span className="font-mono text-bronze">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Panel>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {/* Experience Timeline */}
            <Panel key="Experience timeline" className="min-h-52 p-5">
              <Trophy className="size-5 text-rust" />
              <h2 className="mt-8 text-2xl font-medium">Experience timeline</h2>
              <div className="mt-4 space-y-3">
                <div className="border-l-2 border-bronze/20 pl-4">
                  <p className="text-sm text-muted">2026</p>
                  <h3 className="font-medium text-foreground">{person.role}</h3>
                  <p className="text-sm text-muted">{person.community}</p>
                </div>
                <div className="border-l-2 border-bronze/20 pl-4">
                  <p className="text-sm text-muted">2024-2025</p>
                  <h3 className="font-medium text-foreground">Developer Relations Lead</h3>
                  <p className="text-sm text-muted">Google for Startups Accelerator Program</p>
                </div>
                <div className="border-l-2 border-bronze/20 pl-4">
                  <p className="text-sm text-muted">2023</p>
                  <h3 className="font-medium text-foreground">Community Manager</h3>
                  <p className="text-sm text-muted">Zephyr Labs - Grew developer community to 15K+ members</p>
                </div>
              </div>
            </Panel>
            
            {/* Communities */}
            <Panel key="Communities" className="min-h-52 p-5">
              <Users className="size-5 text-rust" />
              <h2 className="mt-8 text-2xl font-medium">Communities</h2>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{person.community}</span>
                  <span className="text-sm text-muted">Core Member</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">North Grid Societies</span>
                  <span className="text-sm text-muted">Advisor</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Women in Tech India</span>
                  <span className="text-sm text-muted">Mentor</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Creator Collective India</span>
                  <span className="text-sm text-muted">Founding Member</span>
                </div>
              </div>
            </Panel>
            
            {/* Events Participated */}
            <Panel key="Events participated" className="min-h-52 p-5">
              <CalendarDays className="size-5 text-rust" />
              <h2 className="mt-8 text-2xl font-medium">Events participated</h2>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Summit Zero 2026</span>
                  <span className="text-sm text-muted">Speaker & Organizer</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Forge Hack 2026</span>
                  <span className="text-sm text-muted">Judge & Mentor</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Campus Protocol 2026</span>
                  <span className="text-sm text-muted">Workshop Facilitator</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Neural Nights 2026</span>
                  <span className="text-sm text-muted">Hacker</span>
                </div>
              </div>
            </Panel>
            
            {/* Projects */}
            <Panel key="Projects" className="min-h-52 p-5">
              <Workflow className="size-5 text-rust" />
              <h2 className="mt-8 text-2xl font-medium">Projects</h2>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Convoke Opportunities Portal</span>
                  <span className="text-sm text-muted">Internship matching platform for students</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-muted">Campus Connect</span>
                  <span className="text-sm text-muted">Networking app for college students</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">OpenSource India</span>
                  <span className="text-sm text-muted">Directory of Indian open source contributors</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">EcoTrack</span>
                  <span className="text-sm text-muted">Carbon footprint tracker for campuses</span>
                </div>
              </div>
            </Panel>
            
            {/* Badges */}
            <Panel key="Badges" className="min-h-52 p-5">
              <BadgeCheck className="size-5 text-rust" />
              <h2 className="mt-8 text-2xl font-medium">Badges</h2>
              <div className="mt-4 grid gap-3">
                <div className="border border-white/[0.08] rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <BadgeCheck className="h-5 w-5 text-bronze" />
                    <div>
                      <h3 className="text-sm font-medium text-foreground">Community Builder</h3>
                      <p className="text-xs text-muted">Built thriving student communities across 10+ cities</p>
                    </div>
                  </div>
                </div>
                <div className="border border-white/[0.08] rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Trophy className="h-5 w-5 text-bronze" />
                    <div>
                      <h3 className="text-sm font-medium text-foreground">Event Excellence</h3>
                      <p className="text-xs text-muted">Organized 5+ successful tech conferences</p>
                    </div>
                  </div>
                </div>
                <div className="border border-white/[0.08] rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <Code2 className="h-5 w-5 text-bronze" />
                    <div>
                      <h3 className="text-sm font-medium text-foreground">Open Source Advocate</h3>
                      <p className="text-xs text-muted">Maintains popular dev tools with 5K+ weekly downloads</p>
                    </div>
                  </div>
                </div>
              </div>
            </Panel>
            
            {/* Analytics */}
            <Panel key="Analytics" className="min-h-52 p-5">
              <BarChart3 className="size-5 text-rust" />
              <h2 className="mt-8 text-2xl font-medium">Analytics</h2>
              <div className="mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Profile Views (Monthly)</span>
                    <span className="text-sm font-mono text-bronze">{(Math.random() * 5 + 1).toFixed(1)}K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Connection Requests</span>
                    <span className="text-sm font-mono text-bronze">{Math.floor(Math.random() * 500)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Post Engagement Rate</span>
                    <span className="text-sm font-mono text-bronze">{(Math.random() * 10 + 5).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Community Growth Impact</span>
                    <span className="text-sm font-mono text-bronze">{(Math.random() * 20 + 5).toFixed(1)}K+</span>
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
