import { Shell } from "@/components/Shell";
import { Sparkles, Users, Award, Shield } from "lucide-react";

export default function AboutPage() {
  return (
    <Shell>
      <main className="relative mx-auto max-w-[1140px] px-5 py-20 sm:px-8 lg:py-28 overflow-hidden">
        {/* Background glow devices */}
        <div className="absolute right-10 top-20 -z-10 h-[400px] w-[400px] rounded-full bg-[var(--brand)]/10 blur-[130px]" />
        <div className="absolute left-10 bottom-20 -z-10 h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(201,161,109,0.12),transparent)] blur-[100px]" />

        {/* Hero Segment */}
        <section className="text-center max-w-[840px] mx-auto">
          <p className="mono text-[11px] uppercase tracking-[0.34em] text-[var(--brand)]">The Convoke Vision</p>
          <h1 className="serif mt-6 text-5xl leading-[0.92] tracking-[-0.05em] text-ink sm:text-7xl lg:text-8xl">
            For people building the future.
          </h1>
          <p className="mt-8 text-[18px] leading-9 text-g5 font-light">
            Convoke is the operating system for student builders, ambitious founders, creator collectives, and opportunity-led ecosystems. We believe the future is built by high-agency individuals who need rooms worth entering, people worth meeting, and actions worth taking.
          </p>
        </section>

        {/* Circular Marquee Ribbon Moment */}
        <section className="relative my-24 py-6 border-y border-g3/80 overflow-hidden bg-g1/10 backdrop-blur-sm">
          <div className="flex whitespace-nowrap animate-marquee mono text-[12px] uppercase tracking-[0.25em] text-[var(--brand)] font-medium">
            <span className="mx-4">CONVOKE • FOR PEOPLE BUILDING THE FUTURE • CONVOKE • FOR PEOPLE BUILDING THE FUTURE • </span>
            <span className="mx-4">CONVOKE • FOR PEOPLE BUILDING THE FUTURE • CONVOKE • FOR PEOPLE BUILDING THE FUTURE • </span>
            <span className="mx-4">CONVOKE • FOR PEOPLE BUILDING THE FUTURE • CONVOKE • FOR PEOPLE BUILDING THE FUTURE • </span>
          </div>
        </section>

        {/* Beliefs Grid */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-12">
          {[
            {
              icon: Sparkles,
              title: "Daily Momentum",
              copy: "Built for active development, real collaboration, and daily execution, not just brochure marketing."
            },
            {
              icon: Users,
              title: "High Agency",
              copy: "We construct directories and collectives around people who write code, launch products, and solve problems."
            },
            {
              icon: Award,
              title: "Verified Reputation",
              copy: "Identity built on proof of work, projects shipped, events hosted, and trusted recommendations."
            },
            {
              icon: Shield,
              title: "Calm & Focused",
              copy: "Zero algorithmic noise, zero engagement hacks, zero advertisement. Just builder focus."
            }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="premium-card p-6 flex flex-col justify-between min-h-[220px]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink/10 border border-g3 text-[var(--brand)] mb-6">
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="text-[17px] font-semibold text-ink">{item.title}</h3>
                  <p className="mt-3 text-[13px] leading-6 text-g5">{item.copy}</p>
                </div>
              </div>
            );
          })}
        </section>

        {/* Editorial Story */}
        <section className="mt-28 max-w-[800px] mx-auto border-t border-g3/80 pt-16">
          <h2 className="serif text-3xl sm:text-4xl text-ink leading-snug">
            Our goal is to organize the world's most ambitious builder network.
          </h2>
          <div className="mt-8 space-y-6 text-[15px] leading-8 text-g5">
            <p>
              In college campuses, hacker houses, and startup hubs across the globe, builders are inventing the future. Yet the channels they use to find each other and share roles are fragmented across message groups, social platforms, and outdated job boards.
            </p>
            <p>
              Convoke brings these elements into a unified operating surface. We provide the infrastructure for organizers to run high-trust communities, host curated gatherings, and post impactful roles—all tied to a verified builder passport.
            </p>
            <p className="serif text-[18px] text-ink italic pt-4">
              "We don't build software to sell ads. We build tools for the people who will write the history of the next century."
            </p>
          </div>
        </section>
      </main>
    </Shell>
  );
}
