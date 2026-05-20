import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, Clock, MapPin, Search, SlidersHorizontal, Sparkles, TrendingUp, Users } from "lucide-react";
import { Footer } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Panel } from "@/components/ui/panel";
import { ButtonLink } from "@/components/ui/button";
import { SaveButton } from "@/components/ui/save-button";
import { ApplyButton } from "@/components/ui/apply-button";
import { opportunities, opportunityTypeColors, communities } from "@/data/platform";

export const metadata: Metadata = {
  title: "Opportunities — Internships, Roles & Collaborations",
  description: "Discover internships, startup roles, ambassador programs, freelance gigs, and volunteer openings from India's most ambitious communities.",
};

const typeFilters = ["All", "Internship", "Full-time", "Freelance", "Volunteer", "Ambassador"];

export default function OpportunitiesPage() {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Hero */}
          <div className="mb-12">
            <div className="flex items-center gap-3 text-sm text-bronze">
              <Sparkles className="size-4" />
              <span>{opportunities.length} active opportunities across {communities.length} communities</span>
            </div>
            <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-[-0.04em] md:text-7xl">
              Opportunities that match your ambition.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
              Internships, startup roles, creator collaborations, ambassador programs,
              and volunteer openings from communities building the next thing.
            </p>
          </div>

          {/* Filters + Search Bar */}
          <div className="mb-10 space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-line bg-white/[0.025] px-5 py-4">
              <Search className="size-5 text-muted" />
              <span className="flex-1 text-sm text-muted">Search roles, skills, or organizations...</span>
              <SlidersHorizontal className="size-4 text-muted" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {typeFilters.map((filter) => (
                <span
                  key={filter}
                  className={`shrink-0 cursor-pointer rounded-full border px-4 py-2 text-sm transition hover:border-bronze/60 hover:text-foreground ${
                    filter === "All"
                      ? "border-bronze/50 bg-bronze/10 text-bronze"
                      : "border-line bg-white/[0.025] text-muted"
                  }`}
                >
                  {filter}
                </span>
              ))}
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
            {/* Opportunity Cards */}
            <div className="space-y-4">
              {opportunities.map((opp) => (
                <Panel key={opp.id} className="group p-0 transition hover:-translate-y-0.5 hover:border-bronze/40">
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${opportunityTypeColors[opp.type]}`}>
                            {opp.type}
                          </span>
                          {opp.isRemote && (
                            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-400">
                              Remote
                            </span>
                          )}
                        </div>
                        <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-foreground group-hover:text-bronze transition">
                          {opp.title}
                        </h3>
                        <Link
                          href={`/communities/${opp.organizationSlug}`}
                          className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition"
                        >
                          <span className="grid size-5 place-items-center rounded bg-bronze/10 text-[10px] font-bold text-bronze">
                            {opp.organization[0]}
                          </span>
                          {opp.organization}
                        </Link>
                      </div>
                      <div className="shrink-0 w-10">
                        <SaveButton iconOnly />
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-muted line-clamp-2">
                      {opp.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {opp.skills.slice(0, 4).map((skill) => (
                        <span key={skill} className="rounded-md bg-white/[0.06] px-2.5 py-1 text-xs text-muted">
                          {skill}
                        </span>
                      ))}
                      {opp.skills.length > 4 && (
                        <span className="rounded-md bg-white/[0.06] px-2.5 py-1 text-xs text-muted">
                          +{opp.skills.length - 4}
                        </span>
                      )}
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="size-3.5" />
                          {opp.location}
                        </span>
                        {opp.stipend && (
                          <span className="inline-flex items-center gap-1.5 font-medium text-bronze">
                            <Briefcase className="size-3.5" />
                            {opp.stipend}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="size-3.5" />
                          Deadline: {opp.deadline}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="size-3.5" />
                          {opp.applicants} applied
                        </span>
                        <span className="ml-auto text-muted/60">{opp.postedAgo}</span>
                      </div>
                      <div className="ml-4 shrink-0 mt-3 sm:mt-0">
                        <ApplyButton label="Apply" className="h-8 px-4 text-xs w-auto" />
                      </div>
                    </div>
                  </div>
                </Panel>
              ))}
            </div>

            {/* Sidebar */}
            <div className="hidden space-y-4 lg:block">
              {/* Trending */}
              <Panel className="p-5">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <TrendingUp className="size-4 text-bronze" />
                  Trending this week
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    { label: "Frontend Intern at PlotArmour", apps: "142 applied" },
                    { label: "Campus Ambassador — Convoke", apps: "567 applied" },
                    { label: "AI/ML Research Intern", apps: "234 applied" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between rounded-lg border border-line bg-black/30 px-4 py-3 text-sm">
                      <span className="text-foreground">{item.label}</span>
                      <span className="text-xs text-bronze">{item.apps}</span>
                    </div>
                  ))}
                </div>
              </Panel>

              {/* Quick Stats */}
              <Panel className="p-5">
                <h3 className="text-sm font-medium">Ecosystem pulse</h3>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  {[
                    ["Active roles", "12"],
                    ["Communities hiring", "8"],
                    ["Avg. applicants", "147"],
                    ["This week", "+4 new"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-lg border border-line bg-black/30 p-3 text-center">
                      <p className="text-lg font-semibold text-foreground">{value}</p>
                      <p className="mt-1 text-xs text-muted">{label}</p>
                    </div>
                  ))}
                </div>
              </Panel>

              {/* For Organizers */}
              <Panel className="bg-gradient-to-br from-bronze/10 via-transparent to-rust/5 p-5">
                <h3 className="text-sm font-medium">Hiring for your community?</h3>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Post internships, volunteer roles, or ambassador programs and reach thousands of ambitious students.
                </p>
                <ButtonLink href="/workspace" className="mt-4 w-full" variant="secondary">
                  Post an opportunity
                </ButtonLink>
              </Panel>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}