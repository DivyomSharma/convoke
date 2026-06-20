import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { Avatar } from "@/components/Avatar";
import { events, opportunities, people, spaces } from "@/lib/data";

export const Route = createFileRoute("/workspace")({
  head: () => ({
    meta: [
      { title: "Workspace — Convoke" },
      { name: "description", content: "Your personal operating system on Convoke — today, applications, teams, momentum." },
    ],
  }),
  component: Workspace,
});

function Workspace() {
  const today = events.slice(0, 2);
  const apps = opportunities.slice(0, 3);
  return (
    <Shell wide>
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 py-10 grid grid-cols-12 gap-x-10 gap-y-10">
        {/* LEFT — identity column */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="hairline-b pb-6">
            <div className="eyebrow">Workspace</div>
            <h1 className="serif text-4xl mt-2">Leo Carrillo</h1>
            <p className="text-g5 text-[14px] mt-1">CS undergrad · MIT · building Lumen</p>
          </div>
          <Momentum />
          <div className="mt-8">
            <div className="eyebrow mb-3">Your spaces</div>
            <ul className="space-y-2 text-[14px]">
              {spaces.slice(0, 4).map((s) => (
                <li key={s.slug}>
                  <Link to="/spaces" className="flex items-center justify-between hover:text-ink text-g6">
                    <span>{s.name}</span>
                    <span className="mono text-[11px] text-g4">{s.members.toLocaleString()}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* CENTER — timeline */}
        <section className="col-span-12 lg:col-span-6">
          <div className="hairline-b pb-5">
            <div className="eyebrow">Today · Friday, June 19</div>
            <h2 className="serif text-3xl mt-1">What you're showing up to.</h2>
          </div>

          <ol className="mt-6 relative">
            {today.map((e) => (
              <li key={e.id} className="grid grid-cols-[88px_1fr] gap-6 py-6 hairline-b">
                <div className="text-right">
                  <div className="serif text-2xl leading-none">{e.when.split("·")[1]?.trim() ?? e.when}</div>
                  <div className="mono text-[11px] text-g5 mt-1 uppercase">{e.kind}</div>
                </div>
                <div>
                  <h3 className="serif text-2xl leading-[1.1]">{e.title}</h3>
                  <div className="text-g5 text-[14px] mt-1">{e.host} · {e.city} · {e.going} going</div>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12">
            <div className="eyebrow mb-4">Applications in flight</div>
            <ul className="divide-y divide-g3">
              {apps.map((a, i) => (
                <li key={a.id} className="py-4 grid grid-cols-[1fr_auto] gap-4">
                  <div>
                    <div className="text-[15px]">{a.title} <span className="text-g5">· {a.org}</span></div>
                    <div className="text-g5 text-[12px] mono mt-1">Stage: {["Intro sent", "Conversation", "Take-home"][i]}</div>
                  </div>
                  <div className="text-right">
                    <div className="mono text-[11px] text-g5 uppercase">Next</div>
                    <div className="text-[14px]">{a.deadline}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* RIGHT — recommended */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="eyebrow mb-4">People to know</div>
          <ul className="space-y-5">
            {people.slice(1).map((p) => (
              <li key={p.handle} className="flex items-center gap-3">
                <Avatar src={p.avatar} name={p.name} size={40} />
                <div className="min-w-0">
                  <Link to="/profile/$handle" params={{ handle: p.handle }} className="text-[14px] underline-link">{p.name}</Link>
                  <div className="text-g5 text-[12px] truncate">{p.role}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-10 eyebrow mb-3">For you</div>
          <Link to="/opportunities" className="block hairline p-4 hover:bg-g1 transition-colors">
            <div className="mono text-[11px] text-g5 uppercase">Role</div>
            <div className="serif text-xl mt-1 leading-tight">Founding engineer · Lumen Labs</div>
            <div className="text-g5 text-[12px] mt-1">SF · $160–200k + 1.5%</div>
          </Link>
        </aside>
      </div>
    </Shell>
  );
}

function Momentum() {
  // Stylized sparkline
  const bars = [3, 5, 4, 6, 5, 8, 7, 9, 6, 8, 11, 9, 12, 14, 10, 13];
  const max = Math.max(...bars);
  return (
    <div className="mt-8">
      <div className="flex items-baseline justify-between">
        <div className="eyebrow">Momentum · 16 weeks</div>
        <span className="mono text-[11px] text-g4">+38%</span>
      </div>
      <div className="mt-3 flex items-end gap-[3px] h-16">
        {bars.map((b, i) => (
          <span
            key={i}
            className="flex-1 bg-ink"
            style={{ height: `${(b / max) * 100}%`, opacity: 0.4 + (i / bars.length) * 0.6 }}
          />
        ))}
      </div>
    </div>
  );
}
