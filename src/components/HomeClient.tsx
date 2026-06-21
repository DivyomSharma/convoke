"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { CircularMarquee } from "@/components/CircularMarquee";
import { CardRing } from "@/components/ui/card-ring";
import { HeroLogo } from "@/components/ui/hero-logo";

interface FeedItem {
  id: string;
  tag: string;
  title: string;
  meta: string;
  link: string;
  actionText: string;
  logoUrl?: string | null;
  logoName: string;
}

interface StatItem {
  count: number;
  label: string;
}

interface FeaturedItem {
  title: string;
  description: string;
  meta: string;
  link: string;
  actionText: string;
  imageUrl?: string;
}

interface HomeClientProps {
  stats: StatItem[];
  feedItems: FeedItem[];
  featured: {
    event: FeaturedItem;
    org: FeaturedItem;
    project: FeaturedItem;
    opportunity: FeaturedItem;
    builder: FeaturedItem;
    research: FeaturedItem;
  };
}

const containerVariants = {
  animate: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.64, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const phrases = [
  ["Work among", "builders."],
  ["Find your", "people."],
  ["Quiet people", "build loud things."],
  ["Find people", "worth building with."],
  ["Build quietly.", "Grow together."],
] as const;

export function HomeClient({ feedItems, featured }: HomeClientProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fullText = phrases[phraseIndex].join("\n");
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (!deleting && typed === fullText) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && typed === "") {
      timeout = setTimeout(() => {
        setDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }, 140);
    } else {
      timeout = setTimeout(() => {
        const nextLength = typed.length + (deleting ? -1 : 1);
        setTyped(fullText.slice(0, Math.max(0, nextLength)));
      }, deleting ? 18 : 42);
    }

    return () => timeout && clearTimeout(timeout);
  }, [typed, deleting, phraseIndex]);

  const rolesFeed = feedItems.filter((item) => item.tag === "NOW HIRING");
  const projectsFeed = feedItems.filter((item) => item.tag === "NEW PROJECT");
  const communityFeed = feedItems.filter((item) => item.tag === "NEW COMMUNITY");
  const upcomingMeetsFeed = feedItems.filter((item) => item.tag === "LIVE NOW" || item.tag === "TONIGHT");

  const featuredCards = [
    { label: "Featured Event", value: featured.event },
    { label: "Featured Organization", value: featured.org },
    { label: "Featured Project", value: featured.project },
    { label: "Featured Opportunity", value: featured.opportunity },
    { label: "Featured Builder", value: featured.builder },
    { label: "Featured Research", value: featured.research },
  ];

  const currentPhrase = typed.split("\n");

  return (
    <div className="relative overflow-hidden">
      <section className="relative bg-paper px-5 pb-14 pt-14 sm:px-8 sm:pb-20 sm:pt-20">
        <div className="pointer-events-none absolute inset-0 z-10 hidden dark:block dark:bg-[radial-gradient(circle_at_center,transparent_56%,rgba(0,0,0,0.82)_100%)]" />
        <div className="pointer-events-none absolute inset-0 z-10 dark:hidden bg-[radial-gradient(circle_at_center,transparent_54%,rgba(255,255,255,0.88)_100%)]" />

        <div className="pointer-events-none absolute left-1/2 top-[50%] hidden -translate-x-1/2 -translate-y-1/2 opacity-[0.34] md:block dark:opacity-[0.24]">
          <CircularMarquee size={1120} duration={85} />
        </div>

        <div className="relative z-20 mx-auto max-w-[1240px]">
          <div className="grid min-h-[calc(100svh-11rem)] items-center gap-8 lg:grid-cols-[minmax(0,0.98fr)_minmax(390px,0.9fr)] lg:gap-10 xl:grid-cols-[minmax(0,0.96fr)_minmax(500px,0.94fr)]">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="flex max-w-[820px] flex-col items-start text-left">
              <div className="mono mb-7 text-[11px] font-semibold uppercase tracking-[0.24em] text-g5">A quiet place to build</div>
              <div className="min-h-[2.18em] max-w-[980px] sm:min-h-[1.92em]">
                <motion.h1 initial={{ opacity: 0, y: 18, filter: "blur(10px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }} className="serif text-[clamp(4rem,8.15vw,7.35rem)] font-light leading-[0.9] tracking-[-0.07em] text-ink">
                  <span className="block whitespace-nowrap">{currentPhrase[0] || "\u00A0"}</span>
                  <span className="block whitespace-nowrap text-brand">
                    {currentPhrase[1] || "\u00A0"}
                    <span className="ml-3 inline-block text-brand/70" aria-hidden="true"> </span>
                  </span>
                </motion.h1>
              </div>
              <p className="mt-7 max-w-[580px] text-[16px] leading-[1.72] text-g6 md:text-[18px]">
                A continuous, high-signal ecosystem where ambitious people meet, collaborate, launch startups, and grow together.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4 sm:gap-6">
                <Link href="/auth" className="ink-button px-6 py-3 text-[14px]">
                  <span>Continue</span>
                  <ArrowRight size={14} />
                </Link>
                <Link href="/explore" className="ghost-button text-[14px]">
                  <span>Explore Convoke</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95, rotateY: 10 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }} className="hidden justify-center lg:flex">
              <HeroLogo />
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.8 }} className="mt-6 flex w-full items-center justify-between border-t border-g3/70 pt-5">
            <div className="mono text-[11px] font-medium uppercase tracking-[0.16em] text-g5">(01) Established MMXXVI</div>
            <div className="mono text-[11px] font-medium uppercase tracking-[0.16em] text-g5">Global builder network</div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-16 max-w-[1240px] px-5 sm:px-8">
        <div className="mb-7 flex flex-col gap-4 border-b border-g3/60 pb-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mono mb-3 text-[11px] uppercase tracking-[0.18em] text-brand">Campus Feed</div>
            <h2 className="serif text-4xl leading-none tracking-[-0.05em] md:text-6xl">What&apos;s happening.</h2>
          </div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] text-g5">A live record of work and people</div>
        </div>

        <motion.div variants={containerVariants} initial="initial" whileInView="animate" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 gap-7 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex flex-col gap-7">
            <FeedSection title="Upcoming Meets" empty="New meetups, workshops, seminars, and gatherings will appear here." items={upcomingMeetsFeed} footerHref="/events" footerLabel="View all meets" />
            <FeedSection title="Communities" empty="New communities will appear here as they launch." items={communityFeed} footerHref="/spaces" footerLabel="View all communities" />
          </div>
          <div className="flex flex-col gap-7">
            <FeedSection title="Open Roles" empty="Open roles from organizations will appear here." items={rolesFeed} footerHref="/opportunities" footerLabel="View all roles" />
            <FeedSection title="Projects" empty="Builder launches will appear here." items={projectsFeed} footerHref="/projects" footerLabel="View all projects" />
          </div>
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto mt-20 max-w-[1240px] px-5 pb-24 sm:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="eyebrow">Curated signal</div>
            <h2 className="mt-3 serif text-4xl tracking-tight md:text-6xl">Featured this week.</h2>
          </div>
          <Link href="/explore" className="mono text-[12px] uppercase tracking-[0.18em] text-brand hover:text-ink">
            Open full registry
          </Link>
        </div>

        <motion.div variants={containerVariants} initial="initial" animate="animate" className="grid gap-5 md:grid-cols-2">
          {featuredCards.map((card) => (
            <motion.div key={card.label} variants={itemVariants} className="premium-card group campus-frame flex flex-col justify-between overflow-hidden p-6 transition-transform duration-700 hover:-translate-y-[2px] md:p-7">
              <div className="absolute -right-[20%] top-1/2 hidden -translate-y-1/2 opacity-10 transition-opacity duration-700 group-hover:opacity-25 md:block">
                <CardRing size={400} text="CONVOKE • FOR PEOPLE BUILDING THE FUTURE • " />
              </div>
              <div className="relative z-10">
                <div className="eyebrow text-brand">{card.label}</div>
                <Link href={card.value.link} className="mt-4 block">
                  <h3 className="serif text-3xl tracking-tight md:text-4xl">{card.value.title}</h3>
                </Link>
                <p className="mt-4 max-w-[60ch] text-[15px] leading-7 text-g6">{card.value.description}</p>
              </div>
              <div className="relative z-10 mt-6">
                {card.value.imageUrl && (
                  <Link href={card.value.link} className="mb-5 block aspect-[16/9] w-full overflow-hidden rounded-[20px] border border-g3 bg-g1">
                    <img src={card.value.imageUrl} alt={card.value.title} className="h-full w-full object-cover" />
                  </Link>
                )}
                <div className="flex items-center justify-between gap-4 border-t border-g3 pt-4 text-[13px]">
                  <span className="text-g6">{card.value.meta}</span>
                  <Link href={card.value.link} className="font-medium text-brand hover:text-ink">
                    {card.value.actionText}
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}

function FeedSection({
  title,
  empty,
  items,
  footerHref,
  footerLabel,
}: {
  title: string;
  empty: string;
  items: FeedItem[];
  footerHref?: string;
  footerLabel?: string;
}) {
  return (
    <motion.div variants={itemVariants} className="premium-card p-5 sm:p-6">
      <div className="mono mb-4 text-[11px] uppercase tracking-[0.18em] text-brand">{title}</div>
      <div className="flex flex-col gap-3">
        {items.length > 0 ? items.map((item) => <FeedCard key={item.id} item={item} />) : <EmptyFeed label={empty} />}
      </div>
      {footerHref && footerLabel ? (
        <div className="mt-6 pt-2">
          <Link href={footerHref} className="inline-flex items-center gap-2 text-[14px] font-medium text-g6 transition-colors hover:text-ink">
            {footerLabel} <ArrowRight size={14} />
          </Link>
        </div>
      ) : null}
    </motion.div>
  );
}

function FeedCard({ item }: { item: FeedItem }) {
  return (
    <Link href={item.link} className="group grid grid-cols-[44px_1fr_auto] items-center gap-4 rounded-[20px] border border-g3/70 bg-paper-elevated/60 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-brand/35 hover:bg-paper-elevated">
      <Avatar src={item.logoUrl || ""} name={item.logoName || item.title} size={44} />
      <div className="min-w-0">
        <div className="mono mb-1 text-[10px] uppercase tracking-[0.16em] text-brand">{item.tag}</div>
        <h4 className="truncate text-[16px] font-semibold text-ink transition-colors group-hover:text-brand">{item.title}</h4>
        <p className="mt-1 truncate text-[13px] leading-5 text-g6">{item.meta}</p>
      </div>
      <span className="hidden items-center gap-1 text-[13px] font-medium text-g6 transition-colors group-hover:text-brand sm:inline-flex">
        {item.actionText}
        <ArrowRight size={13} />
      </span>
    </Link>
  );
}

function EmptyFeed({ label }: { label: string }) {
  return <div className="rounded-[20px] border border-dashed border-g3 bg-paper-elevated/45 p-5 text-[14px] leading-6 text-g6">{label}</div>;
}
