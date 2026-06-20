import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Avatar } from "@/components/Avatar";
import { prisma } from "@/lib/prisma";

const filters = ["All", "Events", "Roles", "Hackathons", "Projects", "Drops", "Vouches", "Office hours"] as const;

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

  if (f === "All" || f === "Events" || f === "Hackathons") {
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
      <div className="mx-auto max-w-[760px] px-5 sm:px-8 py-12">
        <div className="flex items-baseline justify-between hairline-b pb-5">
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

        <ul className="divide-y divide-g3">
          {items.length === 0 && (
            <div className="py-20 text-center text-g5 eyebrow">No items found. Try adjusting your filters.</div>
          )}
          {items.map((it) => (
            <li key={it.id} className="py-7">
              <div className="flex items-center gap-3 mb-3">
                <Link href={`/profile/${it.who.handle}`}>
                  <Avatar src={it.who.avatar} name={it.who.name} size={28} />
                </Link>
                <Link href={`/profile/${it.who.handle}`} className="text-[14px] text-ink hover:underline">
                  {it.who.name}
                </Link>
                <span className="text-g4 text-[12px]">·</span>
                <span className="text-[12px] text-g5">{it.who.role}</span>
                <span className="text-g4 text-[12px]">·</span>
                <span className="text-[12px] text-g4 mono">{it.at}</span>
                <span className="ml-auto mono text-[10px] uppercase tracking-wider text-g4">{it.kind}</span>
              </div>
              <h3 className="serif text-[26px] md:text-[30px] leading-[1.1]">{it.title}</h3>
              {it.body && <p className="text-g5 text-[15px] mt-2 max-w-[60ch]">{it.body}</p>}
              {it.cover && (
                <div className="mt-4 overflow-hidden">
                  <img src={it.cover} alt="" loading="lazy" className="w-full max-h-[420px] object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                </div>
              )}
              {it.meta && <div className="mt-4 mono text-[12px] text-g5">{it.meta}</div>}
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}
