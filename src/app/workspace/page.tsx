import type { Metadata } from "next";
import Image from "next/image";
import { Bell, FileText, MessageCircle, ScanLine, Send, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { Panel } from "@/components/ui/panel";
import { dashboardStats, roles, sponsorPipeline } from "@/data/platform";

export const metadata: Metadata = {
  title: "Organize",
  description: "A collaborative Convoke hub for event teams, volunteers, sponsors, merch plans, and community momentum.",
};

export default function WorkspacePage() {
  const nav = [
    "Event Overview",
    "Registrations",
    "Volunteers",
    "Sponsorships",
    "Merchandise",
    "Analytics",
    "Announcements",
    "Outreach",
    "Certificates",
    "Media",
  ];

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-5 pb-12 pt-24 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[240px_1fr]">
          <aside className="hidden rounded-[8px] border border-line bg-white/[0.025] p-4 lg:block">
            <p className="mb-4 text-xs uppercase tracking-[0.24em] text-muted">
              Organizer Hub
            </p>
            <nav className="space-y-1">
              {nav.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block rounded-[8px] px-3 py-2 text-sm text-muted transition hover:bg-white/[0.06] hover:text-foreground"
                >
                  {item}
                </a>
              ))}
            </nav>
          </aside>
          <section className="space-y-4">
            <Panel className="p-6">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                  <p className="text-sm text-muted">Forge Hack 2026</p>
                  <h1 className="mt-2 text-5xl font-semibold tracking-[-0.04em] md:text-7xl">
                    Event Overview
                  </h1>
                </div>
                <div className="flex gap-2">
                  <a
                    href="mailto:sponsors@example.com?subject=Convoke sponsor update"
                    className="grid size-11 place-items-center rounded-full border border-line bg-white/[0.035] text-muted hover:text-foreground"
                    aria-label="Send sponsor update"
                  >
                    <Send className="size-4" />
                  </a>
                  <a
                    href="/workspace#announcements"
                    className="grid size-11 place-items-center rounded-full border border-line bg-white/[0.035] text-muted hover:text-foreground"
                    aria-label="Open announcements"
                  >
                    <Bell className="size-4" />
                  </a>
                  <a
                    href="/workspace#registrations"
                    className="grid size-11 place-items-center rounded-full border border-line bg-white/[0.035] text-muted hover:text-foreground"
                    aria-label="Open check-in"
                  >
                    <ScanLine className="size-4" />
                  </a>
                </div>
              </div>
            </Panel>
            <div className="grid gap-4 md:grid-cols-4">
              {dashboardStats.map(([label, value, delta]) => (
                <Panel key={label} className="p-5">
                  <p className="text-xs text-muted">{label}</p>
                  <p className="mt-4 text-3xl font-semibold">{value}</p>
                  <p className="mt-2 text-xs text-bronze">{delta}</p>
                </Panel>
              ))}
            </div>
            <div className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
              <Panel className="p-5">
                <h2 className="text-2xl font-medium">Sponsor Pipeline</h2>
                <div className="mt-5 space-y-3">
                  {sponsorPipeline.map(([stage, count]) => (
                    <div key={stage} className="grid grid-cols-[120px_1fr_40px] items-center gap-4 rounded-[8px] border border-line bg-black/30 px-4 py-3 text-sm">
                      <span className="text-muted">{stage}</span>
                      <span className="h-2 rounded-full bg-white/10">
                        <span className="block h-full w-2/3 rounded-full bg-gradient-to-r from-rust to-bronze" />
                      </span>
                      <span className="text-right font-mono">{count}</span>
                    </div>
                  ))}
                </div>
              </Panel>
              <Panel className="p-5">
                <h2 className="text-2xl font-medium">People and roles</h2>
                <div className="mt-5 grid gap-2">
                  {roles.map((role) => (
                    <div key={role} className="flex items-center justify-between rounded-[8px] border border-line bg-black/30 px-4 py-3 text-sm">
                      <span>{role}</span>
                      <ShieldCheck className="size-4 text-steel" />
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
            <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <Panel className="overflow-hidden p-0">
                <div className="relative h-80">
                  <Image
                    src="https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=85"
                    alt="Team collaborating at an event"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute bottom-0 p-5">
                    <h2 className="text-3xl font-medium tracking-[-0.03em]">
                      The room is filling up.
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-white/75">
                      Keep the story, team, volunteers, and sponsor conversations in sync.
                    </p>
                  </div>
                </div>
              </Panel>
              <Panel className="p-5">
                <h2 className="text-2xl font-medium">Team activity</h2>
                <div className="mt-5 space-y-3">
                  {[
                    ["Maya", "moved 18 volunteers into entry crew", "4 min"],
                    ["Aarav", "replied to a sponsor with the updated deck", "12 min"],
                    ["Naina", "added hoodie references for the merch drop", "28 min"],
                    ["Kabir", "approved the waitlist batch", "1 hr"],
                  ].map(([name, action, time]) => (
                    <div key={`${name}-${time}`} className="flex items-center gap-3 rounded-[8px] border border-line bg-black/30 p-3 text-sm">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-bronze to-rust font-semibold text-black">
                        {name[0]}
                      </span>
                      <span className="min-w-0 flex-1 text-muted">
                        <span className="text-foreground">{name}</span> {action}
                      </span>
                      <span className="font-mono text-xs text-muted/70">{time}</span>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
            <Panel className="p-5">
              <h2 className="text-2xl font-medium">Sponsor conversations</h2>
              <div className="mt-5 grid gap-3 md:grid-cols-5">
                {[
                  "Hackathon sponsorship",
                  "College fest",
                  "NGO partnership",
                  "Speaker invite",
                  "Creator collaboration",
                ].map((template) => (
                  <div key={template} className="rounded-[8px] border border-line bg-black/30 p-4 text-sm text-muted">
                    {template.includes("Speaker") ? (
                      <MessageCircle className="mb-8 size-5 text-rust" />
                    ) : (
                      <FileText className="mb-8 size-5 text-rust" />
                    )}
                    {template}
                  </div>
                ))}
              </div>
            </Panel>
          </section>
        </div>
      </main>
    </>
  );
}
