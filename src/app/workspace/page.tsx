"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, BadgeCheck, BarChart3, Bell, CalendarDays,
  FileText, Megaphone,
  ScanLine, Send, Settings, ShieldCheck, Shirt, Users,
} from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { Panel } from "@/components/ui/panel";
import {
  dashboardStats, roles, sponsorPipeline, activityFeed,
  featuredEvents, opportunities, seedPeople,
} from "@/data/platform";

const tabs = [
  { id: "overview", label: "Event Overview", icon: CalendarDays },
  { id: "registrations", label: "Registrations", icon: Users },
  { id: "volunteers", label: "Volunteers", icon: ShieldCheck },
  { id: "sponsorships", label: "Sponsorships", icon: Megaphone },
  { id: "opportunities", label: "Opportunities", icon: BadgeCheck },
  { id: "merchandise", label: "Merchandise", icon: Shirt },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "announcements", label: "Announcements", icon: Bell },
  { id: "certificates", label: "Certificates", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
];

// Mock registrations data
const registrations = seedPeople.map((p, i) => ({
  ...p,
  email: `${p.name.toLowerCase().replace(" ", ".")}@email.com`,
  status: i < 8 ? "confirmed" : i < 12 ? "waitlisted" : "pending",
  date: `May ${10 + i}, 2026`,
  event: featuredEvents[i % featuredEvents.length].title,
}));

// Mock volunteer data
const volunteerApps = seedPeople.slice(0, 8).map((p, i) => ({
  ...p,
  applied: `May ${8 + i}, 2026`,
  preferredRole: ["Entry Crew", "Stage Management", "Tech Support", "Social Media", "Logistics", "Food & Beverage", "Registration Desk", "Mentor Support"][i],
  status: i < 4 ? "approved" : i < 6 ? "under review" : "pending",
}));

