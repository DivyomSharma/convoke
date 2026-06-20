import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { Avatar } from "@/components/Avatar";
import { events, feed, people, spaces, opportunities } from "@/lib/data";
import { photos } from "@/lib/photos";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Convoke — Where ambitious people gather" },
      { name: "description", content: "Events, communities, opportunities and projects from students, founders, builders and creators. One feed. No noise." },
      { property: "og:title", content: "Convoke" },
      { property: "og:description", content: "Where ambitious people gather." },
    ],
  }),
  component: Landing,
});

function Landing() {
  const tonight = events.slice(0, 3);
  const launch = feed.find((f) => f.kind === "launch")!;
  const hack = events[2];
  const role = opportunities[0];
  const featuredSpaces = spaces.slice(0, 3);

  return (
    <Shell wide>
      <section className="mx-auto max-w-[1440px] px-5 sm:px-8 pt-10 pb-16">
        {/* Editorial masthead — a single line of typography, no hero copy block */}
        <div className="flex items-baseline justify-between flex-wrap gap-y-3 hairline-b pb-6">
          <div className="eyebrow">Friday, June 19 · 2026 · Issue 1,284</div>
          <div className="eyebrow">Today on Convoke</div>
        </div>

        {/* Broken editorial grid demonstrating the network */}
        <div className="grid grid-cols-12 gap-6 lg:gap-8 mt-10">
          {/* Lead — Launch */}
          <article className="col-span-12 lg:col-span-7 group">
            <Link to="/profile/$handle" params={{ handle: launch.who.handle }} className="block">
              <div className="relative overflow-hidden">
                <img
                  src={launch.cover}
                  alt=""
                  width={1280}
                  height={880}
                  className="w-full h-[460px] md:h-[560px] object-cover grayscale-[10%]"
                />
              </div>
              <div className="mt-5 flex items-baseline gap-3 eyebrow">
                <span>Launch · {launch.at} ago</span>
              </div>
              <h1 className="serif text-4xl md:text-6xl lg:text-7xl leading-[0.95] mt-3 max-w-[14ch]">
                {launch.title}
              </h1>
              <p className="mt-5 text-g5 max-w-[52ch] text-[15px] leading-relaxed">
                {launch.body}
              </p>
              <div className="mt-5 flex items-center gap-3 text-[13px] text-g6">
                <Avatar src={launch.who.avatar} name={launch.who.name} size={24} />
                <span className="text-ink">{launch.who.name}</span>
                <span className="text-g4">·</span>
                <span>{launch.who.role}</span>
              </div>
            </Link>
          </article>

          {/* Right rail — tonight */}
          <aside className="col-span-12 lg:col-span-5 lg:pl-8 lg:hairline-l hairline-t lg:border-t-0 pt-8 lg:pt-0" style={{ borderLeft: "1px solid var(--g3)" }}>
            <div className="eyebrow mb-5">Tonight & this week</div>
            <ul className="divide-y divide-g3">
              {tonight.map((e) => (
                <li key={e.id}>
                  <Link to="/explore" className="grid grid-cols-[1fr_auto] gap-4 py-5 group">
                    <div className="min-w-0">
                      <div className="mono text-[11px] text-g5 uppercase tracking-wider">{e.kind} · {e.city}</div>
                      <h3 className="serif text-2xl md:text-[28px] leading-[1.05] mt-1 group-hover:italic transition-all">
                        {e.title}
                      </h3>
                      <div className="mt-2 text-[13px] text-g5">{e.when} · {e.host} · {e.going} going</div>
                    </div>
                    <div className="w-20 h-20 shrink-0 overflow-hidden">
                      <img src={e.cover} alt="" className="w-full h-full object-cover grayscale" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            <Link to="/explore" className="mt-5 inline-block eyebrow text-ink underline-link">
              See full feed →
            </Link>
          </aside>
        </div>
      </section>

      {/* Section: Spaces — three featured */}
      <section className="mx-auto max-w-[1440px] px-5 sm:px-8 mt-10 hairline-t pt-12">
        <div className="flex items-baseline justify-between">
          <h2 className="serif text-3xl md:text-5xl">Where people gather.</h2>
          <Link to="/spaces" className="eyebrow underline-link text-ink">All spaces →</Link>
        </div>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredSpaces.map((s) => (
            <Link key={s.slug} to="/spaces" className="group block">
              <div className="aspect-[4/5] overflow-hidden">
                <img src={s.cover} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h3 className="serif text-2xl">{s.name}</h3>
                <span className="mono text-[11px] text-g5">{s.members.toLocaleString()} members</span>
              </div>
              <p className="text-g5 text-[14px] mt-1">{s.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Two-up: Hackathon + Open role */}
      <section className="mx-auto max-w-[1440px] px-5 sm:px-8 mt-20 grid grid-cols-1 md:grid-cols-2 gap-10">
        <article className="hairline p-7">
          <div className="eyebrow">Hackathon · {hack.city}</div>
          <h3 className="serif text-3xl md:text-4xl mt-3 leading-[1.05]">{hack.title}</h3>
          <p className="text-g5 mt-3 text-[15px]">{hack.when} · {hack.going} builders going · $10k prize pool</p>
          <div className="mt-6 flex -space-x-2">
            {people.map((p, i) => (
              <Avatar key={i} src={p.avatar} name={p.name} size={28} />
            ))}
            <span className="ml-4 text-g5 text-[13px] self-center">+ 307 others</span>
          </div>
          <Link to="/opportunities" className="mt-7 inline-block eyebrow text-ink underline-link">
            RSVP →
          </Link>
        </article>
        <article className="hairline p-7">
          <div className="eyebrow">Open role · {role.location}</div>
          <h3 className="serif text-3xl md:text-4xl mt-3 leading-[1.05]">{role.title}</h3>
          <p className="text-g5 mt-3 text-[15px]">{role.org} · {role.comp}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {role.tags.map((t) => (
              <span key={t} className="mono text-[11px] hairline px-2 py-1 text-g6">{t}</span>
            ))}
          </div>
          <Link to="/opportunities" className="mt-7 inline-block eyebrow text-ink underline-link">
            Read brief →
          </Link>
        </article>
      </section>

      {/* Closing line */}
      <section className="mx-auto max-w-[1440px] px-5 sm:px-8 mt-24 mb-16">
        <p className="serif text-4xl md:text-6xl lg:text-7xl leading-[1.02] max-w-[18ch]">
          Not a feed. Not a network. A <em>place</em>.
        </p>
        <div className="mt-8 flex items-center gap-6">
          <Link to="/explore" className="bg-ink text-paper px-5 py-3 text-[14px] hover:bg-ink-2 transition-colors">
            Enter the feed
          </Link>
          <Link to="/spaces" className="underline-link text-[14px]">Browse spaces →</Link>
        </div>
      </section>
    </Shell>
  );
}
