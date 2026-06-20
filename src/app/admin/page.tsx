import { Shell } from "@/components/Shell";

const metrics = [
  { e: "Active members", n: "48,201", d: "+412 today" },
  { e: "Spaces", n: "1,284", d: "+6 today" },
  { e: "Events live", n: "94", d: "Next 7 days" },
  { e: "Trust score (avg)", n: "0.87", d: "Stable" },
];

export default function Admin() {
  return (
    <Shell wide>
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 py-12">
        <div className="hairline-b pb-6">
          <div className="eyebrow">Operator view</div>
          <h1 className="serif text-5xl mt-2">Admin.</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
          {metrics.map((m) => (
            <div key={m.e} className="hairline p-6">
              <div className="eyebrow">{m.e}</div>
              <div className="serif text-5xl mt-3 leading-none">{m.n}</div>
              <div className="text-g5 text-[12px] mt-2 mono">{m.d}</div>
            </div>
          ))}
        </div>

        <section className="mt-14">
          <div className="eyebrow mb-4">Moderation queue</div>
          <ul className="hairline divide-y divide-g3">
            {[
              { t: "Reported message in #ai-tinkerers", who: "anon", at: "12m" },
              { t: "New space pending review: Founders India", who: "ananya", at: "1h" },
              { t: "Spam report on @recruiter-x", who: "system", at: "3h" },
            ].map((r, i) => (
               <li key={i} className="px-5 py-4 grid grid-cols-[1fr_auto_auto] gap-6 items-baseline text-[14px]">
                 <span>{r.t}</span>
                 <span className="mono text-[11px] text-g5">{r.who}</span>
                 <span className="mono text-[11px] text-g4">{r.at}</span>
               </li>
            ))}
          </ul>
        </section>
      </div>
    </Shell>
  );
}
