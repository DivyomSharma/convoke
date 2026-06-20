import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Avatar } from "@/components/Avatar";
import { AmbientGlow } from "@/components/AmbientGlow";
import { prisma } from "@/lib/prisma";

const filters = ["All", "Events", "Roles", "Challenges", "Projects", "Drops", "Vouches", "Office hours"] as const;

export default async function Explore(props: { searchParams?: Promise<{ f?: string }> }) {
  const searchParams = await props.searchParams;
  const f = searchParams?.f || "All";

  // Fetch real data from Prisma
  const [events, opportunities, projects] = await Promise.all([
    prisma.event.findMany({ include: { space: { include: { organization: true } } }, orderBy: { createdAt: "desc" } }),
    prisma.opportunity.findMany({ include: { organization: true }, orderBy: { createdAt: "desc" } }),
    prisma.project.findMany({ include: { user: true }, orderBy: { createdAt: "desc" } }),
  ]);

  // Normalize into a common feed format
  const normalizedItems: any[] = [];

  if (f === "All" || f === "Events" || f === "Challenges") {
    events.forEach(e => normalizedItems.push({
      id: e.id,
      kind: "Event",
      title: e.title,
      body: e.description,
      cover: null,
      meta: e.location,
      at: e.createdAt.toLocaleDateString(),
      who: { handle: "event", name: e.space.name, role: "Space", avatar: "" }
    }));
  }

  if (f === "All" || f === "Roles") {
    opportunities.forEach(o => normalizedItems.push({
      id: o.id,
      kind: "Role",
      title: o.title,
      body: o.description,
      cover: null,
      meta: o.location,
      at: o.createdAt.toLocaleDateString(),
      who: { handle: o.organization.slug, name: o.organization.name, role: "Organization", avatar: o.organization.logoUrl || "" }
    }));
  }

  if (f === "All" || f === "Projects") {
    projects.forEach(p => normalizedItems.push({
      id: p.id,
      kind: "Project",
      title: p.title,
      body: p.description,
      cover: p.url,
      meta: p.url,
      at: p.createdAt.toLocaleDateString(),
      who: { handle: p.user.handle || p.user.id, name: p.user.name || "Builder", role: p.user.role || "User", avatar: p.user.avatarUrl || "" }
    }));
  }

  // Sort by date descending (using string sort for now, would be better to keep Date objects)
  const items = normalizedItems;

  return (
    <Shell>
      <div className="mx-auto max-w-[840px] px-5 sm:px-8 py-12 relative">
        
        {/* Background Ambient Glows */}
        <AmbientGlow className="top-10 -left-20 w-[600px] h-[600px] opacity-[0.03] dark:opacity-[0.08]" color="var(--brand)" />
        <AmbientGlow className="bottom-40 -right-20 w-[800px] h-[800px] opacity-[0.02] dark:opacity-[0.05]" />

        <div className="flex items-baseline justify-between hairline-b pb-5 relative z-10">
          <h1 className="serif text-4xl">Explore</h1>
          <span className="eyebrow">{items.length} items</span>
        </div>

        <div className="sticky top-14 z-20 bg-paper hairline-b py-3 -mx-5 sm:-mx-8 px-5 sm:px-8 mt-4 flex gap-2 overflow-x-auto">
          {filters.map((n) => (
            <Link
              key={n}
              href={`/explore?f=${n}`}
              className={
                "px-3 py-1.5 text-[12px] mono tracking-wide uppercase shrink-0 rounded-sm transition-colors " +
                (f === n ? "bg-ink text-paper" : "text-g5 hover:text-ink")
              }
            >
              {n}
            </Link>
          ))}
        </div>

        <ul className="flex flex-col gap-6 mt-8 relative z-10">
          {items.length === 0 && (
            <div className="py-20 text-center text-g5 eyebrow">No items found. Try adjusting your filters.</div>
          )}
          {items.map((it) => (
            <li key={it.id} className="premium-card p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <Link href={`/profile/${it.who.handle}`}>
                  <Avatar src={it.who.avatar} name={it.who.name} size={32} />
                </Link>
                <Link href={`/profile/${it.who.handle}`} className="text-[15px] font-medium text-ink hover:underline">
                  {it.who.name}
                </Link>
                <span className="text-g4 text-[12px]">·</span>
                <span className="text-[13px] text-g5">{it.who.role}</span>
                <span className="text-g4 text-[12px]">·</span>
                <span className="text-[13px] text-g4 mono">{it.at}</span>
                <span className="ml-auto mono text-[11px] font-medium bg-[var(--brand)]/10 text-[var(--brand)] px-3 py-1 rounded-full uppercase tracking-wider">{it.kind}</span>
              </div>
              <h3 className="serif text-[28px] md:text-[34px] leading-[1.1]">{it.title}</h3>
              {it.body && <p className="text-g5 text-[16px] mt-3 max-w-[65ch] leading-relaxed">{it.body}</p>}
              {it.cover && (
                <div className="mt-5 overflow-hidden rounded-xl border border-g3">
                  <img src={it.cover} alt="" loading="lazy" className="w-full max-h-[420px] object-cover hover:scale-[1.02] transition-transform duration-700" />
                </div>
              )}
              {it.meta && <div className="mt-5 mono text-[13px] text-g5 font-medium">{it.meta}</div>}
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}
