import { Shell } from "@/components/Shell";
import { Avatar } from "@/components/Avatar";
import { people } from "@/lib/data";

const pipeline = [
  { stage: "Sourced", people: people.slice(0, 3) },
  { stage: "Replied", people: [people[1], people[3]] },
  { stage: "Interview", people: [people[0]] },
  { stage: "Offer", people: [] },
];

export default function Recruiter() {
  return (
    <Shell wide>
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 py-12">
        <div className="hairline-b pb-5 flex items-end justify-between">
          <div>
            <div className="eyebrow">Recruiter desk</div>
            <h1 className="serif text-5xl mt-2">Founding engineer pipeline.</h1>
            <p className="text-g5 text-[14px] mt-2">Lumen Labs · opened Mar 1 · 6 in flight</p>
          </div>
          <button className="bg-ink text-paper px-4 py-2 text-[13px]">+ Source from space</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-10">
          {pipeline.map((c) => (
            <div key={c.stage} className="hairline p-4 min-h-[260px]">
              <div className="flex items-baseline justify-between mb-4">
                <div className="eyebrow">{c.stage}</div>
                <span className="mono text-[11px] text-g4">{c.people.length}</span>
              </div>
              <ul className="space-y-3">
                {c.people.map((p) => (
                  <li key={p.handle} className="hairline p-3 flex items-center gap-3 bg-paper">
                    <Avatar src={p.avatar} name={p.name} size={36} />
                    <div className="min-w-0">
                      <div className="text-[13px] truncate">{p.name}</div>
                      <div className="text-g5 text-[11px] truncate">{p.role}</div>
                    </div>
                  </li>
                ))}
                {c.people.length === 0 && <li className="text-g4 text-[12px] italic">Empty</li>}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
