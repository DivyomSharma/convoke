import { Shell } from "@/components/Shell";

const projects = [
  { name: "Lumen", status: "Live", week: "Wk 34", note: "First 100 users onboarded" },
  { name: "Typeset", status: "Open source", week: "Wk 12", note: "4kb release this week" },
  { name: "Mamba notes", status: "Reading group", week: "Wk 6", note: "Paper review Sunday" },
];

export default function Builder() {
  return (
    <Shell>
      <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8">
        <div className="hairline-b pb-6 flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="eyebrow">Builder console</div>
            <h1 className="serif text-5xl mt-2">What you&apos;re shipping.</h1>
          </div>
          <button className="bg-ink text-paper px-4 py-2 text-[13px]">+ New project</button>
        </div>

        <div className="mt-8 overflow-x-auto pb-2">
          <ul className="grid min-w-[1120px] grid-cols-3 gap-4">
          {projects.map((p) => (
              <li key={p.name} className="premium-card flex min-h-[170px] flex-col justify-between p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="pr-2">
                    <h2 className="serif text-3xl leading-tight">{p.name}</h2>
                    <p className="mt-2 text-[14px] leading-6 text-g5">{p.note}</p>
                  </div>
                  <span className="mono whitespace-nowrap px-2 py-1 text-[11px] hairline">{p.status}</span>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-g3 pt-4">
                  <span className="mono text-[11px] uppercase tracking-[0.18em] text-g5">{p.week}</span>
                  <button className="ghost-button text-[13px]">Open</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { e: "Drops this week", n: "4", t: "Posts to your followers" },
            { e: "Collaborators", n: "11", t: "Across 3 projects" },
            { e: "Inbound", n: "23", t: "Vouches, intros, requests" },
          ].map((s) => (
            <div key={s.e} className="premium-card p-6">
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
