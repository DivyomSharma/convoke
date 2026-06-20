import Link from "next/link";
import { Shell } from "@/components/Shell";
import { prisma } from "@/lib/prisma";

export default async function Spaces() {
  const spaces = await prisma.space.findMany({
    include: { organization: true, _count: { select: { events: true } } },
    orderBy: { createdAt: "desc" }
  });

  return (
    <Shell>
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-12">
        <div className="hairline-b pb-6">
          <div className="eyebrow">Communities</div>
          <h1 className="serif text-5xl md:text-7xl mt-2 leading-[0.95]">Spaces.</h1>
          <p className="text-g5 mt-4 max-w-[52ch] text-[15px]">
            Small rooms with high signal. Run by the people in them — not by us.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mt-10">
          {spaces.length === 0 && (
             <div className="col-span-full py-20 text-center text-g5 eyebrow">No spaces found.</div>
          )}
          {spaces.map((s) => (
            <Link key={s.id} href={`/spaces/${s.id}`} className="group block">
              <div className="aspect-[5/6] overflow-hidden bg-g2">
                <div className="w-full h-full flex items-center justify-center text-g4 group-hover:bg-g3 transition-colors">
                  Space Cover
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h2 className="serif text-3xl">{s.name}</h2>
                <span className="mono text-[11px] text-g4 uppercase tracking-wider">{s.organization.name}</span>
              </div>
              <p className="text-g5 text-[14px] mt-1">{s.description || "No description provided."}</p>
              <div className="mt-3 mono text-[11px] text-g5">{s._count.events} events</div>
            </Link>
          ))}
        </div>
      </div>
    </Shell>
  );
}
