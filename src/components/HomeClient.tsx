"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { CircularMarquee } from "@/components/CircularMarquee";

interface FeedItem {
  id: string;
  tag: string;
  title: string;
  meta: string;
  link: string;
  actionText: string;
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
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.64,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
};

export function HomeClient({ stats, feedItems, featured }: HomeClientProps) {
  const eventsFeed = feedItems.filter((item) => item.tag === "LIVE NOW" || item.tag === "TONIGHT");
  const workFeed = feedItems.filter((item) => item.tag === "NEW PROJECT" || item.tag === "NOW HIRING");
  const communityFeed = feedItems.filter((item) => item.tag === "NEW COMMUNITY");

  const getIndicator = (tag: string) => {
    switch (tag) {
      case "LIVE NOW":
        return "Live";
      case "TONIGHT":
        return "Today";
      case "NOW HIRING":
        return "Open";
      case "NEW COMMUNITY":
        return "New";
      default:
        return "Update";
    }
  };

  const featuredCards = [
    { label: "Featured Event", value: featured.event },
    { label: "Featured Organization", value: featured.org },
    { label: "Featured Project", value: featured.project },
    { label: "Featured Opportunity", value: featured.opportunity },
    { label: "Featured Builder", value: featured.builder },
    { label: "Featured Research", value: featured.research },
  ];

  return (
    <div className="relative overflow-hidden">
      <section className="relative px-5 pt-16 sm:px-8 sm:pt-20">
        <div className="absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(circle_at_top,rgba(201,161,109,0.16),transparent_54%)]" />
        <div className="absolute left-1/2 top-[10rem] -translate-x-1/2 opacity-25 dark:opacity-35">
          <div style={{ perspective: "1000px" }}>
            <div style={{ transform: "rotateX(74deg) rotateY(-9deg) scale(1.32)" }}>
              <CircularMarquee size={760} duration={42} />
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-[1240px]">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="premium-card campus-frame px-6 py-8 md:px-10 md:py-12"
          >
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--brand)]/25 bg-[color:var(--brand)]/10 px-3 py-2 mono text-[11px] uppercase tracking-[0.18em] text-[var(--brand)]">
                <Sparkles size={12} />
                India-first ambition network
              </div>
              <h1 className="mt-6 max-w-5xl serif text-6xl leading-[0.9] tracking-tight md:text-8xl xl:text-[7.5rem]">
                Where ambitious people open daily to find momentum.
              </h1>
              <p className="mt-6 max-w-2xl text-[16px] leading-8 text-g5 md:text-[18px]">
                Convoke connects communities, opportunities, projects, events, and identity into one calm operating surface for builders, founders, creators, and students.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link href="/explore" className="ink-button px-5 text-[14px] font-medium">
                  Explore the ecosystem
                  <ArrowRight size={15} />
                </Link>
                <Link href="/workspace" className="ghost-button px-5 text-[14px] font-medium">
                  Open workspace
                </Link>
              </div>
            </div>
          </motion.div>

          <div className="mt-6 border-y border-g3 px-1 py-5">
            {stats.length > 0 ? (
              <div className="flex flex-wrap gap-x-8 gap-y-3 text-[13px] text-g5 md:text-[14px]">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex items-center gap-2">
                    <span className="serif text-2xl text-ink">{stat.count}</span>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[14px] italic text-g5">
                No platform activity yet. The first event, role, space, or project will define the tone.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-14 max-w-[1240px] px-5 sm:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="eyebrow">Today on Convoke</div>
            <h2 className="mt-3 serif text-4xl tracking-tight md:text-6xl">A live surface, not a gallery wall.</h2>
          </div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] text-g4">
            Daily discovery across rooms, work, and people
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="grid gap-5 lg:grid-cols-[1.3fr_1fr_0.9fr]"
        >
          <FeedColumn title="Events and gatherings" items={eventsFeed} getIndicator={getIndicator} />
          <FeedColumn title="Projects and roles" items={workFeed} getIndicator={getIndicator} />
          <FeedColumn title="Communities and rooms" items={communityFeed} getIndicator={getIndicator} />
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto mt-20 max-w-[1240px] px-5 pb-24 sm:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="eyebrow">Curated signal</div>
            <h2 className="mt-3 serif text-4xl tracking-tight md:text-6xl">Featured across the network.</h2>
          </div>
          <Link href="/explore" className="mono text-[12px] uppercase tracking-[0.18em] text-[var(--brand)] hover:text-ink">
            Open full feed
          </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="grid gap-5 md:grid-cols-2"
        >
          {featuredCards.map((card) => (
            <motion.div key={card.label} variants={itemVariants} className="premium-card campus-frame p-6 md:p-7">
              <div className="eyebrow text-[var(--brand)]">{card.label}</div>
              <Link href={card.value.link} className="mt-4 block">
                <h3 className="serif text-3xl tracking-tight md:text-4xl">{card.value.title}</h3>
              </Link>
              <p className="mt-4 max-w-[60ch] text-[15px] leading-7 text-g5">{card.value.description}</p>
              <div className="mt-6 flex items-center justify-between gap-4 border-t border-g3 pt-4 text-[13px]">
                <span className="text-g5">{card.value.meta}</span>
                <Link href={card.value.link} className="font-medium text-[var(--brand)] hover:text-ink">
                  {card.value.actionText}
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}

function FeedColumn({
  title,
  items,
  getIndicator,
}: {
  title: string;
  items: FeedItem[];
  getIndicator: (tag: string) => string;
}) {
  return (
    <div className="premium-card campus-frame p-5 md:p-6">
      <div className="eyebrow">{title}</div>
      <div className="mt-5 flex flex-col">
        {items.length > 0 ? (
          items.map((item, index) => (
            <motion.div key={item.id} variants={itemVariants}>
              <Link
                href={item.link}
                className={`block rounded-[20px] px-3 py-4 transition hover:bg-g1 ${index > 0 ? "border-t border-g3" : ""}`}
              >
                <div className="flex items-center gap-2">
                  <span className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--brand)]">
                    {getIndicator(item.tag)}
                  </span>
                  <span className="mono text-[10px] uppercase tracking-[0.18em] text-g4">/ {item.tag}</span>
                </div>
                <h3 className="mt-3 serif text-2xl tracking-tight md:text-3xl">{item.title}</h3>
                <div className="mt-4 flex items-center justify-between gap-4 text-[13px] text-g5">
                  <span>{item.meta}</span>
                  <span className="font-medium text-ink">{item.actionText}</span>
                </div>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="px-3 py-6 text-[14px] italic text-g5">
            Nothing here yet. The next real record will light up this column.
          </div>
        )}
      </div>
    </div>
  );
}
