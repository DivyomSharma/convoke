import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Briefcase, MapPin, Search } from "lucide-react";
import { Footer } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { ApplyButton } from "@/components/ui/apply-button";
import { Panel } from "@/components/ui/panel";
import { SaveButton } from "@/components/ui/save-button";
import { listOpportunityDirectory } from "@/lib/platform-service";

export const metadata: Metadata = {
  title: "Opportunities",
  description: "Real internships, volunteer roles, hiring asks, and creator collaborations on Convoke.",
};

type OpportunitiesPageProps = {
  searchParams?: Promise<{ q?: string; location?: string; type?: string; remote?: string }>;
};

export default async function OpportunitiesPage({ searchParams }: OpportunitiesPageProps) {
  const opportunities = await listOpportunityDirectory();
  const filters = (await searchParams) ?? {};
  const q = filters.q?.trim().toLowerCase() ?? "";
  const location = filters.location?.trim().toLowerCase() ?? "";
  const type = filters.type?.trim().toLowerCase() ?? "";
  const remoteOnly = filters.remote === "true";
  const filtered = opportunities.filter((opportunity) => {
    const matchesQ = q
      ? [opportunity.title, opportunity.organization, opportunity.description, ...opportunity.skills].some((value) =>
          value.toLowerCase().includes(q),
        )
      : true;
    const matchesLocation = location ? opportunity.location.toLowerCase().includes(location) : true;
    const matchesType = type ? opportunity.type.toLowerCase() === type : true;
    const matchesRemote = remoteOnly ? opportunity.isRemote : true;
    return matchesQ && matchesLocation && matchesType && matchesRemote;
  });

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] md:text-7xl">
            Opportunities built like workflows, not content.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            Apply, save, and track status changes across internships, volunteer roles, creator asks, and startup hiring.
          </p>

          <div className="mt-10 rounded-xl border border-line bg-white/[0.025] px-5 py-4 text-sm text-muted">
            <div className="flex items-center gap-3">
              <Search className="size-5" />
              The browse layer now supports real query filtering on top of live opportunity records.
            </div>
          </div>
          <form className="mt-6 grid gap-3 rounded-[8px] border border-line bg-white/[0.03] p-4 md:grid-cols-[1fr_180px_180px_auto_auto]">
            <input name="q" defaultValue={filters.q ?? ""} placeholder="Role, org, skill" className="h-11 rounded-[8px] border border-line bg-black/35 px-4 text-sm outline-none" />
            <input name="location" defaultValue={filters.location ?? ""} placeholder="Location" className="h-11 rounded-[8px] border border-line bg-black/35 px-4 text-sm outline-none" />
            <select name="type" defaultValue={filters.type ?? ""} className="h-11 rounded-[8px] border border-line bg-black/35 px-4 text-sm outline-none">
              <option value="">Any type</option>
              <option value="internship">Internship</option>
              <option value="ambassador">Ambassador</option>
              <option value="startup hiring">Startup Hiring</option>
              <option value="volunteer role">Volunteer Role</option>
              <option value="creator collaboration">Creator Collaboration</option>
              <option value="freelance gig">Freelance Gig</option>
            </select>
            <label className="flex h-11 items-center gap-3 rounded-[8px] border border-line bg-black/35 px-4 text-sm text-muted">
              <input type="checkbox" name="remote" value="true" defaultChecked={remoteOnly} />
              Remote only
            </label>
            <button type="submit" className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition hover:bg-bronze hover:text-black">Apply</button>
          </form>

          {filtered.length ? (
            <div className="mt-12 grid gap-4">
              {filtered.map((opportunity) => (
                <Panel key={opportunity.id} className="panel-hover p-5">
                  <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-bronze">{opportunity.type}</p>
                      <Link href={`/opportunities/${opportunity.slug}`} className="mt-2 inline-flex items-center gap-2 text-2xl font-medium hover:text-bronze">
                        {opportunity.title}
                        <ArrowUpRight className="size-4" />
                      </Link>
                      <div className="mt-2 flex flex-wrap gap-3 text-sm text-muted">
                        <span>{opportunity.organization}</span>
                        <span className="inline-flex items-center gap-1.5"><MapPin className="size-3.5" />{opportunity.location}</span>
                        <span>{opportunity.stipend ?? "Unpaid"}</span>
                        <span>{opportunity.deadlineLabel}</span>
                      </div>
                      <p className="mt-4 max-w-3xl text-sm leading-7 text-muted">{opportunity.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {opportunity.skills.map((skill) => (
                          <span key={skill} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
                        {opportunity.perks.map((perk) => (
                          <span key={perk}>{perk}</span>
                        ))}
                      </div>
                    </div>
                    <div className="grid gap-3 lg:w-48">
                      <ApplyButton
                        opportunityId={opportunity.id}
                        initialApplied={opportunity.applied}
                        label={opportunity.applied ? "Applied" : "Apply now"}
                      />
                      <SaveButton opportunityId={opportunity.id} initialSaved={opportunity.saved} />
                      {opportunity.communitySlug ? (
                        <Link href={`/communities/${opportunity.communitySlug}`} className="inline-flex h-10 items-center justify-center rounded-full border border-line px-4 text-sm text-muted transition hover:border-bronze/50 hover:text-foreground">
                          Related community
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </Panel>
              ))}
            </div>
          ) : (
            <Panel className="mt-12 p-8">
              <Briefcase className="size-5 text-bronze" />
              <p className="mt-4 text-lg font-medium">No opportunities are live yet.</p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
                The platform is ready for real listings, but it won’t invent hiring demand to fill the page.
              </p>
            </Panel>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
