import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, Clock, MapPin, Search, Sparkles, Users } from "lucide-react";
import { Footer } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { ApplyButton } from "@/components/ui/apply-button";
import { ButtonLink } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { SaveButton } from "@/components/ui/save-button";
import { listOpportunityDirectory } from "@/lib/platform-service";

export const metadata: Metadata = {
  title: "Opportunities",
  description: "Internships, hiring, volunteer roles, startup openings, and creator collaborations across the Convoke ecosystem.",
};

export default async function OpportunitiesPage() {
  const opportunities = await listOpportunityDirectory();

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <div className="flex items-center gap-3 text-sm text-bronze">
              <Sparkles className="size-4" />
              <span>{opportunities.length} active opportunities in the ecosystem</span>
            </div>
            <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-[-0.04em] md:text-7xl">
              Unstop-style opportunity flow, inside a community graph.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
              Browse openings, save them, apply, and track status across
              internships, startup roles, volunteer programs, and creator
              collaborations.
            </p>
          </div>

          <div className="mb-10 rounded-xl border border-line bg-white/[0.025] px-5 py-4 text-sm text-muted">
            <div className="flex items-center gap-3">
              <Search className="size-5" />
              Search roles, skills, communities, or cities
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {opportunities.map((opportunity) => (
                <Panel key={opportunity.id} className="group p-0 transition hover:border-bronze/40">
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs uppercase tracking-wider text-bronze">
                          {opportunity.type}
                        </p>
                        <h2 className="mt-3 text-2xl font-medium tracking-[-0.02em]">
                          {opportunity.title}
                        </h2>
                        <Link
                          href={`/communities/${opportunity.organizationSlug}`}
                          className="mt-2 inline-flex items-center gap-2 text-sm text-muted transition hover:text-foreground"
                        >
                          <span className="grid size-5 place-items-center rounded bg-bronze/10 text-[10px] font-semibold text-bronze">
                            {opportunity.organization[0]}
                          </span>
                          {opportunity.organization}
                        </Link>
                      </div>
                      <div className="shrink-0">
                        <SaveButton opportunityId={opportunity.id} initialSaved={opportunity.saved} iconOnly />
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-muted">{opportunity.description}</p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {opportunity.skills.slice(0, 5).map((skill) => (
                        <span key={skill} className="rounded-md bg-white/[0.06] px-2.5 py-1 text-xs text-muted">
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex flex-col gap-4 border-t border-line pt-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="size-3.5" />
                          {opportunity.location}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Briefcase className="size-3.5" />
                          {opportunity.stipend ?? "Unpaid"}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="size-3.5" />
                          {opportunity.deadlineLabel}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <Users className="size-3.5" />
                          {opportunity.applicants} applied
                        </span>
                      </div>
                      <ApplyButton
                        mode="apply"
                        opportunityId={opportunity.id}
                        initialApplied={opportunity.applied}
                        className="h-9 w-auto px-4 text-xs"
                        label={opportunity.applied ? "Applied" : "Apply"}
                      />
                    </div>
                  </div>
                </Panel>
              ))}
            </div>

            <div className="hidden space-y-4 lg:block">
              <Panel className="p-5">
                <h3 className="text-lg font-medium">What you can do here</h3>
                <div className="mt-4 space-y-3 text-sm text-muted">
                  <p>Save openings and revisit them from your dashboard.</p>
                  <p>Apply with a portfolio-first profile instead of a dead resume link.</p>
                  <p>Track progress across all communities in one place.</p>
                </div>
              </Panel>

              <Panel className="bg-gradient-to-br from-bronze/10 via-transparent to-rust/5 p-5">
                <h3 className="text-lg font-medium">Hiring through your community?</h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Post roles, shortlist applicants, and manage opportunity flows
                  inside the organizer dashboard.
                </p>
                <ButtonLink href="/workspace" className="mt-5 w-full" variant="secondary">
                  Open dashboard
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