export default function WorkspacePage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-5 pb-12 pt-24 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside className="hidden rounded-xl border border-line bg-white/[0.025] p-4 lg:block">
            <p className="mb-4 text-xs uppercase tracking-[0.24em] text-muted">
              Organizer Hub
            </p>
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                      activeTab === tab.id
                        ? "bg-bronze/10 text-bronze"
                        : "text-muted hover:bg-white/[0.06] hover:text-foreground"
                    }`}
                  >
                    <Icon className="size-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Mobile tab bar */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none lg:hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm transition ${
                  activeTab === tab.id
                    ? "border-bronze/50 bg-bronze/10 text-bronze"
                    : "border-line text-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content area */}
          <section className="space-y-4">
            {/* Header */}
            <Panel className="p-6">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                  <p className="text-sm text-muted">Forge Hack 2026</p>
                  <h1 className="mt-2 text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
                    {tabs.find((t) => t.id === activeTab)?.label}
                  </h1>
                </div>
                <div className="flex gap-2">
                  <button className="grid size-11 place-items-center rounded-full border border-line bg-white/[0.035] text-muted hover:text-foreground transition" aria-label="Send update">
                    <Send className="size-4" />
                  </button>
                  <button className="grid size-11 place-items-center rounded-full border border-line bg-white/[0.035] text-muted hover:text-foreground transition" aria-label="Notifications">
                    <Bell className="size-4" />
                  </button>
                  <button className="grid size-11 place-items-center rounded-full border border-line bg-white/[0.035] text-muted hover:text-foreground transition" aria-label="Check-in">
                    <ScanLine className="size-4" />
                  </button>
                </div>
              </div>
            </Panel>

            {/* Tab Content */}
            {activeTab === "overview" && <OverviewTab />}
            {activeTab === "registrations" && <RegistrationsTab />}
            {activeTab === "volunteers" && <VolunteersTab />}
            {activeTab === "sponsorships" && <SponsorshipsTab />}
            {activeTab === "opportunities" && <OpportunitiesTab />}
            {activeTab === "merchandise" && <MerchandiseTab />}
            {activeTab === "analytics" && <AnalyticsTab />}
            {activeTab === "announcements" && <AnnouncementsTab />}
            {activeTab === "certificates" && <CertificatesTab />}
            {activeTab === "settings" && <SettingsTab />}
          </section>
        </div>
      </main>
    </>
  );
}

// ── OVERVIEW TAB ────────────────────────────────────────────────────────────

function OverviewTab() {
  return (
    <>
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
            {sponsorPipeline.map(([stage, count], i) => (
              <div key={stage} className="grid grid-cols-[120px_1fr_40px] items-center gap-4 rounded-lg border border-line bg-black/30 px-4 py-3 text-sm">
                <span className="text-muted">{stage}</span>
                <span className="h-2 rounded-full bg-white/10">
                  <span className="block h-full rounded-full bg-gradient-to-r from-rust to-bronze" style={{ width: `${90 - i * 16}%` }} />
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
              <div key={role} className="flex items-center justify-between rounded-lg border border-line bg-black/30 px-4 py-3 text-sm">
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
            {activityFeed.slice(0, 4).map(([name, action, time]) => (
              <div key={`${name}-${time}`} className="flex items-center gap-3 rounded-lg border border-line bg-black/30 p-3 text-sm">
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
    </>
  );
}

// ── REGISTRATIONS TAB ───────────────────────────────────────────────────────

function RegistrationsTab() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Total Registrations", registrations.length.toString(), "confirmed + waitlisted + pending"],
          ["Confirmed", registrations.filter((r) => r.status === "confirmed").toString().length > 0 ? "8" : "0", "ready to attend"],
          ["Waitlisted", "4", "pending capacity"],
        ].map(([label, value, desc]) => (
          <Panel key={label} className="p-5">
            <p className="text-xs text-muted">{label}</p>
            <p className="mt-3 text-3xl font-semibold">{value}</p>
            <p className="mt-1 text-xs text-muted">{desc}</p>
          </Panel>
        ))}
      </div>

      <Panel className="overflow-hidden p-0">
        <div className="border-b border-line px-5 py-4">
          <h2 className="text-lg font-medium">All Registrations</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line text-left text-xs text-muted">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => (
                <tr key={reg.name} className="border-b border-line/50 hover:bg-white/[0.02] transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-bronze to-rust text-xs font-semibold text-black">
                        {reg.initials}
                      </span>
                      <span className="font-medium">{reg.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted">{reg.role}</td>
                  <td className="px-5 py-3 text-muted">{reg.email}</td>
                  <td className="px-5 py-3 text-muted">{reg.date}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      reg.status === "confirmed" ? "bg-emerald-500/15 text-emerald-400" :
                      reg.status === "waitlisted" ? "bg-amber-500/15 text-amber-400" :
                      "bg-white/10 text-muted"
                    }`}>
                      {reg.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

// ── VOLUNTEERS TAB ──────────────────────────────────────────────────────────

function VolunteersTab() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["Applications", "8", "total volunteer applications"],
          ["Approved", "4", "ready to deploy"],
          ["Under Review", "2", "pending approval"],
        ].map(([label, value, desc]) => (
          <Panel key={label} className="p-5">
            <p className="text-xs text-muted">{label}</p>
            <p className="mt-3 text-3xl font-semibold">{value}</p>
            <p className="mt-1 text-xs text-muted">{desc}</p>
          </Panel>
        ))}
      </div>

      <Panel className="p-5">
        <h2 className="text-lg font-medium mb-4">Volunteer Applications</h2>
        <div className="space-y-3">
          {volunteerApps.map((vol) => (
            <div key={vol.name} className="flex items-center gap-4 rounded-lg border border-line bg-black/30 p-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-bronze to-rust text-sm font-semibold text-black">
                {vol.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{vol.name}</p>
                <p className="text-xs text-muted">{vol.preferredRole} · Applied {vol.applied}</p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                vol.status === "approved" ? "bg-emerald-500/15 text-emerald-400" :
                vol.status === "under review" ? "bg-amber-500/15 text-amber-400" :
                "bg-white/10 text-muted"
              }`}>
                {vol.status}
              </span>
              {vol.status !== "approved" && (
                <button className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400 transition hover:bg-emerald-500/20">
                  Approve
                </button>
              )}
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

// ── SPONSORSHIPS TAB ────────────────────────────────────────────────────────

function SponsorshipsTab() {
  return (
    <>
      <Panel className="p-5">
        <h2 className="text-2xl font-medium">Sponsor Pipeline</h2>
        <div className="mt-5 space-y-3">
          {sponsorPipeline.map(([stage, count], i) => (
            <div key={stage} className="grid grid-cols-[120px_1fr_40px] items-center gap-4 rounded-lg border border-line bg-black/30 px-4 py-3 text-sm">
              <span className="text-muted">{stage}</span>
              <span className="h-2 rounded-full bg-white/10">
                <span className="block h-full rounded-full bg-gradient-to-r from-rust to-bronze" style={{ width: `${90 - i * 16}%` }} />
              </span>
              <span className="text-right font-mono">{count}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel className="p-5">
        <h2 className="text-2xl font-medium">Sponsor Conversations</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {[
            { name: "Zephyr Labs", stage: "Negotiating", amount: "₹3L", contact: "Aarav" },
            { name: "CloudNine Tech", stage: "Replied", amount: "₹1.5L", contact: "Maya" },
            { name: "Urban Brew Co.", stage: "Contacted", amount: "₹50K", contact: "Naina" },
            { name: "DevForge Tools", stage: "Confirmed", amount: "₹5L", contact: "Kabir" },
            { name: "PixelPerfect Design", stage: "Prospecting", amount: "TBD", contact: "Sneha" },
            { name: "Startup India Fund", stage: "Replied", amount: "₹2L", contact: "Arya" },
          ].map((sponsor) => (
            <div key={sponsor.name} className="rounded-lg border border-line bg-black/30 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{sponsor.name}</h3>
                <span className={`rounded-full px-2 py-0.5 text-xs ${
                  sponsor.stage === "Confirmed" ? "bg-emerald-500/15 text-emerald-400" :
                  sponsor.stage === "Negotiating" ? "bg-bronze/15 text-bronze" :
                  sponsor.stage === "Replied" ? "bg-steel/15 text-steel" :
                  "bg-white/10 text-muted"
                }`}>{sponsor.stage}</span>
              </div>
              <p className="mt-2 text-sm text-muted">Amount: <span className="text-bronze">{sponsor.amount}</span></p>
              <p className="mt-1 text-xs text-muted">Contact: {sponsor.contact}</p>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

// ── OPPORTUNITIES TAB ───────────────────────────────────────────────────────

function OpportunitiesTab() {
  const orgOpps = opportunities.filter((o) => o.organizationSlug === "convoke-labs");
  return (
    <>
      <Panel className="p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-medium">Your Opportunities</h2>
          <button className="rounded-full bg-bronze px-4 py-2 text-sm font-medium text-black transition hover:bg-bronze/90">
            + Post new
          </button>
        </div>
        <div className="mt-5 space-y-3">
          {orgOpps.map((opp) => (
            <div key={opp.id} className="rounded-lg border border-line bg-black/30 p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{opp.title}</h3>
                <span className="text-xs text-bronze">{opp.type}</span>
              </div>
              <p className="mt-2 text-sm text-muted line-clamp-1">{opp.description}</p>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted">
                <span>{opp.applicants} applicants</span>
                <span>Deadline: {opp.deadline}</span>
                {opp.stipend && <span className="text-bronze">{opp.stipend}</span>}
              </div>
            </div>
          ))}
          {orgOpps.length === 0 && (
            <p className="py-8 text-center text-sm text-muted">No opportunities posted yet. Post your first one.</p>
          )}
        </div>
      </Panel>
    </>
  );
}

// ── MERCHANDISE TAB ─────────────────────────────────────────────────────────

function MerchandiseTab() {
  return (
    <Panel className="p-5">
      <h2 className="text-2xl font-medium">Merch Pipeline</h2>
      <p className="mt-2 text-sm text-muted">Track your apparel orders through PlotArmour Merch.</p>
      <div className="mt-6 space-y-3">
        {[
          { item: "Oversized tees (250 units)", status: "Production", est: "₹1.5L", eta: "Jun 2" },
          { item: "Hoodies (100 units)", status: "Design Approval", est: "₹1.2L", eta: "Jun 8" },
          { item: "Sticker packs (500 units)", status: "Delivered", est: "₹15K", eta: "Done" },
          { item: "Sponsor kits (50 units)", status: "Quote Requested", est: "TBD", eta: "Pending" },
        ].map((order) => (
          <div key={order.item} className="flex items-center justify-between rounded-lg border border-line bg-black/30 p-4">
            <div>
              <p className="font-medium text-sm">{order.item}</p>
              <p className="text-xs text-muted mt-1">ETA: {order.eta} · Est: {order.est}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-medium ${
              order.status === "Delivered" ? "bg-emerald-500/15 text-emerald-400" :
              order.status === "Production" ? "bg-bronze/15 text-bronze" :
              "bg-white/10 text-muted"
            }`}>{order.status}</span>
          </div>
        ))}
      </div>
      <Link href="/merch" className="mt-5 inline-flex items-center gap-2 text-sm text-bronze hover:text-bronze/80 transition">
        Open merch portal <ArrowRight className="size-4" />
      </Link>
    </Panel>
  );
}

