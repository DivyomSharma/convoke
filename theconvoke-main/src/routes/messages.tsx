import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { Avatar } from "@/components/Avatar";
import { people } from "@/lib/data";
import { useState } from "react";

export const Route = createFileRoute("/messages")({
  head: () => ({ meta: [{ title: "Messages — Convoke" }, { name: "description", content: "Direct messages and space threads." }] }),
  component: Messages,
});

const threads = [
  { id: "t1", who: people[0], last: "Sent over the spec. Want to jam tomorrow?", at: "12m", unread: true },
  { id: "t2", who: people[1], last: "Reading your latency post — clean.", at: "1h", unread: false },
  { id: "t3", who: people[2], last: "Crit night moved to 7. Bring the new flow.", at: "3h", unread: true },
  { id: "t4", who: people[3], last: "+1 for the hackathon. I'll drive.", at: "Yesterday", unread: false },
];

function Messages() {
  const [active, setActive] = useState(threads[0]);
  return (
    <Shell wide>
      <div className="mx-auto max-w-[1240px] grid grid-cols-12 hairline mt-8 mb-16" style={{ minHeight: "70vh" }}>
        {/* List */}
        <aside className="col-span-12 md:col-span-4 hairline-r" style={{ borderRight: "1px solid var(--g3)" }}>
          <div className="px-5 py-4 hairline-b flex items-baseline justify-between">
            <h1 className="serif text-2xl">Messages</h1>
            <button className="mono text-[11px] uppercase text-g5 hover:text-ink">New</button>
          </div>
          <ul>
            {threads.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => setActive(t)}
                  className={"w-full text-left px-5 py-4 hairline-b flex gap-3 " + (active.id === t.id ? "bg-g1" : "hover:bg-g1")}
                >
                  <Avatar src={t.who.avatar} name={t.who.name} size={36} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="text-[14px] truncate">{t.who.name}</span>
                      <span className="mono text-[10px] text-g4 shrink-0">{t.at}</span>
                    </div>
                    <p className={"text-[13px] truncate " + (t.unread ? "text-ink" : "text-g5")}>{t.last}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Pane */}
        <section className="col-span-12 md:col-span-8 flex flex-col">
          <div className="px-7 py-4 hairline-b flex items-center gap-3">
            <Avatar src={active.who.avatar} name={active.who.name} size={32} />
            <div>
              <div className="text-[14px]">{active.who.name}</div>
              <div className="text-g5 text-[12px]">{active.who.role} · {active.who.city}</div>
            </div>
          </div>
          <div className="flex-1 px-7 py-8 space-y-6 overflow-auto">
            <Bubble from="them" who={active.who.name}>Sent over the spec. Want to jam tomorrow?</Bubble>
            <Bubble from="me" who="Leo">Yes — 11am at the loft works. Bringing the new flow.</Bubble>
            <Bubble from="them" who={active.who.name}>Perfect. I'll have coffee.</Bubble>
          </div>
          <div className="px-7 py-4 hairline-t">
            <div className="hairline rounded-md px-3 py-2 text-[14px] text-g5">Write a message…</div>
          </div>
        </section>
      </div>
    </Shell>
  );
}

function Bubble({ from, children }: { from: "me" | "them"; who: string; children: React.ReactNode }) {
  return (
    <div className={"max-w-[60%] " + (from === "me" ? "ml-auto text-right" : "")}>
      <div className={"inline-block px-4 py-2.5 text-[14px] " + (from === "me" ? "bg-ink text-paper" : "bg-g1 text-ink hairline")}>
        {children}
      </div>
    </div>
  );
}
