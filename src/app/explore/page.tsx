"use client";

import Link from "next/link";
import { Shell } from "@/components/Shell";
import { Avatar } from "@/components/Avatar";
import { feed } from "@/lib/data";
import { useState } from "react";

const filters = ["All", "Events", "Roles", "Hackathons", "Projects", "Drops", "Vouches", "Office hours"] as const;

export default function Explore() {
  const [f, setF] = useState<(typeof filters)[number]>("All");
  const items = f === "All" ? feed : feed.filter((it) => {
    const map: Record<string, string> = { Events: "event", Roles: "role", Hackathons: "hackathon", Projects: "project", Drops: "drop", Vouches: "vouch", "Office hours": "office-hours" };
    return it.kind === map[f];
  });

  return (
    <Shell>
      <div className="mx-auto max-w-[760px] px-5 sm:px-8 py-12">
        <div className="flex items-baseline justify-between hairline-b pb-5">
          <h1 className="serif text-4xl">Explore</h1>
          <span className="eyebrow">{items.length} items</span>
        </div>

        <div className="sticky top-14 z-20 bg-paper hairline-b py-3 -mx-5 sm:-mx-8 px-5 sm:px-8 mt-4 flex gap-2 overflow-x-auto">
          {filters.map((n) => (
            <button
              key={n}
              onClick={() => setF(n)}
              className={
                "px-3 py-1.5 text-[12px] mono tracking-wide uppercase shrink-0 rounded-sm transition-colors " +
                (f === n ? "bg-ink text-paper" : "text-g5 hover:text-ink")
              }
            >
              {n}
            </button>
          ))}
        </div>

        <ul className="divide-y divide-g3">
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
                <span className="ml-auto mono text-[10px] uppercase tracking-wider text-g4">{labelFor(it.kind)}</span>
              </div>
              <h3 className="serif text-[26px] md:text-[30px] leading-[1.1]">{it.title}</h3>
              {it.body && <p className="text-g5 text-[15px] mt-2 max-w-[60ch]">{it.body}</p>}
              {it.cover && (
                <div className="mt-4 overflow-hidden">
                  <img src={it.cover} alt="" loading="lazy" className="w-full max-h-[420px] object-cover grayscale-[15%]" />
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

function labelFor(k: string) {
  const m: Record<string, string> = {
    launch: "Launch", event: "Event", role: "Role", project: "Project",
    drop: "Drop", vouch: "Vouch", space: "Space", hackathon: "Hackathon", "office-hours": "Office hours",
  };
  return m[k] ?? k;
}
