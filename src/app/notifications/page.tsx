import { Shell } from "@/components/Shell";

export default function Notifications() {
  return (
    <Shell>
      <div className="mx-auto max-w-[640px] px-5 sm:px-8 py-12">
        <div className="hairline-b pb-5 flex items-baseline justify-between">
          <h1 className="serif text-4xl">Notifications</h1>
          <span className="mono text-[11px] text-g5 uppercase">0 unread</span>
        </div>

        <ul className="divide-y divide-g3">
           <li className="py-20 text-center text-g5 eyebrow">You're all caught up.</li>
        </ul>
      </div>
    </Shell>
  );
}
