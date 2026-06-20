import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";

export const Route = createFileRoute("/builder")({
  head: () => ({ meta: [{ title: "Builder — Convoke" }, { name: "description", content: "Builder console: projects, collaborators, drops." }] }),
  component: Builder,
});

const projects = [
  { name: "Lumen", status: "Live", week: "Wk 34", note: "First 100 users onboarded" },
  { name: "Typeset", status: "Open source", week: "Wk 12", note: "4kb release this week" },
  { name: "Mamba notes", status: "Reading group", week: "Wk 6", note: "Paper review Sunday" },
];

function Builder() {
  return (
    <Shell>
      <div className="mx-auto max-w-[1080px] px-5 sm:px-8 py-12">
        <div className="hairline-b pb-6 flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="eyebrow">Builder console</div>
            <h1 className="serif text-5xl mt-2">What you're shipping.</h1>
          </div>
          <button className="bg-ink text-paper px-4 py-2 text-[13px]">+ New project</button>
        </div>

        <ul className="divide-y divide-g3 mt-8">
          {projects.map((p) => (
            <li key={p.name} className="grid grid-cols-[1fr_auto_auto] gap-6 py-6 items-baseline">
              <div>
                <h2 className="serif text-3xl leading-tight">{p.name}</h2>
                <p className="text-g5 text-[14px] mt-1">{p.note}</p>
              </div>
              <span className="mono text-[11px] text-g5 uppercase">{p.week}</span>
              <span className="mono text-[11px] px-2 py-1 hairline">{p.status}</span>
            </li>
          ))}
        </ul>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { e: "Drops this week", n: "4", t: "Posts to your followers" },
            { e: "Collaborators", n: "11", t: "Across 3 projects" },
            { e: "Inbound", n: "23", t: "Vouches, intros, requests" },
          ].map((s) => (
            <div key={s.e} className="hairline p-6">
              <div className="eyebrow">{s.e}</div>
              <div className="serif text-6xl mt-3">{s.n}</div>
              <div className="text-g5 text-[13px] mt-2">{s.t}</div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
