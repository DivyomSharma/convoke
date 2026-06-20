import { Shell } from "@/components/Shell";

export default function About() {
  return (
    <Shell>
      <div className="mx-auto max-w-[760px] px-5 sm:px-8 py-20">
        <h1 className="serif text-5xl mb-8">About Convoke</h1>
        <div className="prose prose-neutral dark:prose-invert">
          <p className="mt-6 text-g6 leading-relaxed text-lg">
            Convoke is the network for ambitious builders. It is a quiet place to gather, build, and invent the future together. We believe in high signal, low noise, and authentic connections over algorithmic feeds.
          </p>
        </div>
      </div>
    </Shell>
  );
}
