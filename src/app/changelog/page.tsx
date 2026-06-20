import { Shell } from "@/components/Shell";

export default function Changelog() {
  return (
    <Shell>
      <div className="mx-auto max-w-[760px] px-5 sm:px-8 py-20">
        <h1 className="serif text-5xl mb-8">Changelog</h1>
        <div className="space-y-12 mt-12">
          <article>
            <div className="eyebrow text-g5 mb-2">{new Date().toLocaleDateString()}</div>
            <h2 className="text-xl font-medium text-ink mb-4">Initial Launch</h2>
            <ul className="list-disc pl-5 text-g6 space-y-2">
              <li>Introduced the global feed and Spaces.</li>
              <li>Added unified search and navigation.</li>
              <li>Implemented passwordless authentication.</li>
            </ul>
          </article>
        </div>
      </div>
    </Shell>
  );
}
