"use client";

import Link from "next/link";
import { Shell } from "@/components/Shell";
import { opportunities } from "@/lib/data";
import { useState } from "react";

const types = ["All", "Role", "Fellowship", "Grant", "Hackathon"] as const;

export default function Opportunities() {
  const [t, setT] = useState<(typeof types)[number]>("All");
  const items = t === "All" ? opportunities : opportunities.filter((o) => o.type === t);

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
              <button
                key={x}
                onClick={() => setT(x)}
                className={"px-3 py-1.5 text-[12px] mono uppercase tracking-wide " + (t === x ? "bg-ink text-paper" : "text-g5 hover:text-ink hairline")}
              >
                {x}
              </button>
            ))}
          </div>
        </div>

        <ul className="divide-y divide-g3">
          {items.map((o) => (
            <li key={o.id} className="grid grid-cols-[1fr_auto] gap-6 py-7 group hover:bg-g1 -mx-4 px-4 transition-colors">
              <div className="min-w-0">
                <div className="mono text-[11px] uppercase tracking-wider text-g5">{o.type} · {o.org}</div>
                <h2 className="serif text-3xl md:text-4xl leading-[1.05] mt-1">{o.title}</h2>
                <div className="mt-2 text-g5 text-[14px]">{o.location} · {o.comp}</div>
                <div className="mt-3 flex gap-2 flex-wrap">
                  {o.tags.map((tg) => (
                     <span key={tg} className="mono text-[11px] hairline px-2 py-0.5 text-g6">{tg}</span>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0 self-start">
                <div className="eyebrow">Deadline</div>
                <div className="serif text-2xl mt-1">{o.deadline}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}
