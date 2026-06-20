import Link from "next/link";
import { ArrowRight, Building2, CircleDollarSign, MapPin, Plus } from "lucide-react";
import { AmbientGlow } from "@/components/AmbientGlow";
import { Shell } from "@/components/Shell";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function OpportunitiesPage() {
  const opportunities = await prisma.opportunity.findMany({
    include: {
      organization: true,
      _count: {
        select: {
          applications: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  }).catch(() => []);

  return (
    <Shell>
      <div className="relative mx-auto min-h-screen max-w-[1240px] px-5 py-12 sm:px-8">
        <AmbientGlow className="bottom-0 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 opacity-[0.06]" color="var(--brand)" />

        <section className="campus-frame premium-card p-7 md:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="eyebrow">Opportunity board</div>
              <h1 className="mt-3 serif text-5xl tracking-tight md:text-7xl">
                Roles, fellowships, grants, and builder asks.
              </h1>
              <p className="mt-5 max-w-2xl text-[15px] leading-7 text-g5 md:text-[17px]">
                This surface should help ambitious people move: apply faster, discover sharper roles, and connect with organizations that are actively building.
              </p>
            </div>
            <button className="ink-button px-5 text-[14px] font-medium">
              <Plus size={16} />
              Post Opportunity
            </button>
          </div>
        </section>

        {opportunities.length === 0 ? (
          <section className="mt-8 premium-card p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-g3 bg-g1 text-[var(--brand)]">
              <Building2 size={26} />
            </div>
            <h2 className="mt-6 serif text-3xl">No opportunities are live yet</h2>
            <p className="mx-auto mt-3 max-w-[42ch] text-[15px] leading-7 text-g5">
              Post the first internship, volunteer role, ambassador program, or fellowship. This directory stays honest until the ecosystem is real.
            </p>
            <div className="mt-8">
              <button className="ink-button px-5 text-[14px] font-medium">
                <Plus size={16} />
                Publish first role
              </button>
            </div>
          </section>
        ) : (
          <section className="mt-8 grid gap-5">
            {opportunities.map((opportunity) => (
              <Link key={opportunity.id} href={`/opportunities/${opportunity.id}`} className="premium-card campus-frame block p-6 md:p-8">
                <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-[color:var(--brand)]/25 bg-[color:var(--brand)]/10 px-3 py-1 mono text-[11px] uppercase tracking-[0.18em] text-[var(--brand)]">
                        {opportunity.type}
                      </span>
                      <span className="mono text-[11px] uppercase tracking-[0.18em] text-g4">
                        {opportunity.organization.name}
                      </span>
                    </div>
                    <h2 className="mt-5 serif text-3xl tracking-tight md:text-5xl">{opportunity.title}</h2>
                    <p className="mt-4 max-w-3xl text-[15px] leading-7 text-g5">
                      {opportunity.description || "No public description has been published yet."}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3 text-[13px] text-g5">
                      <span className="inline-flex items-center gap-2 rounded-full border border-g3 bg-g1/60 px-3 py-2">
                        <Building2 size={14} className="text-[var(--brand)]" />
                        {opportunity.organization.name}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-g3 bg-g1/60 px-3 py-2">
                        <MapPin size={14} className="text-[var(--brand)]" />
                        {opportunity.location || "Remote"}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-g3 bg-g1/60 px-3 py-2">
                        <CircleDollarSign size={14} className="text-[var(--brand)]" />
                        {opportunity.compensation || "Competitive"}
                      </span>
                    </div>
                  </div>

                  <div className="glass-panel rounded-[26px] p-5 md:p-6">
                    <div className="eyebrow">Application pulse</div>
                    <div className="mt-3 serif text-4xl">{String(opportunity._count.applications).padStart(2, "0")}</div>
                    <div className="mt-2 text-[14px] leading-6 text-g5">
                      {opportunity.deadline
                        ? `Applications open until ${new Date(opportunity.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}.`
                        : "Rolling applications with no fixed deadline published yet."}
                    </div>

                    <div className="mt-6 space-y-3 border-t border-g3 pt-5 text-[13px] text-g5">
                      <div className="flex items-center justify-between">
                        <span>Work style</span>
                        <span className="text-ink">{opportunity.remoteHybrid || "Flexible"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Openings</span>
                        <span className="text-ink">{opportunity.openings || "Not stated"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Experience</span>
                        <span className="text-ink">{opportunity.experience || "Open to builders"}</span>
                      </div>
                    </div>

                    <div className="mt-6 inline-flex items-center gap-2 text-[13px] font-medium text-[var(--brand)]">
                      Open detail
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </section>
        )}
      </div>
    </Shell>
  );
}
