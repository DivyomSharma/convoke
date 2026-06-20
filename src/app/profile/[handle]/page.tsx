import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { Avatar } from "@/components/Avatar";
import { people, spaces } from "@/lib/data";
import { portraits } from "@/lib/photos";

export default async function Profile({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const p = people.find((x) => x.handle === handle);
  
  if (!p) return notFound();

  return (
    <Shell>
      <div className="mx-auto max-w-[920px] px-5 sm:px-8 py-12">
        {/* Identity header */}
        <header className="hairline-b pb-10 grid grid-cols-[auto_1fr] gap-6 items-end">
          <Avatar src={p.avatar} name={p.name} size={120} />
          <div>
            <div className="eyebrow">@{p.handle} · {p.city}</div>
            <h1 className="serif text-6xl md:text-7xl leading-[0.95] mt-2">{p.name}</h1>
            <p className="text-g6 text-[16px] mt-3 max-w-[44ch]">{p.role}. Building quiet tools for loud problems.</p>
            <div className="mt-5 flex gap-6 text-[13px] text-g5">
              <span><b className="text-ink">12</b> projects</span>
              <span><b className="text-ink">8</b> spaces</span>
              <span><b className="text-ink">34</b> vouches</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-10 mt-12">
          {/* Momentum */}
          <section className="col-span-12 md:col-span-7">
            <div className="eyebrow mb-4">Momentum · last 24 weeks</div>
            <Heat />
            <div className="mt-12">
              <div className="eyebrow mb-4">Selected work</div>
              <ul className="divide-y divide-g3">
                {[
                  { y: "2026", t: "Lumen — calm tools for solo founders", k: "shipped" },
                  { y: "2025", t: "Mamba reading group, MIT", k: "organized" },
                  { y: "2025", t: "Latency-aware MoE routing (paper)", k: "co-authored" },
                  { y: "2024", t: "Campus Makers · 3,104 members", k: "founded" },
                ].map((w, i) => (
                  <li key={i} className="grid grid-cols-[60px_1fr_auto] gap-4 py-4 text-[15px]">
                    <span className="mono text-[12px] text-g5">{w.y}</span>
                    <span>{w.t}</span>
                    <span className="mono text-[11px] uppercase text-g4">{w.k}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-5">
            <div className="eyebrow mb-3">Vouches</div>
            <ul className="space-y-5">
              {people.slice(0, 3).map((v, i) => (
                <li key={i} className="flex gap-3">
                  <Avatar src={v.avatar} name={v.name} size={36} />
                  <div>
                    <div className="text-[14px]">{v.name}</div>
                    <p className="text-g5 text-[13px] mt-1 italic">"{["Sharp, kind, ships.", "The taste is real.", "Carries rooms."][i]}"</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="eyebrow mt-10 mb-3">Spaces</div>
            <ul className="space-y-2 text-[14px]">
              {spaces.slice(0, 4).map((s) => (
                <li key={s.slug} className="flex justify-between text-g6">
                  <span>{s.name}</span>
                  <span className="mono text-[11px] text-g4">{s.members.toLocaleString()}</span>
                </li>
              ))}
            </ul>
            <div className="eyebrow mt-10 mb-3">Looks like</div>
            <div className="flex -space-x-2">{portraits.map((src, i) => <Avatar key={i} src={src} name="x" size={32} />)}</div>
          </aside>
        </div>
      </div>
    </Shell>
  );
}

function Heat() {
  const weeks = 24;
  const days = 7;
  const cells = Array.from({ length: weeks * days }, (_, i) => Math.max(0, Math.round(Math.sin(i / 6) * 3 + Math.random() * 3)));
  return (
    <div className="grid grid-flow-col gap-[3px]" style={{ gridTemplateRows: `repeat(${days}, 1fr)` }}>
      {cells.map((v, i) => (
        <span key={i} className="w-[10px] h-[10px]" style={{ background: `oklch(${0.95 - v * 0.12} 0 0)` }} />
      ))}
    </div>
  );
}
