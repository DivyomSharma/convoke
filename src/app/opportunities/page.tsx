import Link from "next/link";
import { Shell } from "@/components/Shell";
import { prisma } from "@/lib/prisma";

const types = ["All", "Role", "Fellowship", "Grant", "Hackathon"] as const;

export default async function Opportunities(props: { searchParams?: Promise<{ t?: string }> }) {
  const searchParams = await props.searchParams;
  const t = searchParams?.t || "All";

  const opportunities = await prisma.opportunity.findMany({
    where: t !== "All" ? { type: { equals: t, mode: 'insensitive' } } : undefined,
    include: { organization: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <Shell>
      <div className="mx-auto max-w-[1080px] px-5 sm:px-8 py-12">
        <div className="hairline-b pb-6 flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div className="eyebrow">Open right now</div>
            <h1 className="serif text-5xl md:text-7xl mt-2 leading-[0.95]">Opportunities.</h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            {types.map((x) => (
              <Link
                href={`/opportunities?t=${x}`}
                key={x}
                className={"px-3 py-1.5 text-[12px] mono uppercase tracking-wide " + (t === x ? "bg-ink text-paper" : "text-g5 hover:text-ink hairline")}
              >
                {x}
              </Link>
            ))}
          </div>
        </div>

        <ul className="divide-y divide-g3">
          {opportunities.length === 0 && (
            <div className="py-20 text-center text-g5 eyebrow">No opportunities found.</div>
          )}
          {opportunities.map((o) => (
            <li key={o.id} className="grid grid-cols-[1fr_auto] gap-6 py-7 group hover:bg-g1 -mx-4 px-4 transition-colors">
              <div className="min-w-0">
                <div className="mono text-[11px] uppercase tracking-wider text-g5">{o.type} · {o.organization.name}</div>
                <h2 className="serif text-3xl md:text-4xl leading-[1.05] mt-1">{o.title}</h2>
                <div className="mt-2 text-g5 text-[14px]">{o.location || "Remote"} · {o.compensation || "Negotiable"}</div>
              </div>
              <div className="text-right shrink-0 self-start">
                <div className="eyebrow">Deadline</div>
                <div className="serif text-2xl mt-1">{o.deadline ? o.deadline.toLocaleDateString() : "Rolling"}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}
