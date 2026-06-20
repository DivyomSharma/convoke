import { Shell } from "@/components/Shell";

export default function Messages() {
  return (
    <Shell>
      <div className="mx-auto max-w-[1240px] grid grid-cols-12 hairline mt-8 mb-16" style={{ minHeight: "70vh" }}>
        {/* List */}
        <aside className="col-span-12 md:col-span-4 hairline-r" style={{ borderRight: "1px solid var(--g3)" }}>
          <div className="px-5 py-4 hairline-b flex items-baseline justify-between">
            <h1 className="serif text-2xl">Messages</h1>
            <button className="mono text-[11px] uppercase text-g5 hover:text-ink">New</button>
          </div>
          <div className="w-80 shrink-0 hairline-r h-[calc(100vh-64px)] overflow-y-auto">
            <ul className="divide-y divide-g3">
              <li className="p-5 text-center text-g5 eyebrow">No messages yet.</li>
            </ul>
          </div>
        </aside>

        {/* Detail */}
        <section className="col-span-12 md:col-span-8 flex flex-col bg-g1/50 relative">
          <div className="absolute inset-0 flex items-center justify-center text-g5 eyebrow">Select a thread</div>
        </section>
      </div>
    </Shell>
  );
}
