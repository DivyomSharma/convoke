import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Avatar } from "@/components/Avatar";
import { people } from "@/lib/data";

const items = [
  { who: people[0], at: "10m", kind: "vouched for you", body: '"He carries rooms. Worked with him on Mamba reading group."' },
  { who: people[1], at: "32m", kind: "replied to your drop", body: '"The MoE routing graph — what hardware?"' },
  { who: people[2], at: "1h", kind: "started a space", body: "The Design Room · 882 members" },
  { who: people[3], at: "3h", kind: "RSVP'd to your event", body: "Crit night: shipped this week" },
  { who: people[0], at: "Yesterday", kind: "shared an opportunity", body: "Founding engineer at Lumen Labs · $160–200k" },
];

export default function Notifications() {
  return (
    <Shell>
      <div className="mx-auto max-w-[720px] px-5 sm:px-8 py-12">
        <div className="hairline-b pb-5 flex items-baseline justify-between">
          <h1 className="serif text-4xl">Activity</h1>
          <button className="mono text-[11px] uppercase text-g5 hover:text-ink">Mark all read</button>
        </div>
        <ul className="divide-y divide-g3">
          {items.map((it, i) => (
            <li key={i} className="py-5 flex gap-4">
              <Avatar src={it.who.avatar} name={it.who.name} size={36} />
              <div className="flex-1 min-w-0">
                <div className="text-[14px]">
                  <Link href={`/profile/${it.who.handle}`} className="underline-link text-ink">{it.who.name}</Link>{" "}
                  <span className="text-g5">{it.kind}</span>
                </div>
                <p className="text-g6 text-[14px] mt-1">{it.body}</p>
              </div>
              <span className="mono text-[11px] text-g4 shrink-0">{it.at}</span>
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}
