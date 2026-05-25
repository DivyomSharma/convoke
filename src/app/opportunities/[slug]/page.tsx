import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Briefcase, Clock3, MapPin, Users } from "lucide-react";
import { Footer } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { ApplyButton } from "@/components/ui/apply-button";
import { ButtonLink } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { SaveButton } from "@/components/ui/save-button";
import { getOpportunityPageData } from "@/lib/platform-service";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const opportunity = await getOpportunityPageData(slug);

  return {
    title: opportunity ? opportunity.title : "Opportunity",
    description: opportunity?.description || "Apply to real opportunities on Convoke.",
  };
}

export default async function OpportunityPage({ params }: PageProps) {
  const { slug } = await params;
  const opportunity = await getOpportunityPageData(slug);

  if (!opportunity) notFound();

  return (
    <>
      <SiteHeader />
      <main className="px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          <section className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-bronze">{opportunity.type}</p>
              <h1 className="mt-4 max-w-4xl text-5xl font-semibold tracking-[-0.04em] md:text-7xl">
                {opportunity.title}
              </h1>
              <p className="mt-4 text-lg text-foreground/90">{opportunity.organization}</p>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">{opportunity.description}</p>
              <div className="mt-8 flex flex-wrap gap-5 text-sm text-muted">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="size-4 text-bronze" />
                  {opportunity.location}
                </span>
                {opportunity.duration ? (
                  <span className="inline-flex items-center gap-2">
                    <Clock3 className="size-4 text-bronze" />
                    {opportunity.duration}
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-2">
                  <Users className="size-4 text-bronze" />
                  {opportunity.applicants} applicants
                </span>
              </div>
            </div>

            <Panel className="p-5">
              <div className="space-y-3">
                <div className="rounded-[8px] border border-line bg-black/30 px-4 py-3">
                  <p className="text-xs text-muted">Deadline</p>
                  <p className="mt-2 text-lg font-medium">{opportunity.deadlineLabel}</p>
                </div>
                <div className="rounded-[8px] border border-line bg-black/30 px-4 py-3">
                  <p className="text-xs text-muted">Stipend</p>
                  <p className="mt-2 text-lg font-medium">{opportunity.stipend ?? "Unpaid"}</p>
                </div>
                <div className="rounded-[8px] border border-line bg-black/30 px-4 py-3">
                  <p className="text-xs text-muted">Open roles</p>
                  <p className="mt-2 text-lg font-medium">{opportunity.positionsAvailable}</p>
                </div>
              </div>
              <div className="mt-5 space-y-3">
                <ApplyButton
                  opportunityId={opportunity.id}
                  initialApplied={opportunity.applied}
                  label={opportunity.applied ? "Applied" : "Apply now"}
                />
                <SaveButton opportunityId={opportunity.id} initialSaved={opportunity.saved} />
              </div>
            </Panel>
          </section>

          <section className="mt-16 grid gap-6 xl:grid-cols-[1fr_1fr_320px]">
            <div className="space-y-6">
              <Panel className="p-5">
                <div className="flex items-center gap-2 text-2xl font-medium">
                  <Briefcase className="size-5 text-bronze" />
                  Requirements
                </div>
                <div className="mt-5 space-y-3">
                  {opportunity.requirements.length ? (
                    opportunity.requirements.map((item) => (
                      <div key={item} className="rounded-[8px] border border-line bg-black/30 px-4 py-3 text-sm text-muted">
                        {item}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted">No custom requirements added yet.</p>
                  )}
                </div>
              </Panel>

              <Panel className="p-5">
                <h2 className="text-2xl font-medium">Skills</h2>
                <div className="mt-5 flex flex-wrap gap-2">
                  {opportunity.skills.map((skill) => (
                    <span key={skill} className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                      {skill}
                    </span>
                  ))}
                </div>
              </Panel>
            </div>

            <div className="space-y-6">
              <Panel className="p-5">
                <h2 className="text-2xl font-medium">Why this exists</h2>
                <p className="mt-4 text-sm leading-7 text-muted">
                  {opportunity.organizationDescription ?? "This organization is hiring through Convoke."}
                </p>
              </Panel>

              <Panel className="p-5">
                <h2 className="text-2xl font-medium">Perks</h2>
                <div className="mt-5 space-y-3">
                  {opportunity.perks.length ? (
                    opportunity.perks.map((perk) => (
                      <div key={perk} className="rounded-[8px] border border-line bg-black/30 px-4 py-3 text-sm text-muted">
                        {perk}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted">No perks listed yet.</p>
                  )}
                </div>
              </Panel>
            </div>

            <div className="space-y-6">
              <Panel className="p-5">
                <h3 className="text-lg font-medium">Connected ecosystem</h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Opportunities on Convoke stay attached to the communities and organizations behind them.
                </p>
                {opportunity.communitySlug ? (
                  <ButtonLink href={`/communities/${opportunity.communitySlug}`} variant="secondary" className="mt-5 w-full">
                    Open community
                  </ButtonLink>
                ) : null}
              </Panel>
            </div>
          </section>

          {opportunity.related.length ? (
            <section className="mt-16">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-medium tracking-[-0.03em] md:text-4xl">Related opportunities</h2>
                  <p className="mt-2 text-sm text-muted">More active openings around the same organization or ecosystem.</p>
                </div>
                <ButtonLink href="/opportunities" variant="secondary">Browse all</ButtonLink>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {opportunity.related.map((item) => (
                  <Link key={item.id} href={`/opportunities/${item.slug}`}>
                    <Panel className="p-5 transition hover:border-bronze/50">
                      <p className="text-xs uppercase tracking-wider text-bronze">{item.type}</p>
                      <h3 className="mt-2 text-xl font-medium">{item.title}</h3>
                      <p className="mt-2 text-sm text-muted">{item.organization}</p>
                      <p className="mt-4 text-sm leading-6 text-muted">{item.description}</p>
                    </Panel>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