// ── ANALYTICS TAB ───────────────────────────────────────────────────────────

function AnalyticsTab() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Page Views", "12,480", "+24%"],
          ["Unique Visitors", "4,230", "+18%"],
          ["Avg. Session", "3m 42s", "+12%"],
          ["Conversion Rate", "8.7%", "+3.2%"],
        ].map(([label, value, delta]) => (
          <Panel key={label} className="p-5">
            <p className="text-xs text-muted">{label}</p>
            <p className="mt-3 text-3xl font-semibold">{value}</p>
            <p className="mt-1 text-xs text-bronze">{delta}</p>
          </Panel>
        ))}
      </div>
      <Panel className="p-5">
        <h2 className="text-lg font-medium mb-4">Traffic by Source</h2>
        <div className="space-y-3">
          {[
            ["Instagram", "38%", "w-[38%]"],
            ["Direct", "24%", "w-[24%]"],
            ["LinkedIn", "18%", "w-[18%]"],
            ["WhatsApp", "12%", "w-[12%]"],
            ["Other", "8%", "w-[8%]"],
          ].map(([source, pct, width]) => (
            <div key={source} className="grid grid-cols-[100px_1fr_50px] items-center gap-4 text-sm">
              <span className="text-muted">{source}</span>
              <div className="h-2 rounded-full bg-white/10">
                <div className={`h-full rounded-full bg-gradient-to-r from-bronze to-rust ${width}`} />
              </div>
              <span className="text-right font-mono text-muted">{pct}</span>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

// ── ANNOUNCEMENTS TAB ───────────────────────────────────────────────────────

function AnnouncementsTab() {
  return (
    <Panel className="p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium">Announcements</h2>
        <button className="rounded-full bg-bronze px-4 py-2 text-sm font-medium text-black transition hover:bg-bronze/90">
          + New announcement
        </button>
      </div>
      <div className="mt-5 space-y-4">
        {[
          { title: "Venue confirmed — IIT Delhi Seminar Hall", time: "2 hours ago", author: "Arya Sen", body: "We've secured the main seminar hall for Day 1 and the workshop block for Day 2. Capacity: 400 seated." },
          { title: "Sponsor deck v3 is ready", time: "6 hours ago", author: "Aarav Mehta", body: "Updated with new tier pricing and case studies from Summit Zero. Share with warm leads." },
          { title: "Volunteer onboarding call — Saturday 6 PM", time: "1 day ago", author: "Maya Krishnan", body: "All approved volunteers must join. We'll cover roles, shifts, dress code, and emergency protocols." },
          { title: "Merch samples arriving Monday", time: "2 days ago", author: "Naina Kapoor", body: "PlotArmour Merch is shipping samples of the oversized tees and hoodies. Review and approve by Wednesday." },
        ].map((ann) => (
          <div key={ann.title} className="rounded-lg border border-line bg-black/30 p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{ann.title}</h3>
              <span className="text-xs text-muted">{ann.time}</span>
            </div>
            <p className="mt-2 text-sm text-muted">{ann.body}</p>
            <p className="mt-3 text-xs text-bronze">— {ann.author}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

// ── CERTIFICATES TAB ────────────────────────────────────────────────────────

function CertificatesTab() {
  return (
    <Panel className="p-5">
      <h2 className="text-2xl font-medium">Certificate Templates</h2>
      <p className="mt-2 text-sm text-muted">Issue participation, volunteer, and winner certificates after your event.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {[
          { type: "Participation", issued: 0, total: 1200, status: "Draft" },
          { type: "Volunteer", issued: 0, total: 65, status: "Draft" },
          { type: "Winner", issued: 0, total: 12, status: "Not started" },
        ].map((cert) => (
          <div key={cert.type} className="rounded-lg border border-line bg-black/30 p-5">
            <FileText className="size-5 text-bronze" />
            <h3 className="mt-3 text-lg font-medium">{cert.type} Certificate</h3>
            <p className="mt-1 text-xs text-muted">{cert.issued}/{cert.total} issued</p>
            <div className="mt-3 flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs ${
                cert.status === "Draft" ? "bg-amber-500/15 text-amber-400" : "bg-white/10 text-muted"
              }`}>{cert.status}</span>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

// ── SETTINGS TAB ────────────────────────────────────────────────────────────

function SettingsTab() {
  return (
    <Panel className="p-5">
      <h2 className="text-2xl font-medium">Event Settings</h2>
      <div className="mt-6 space-y-4">
        {[
          ["Event Name", "Forge Hack 2026"],
          ["Organizing Community", "Convoke Labs"],
          ["Location", "Pune"],
          ["Date", "Oct 03, 2026"],
          ["Capacity", "1,200"],
          ["Registration Status", "Open"],
          ["Visibility", "Public"],
        ].map(([label, value]) => (
          <div key={label} className="flex items-center justify-between border-b border-line/50 pb-3">
            <span className="text-sm text-muted">{label}</span>
            <span className="text-sm font-medium">{value}</span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
