"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { CircularMarquee } from "@/components/CircularMarquee";
import { CardRing } from "@/components/ui/card-ring";

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

import { HeroLogo } from "@/components/ui/hero-logo";

export function HomeClient({ stats, feedItems, featured }: HomeClientProps) {
  const phrases = [
    "Work among\nbuilders.",
    "Find your\npeople.",
    "Quiet people\nbuild loud things.",
    "The internet home\nfor builders.",
    "Find people\nworth building with.",
    "Build quietly.\nGrow together.",
    "Better work starts\nwith better company."
  ];

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && text === currentPhrase) {
      timeout = setTimeout(() => setIsDeleting(true), 4000);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    } else {
      const delay = isDeleting ? 30 : 60;
      timeout = setTimeout(() => {
        setText(currentPhrase.substring(0, text.length + (isDeleting ? -1 : 1)));
      }, delay);
    }
    return () => clearTimeout(timeout);
  }, [text, isDeleting, phraseIndex]);

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

  const textParts = text.split('\n');

  return (
    <div className="relative overflow-hidden">
      <section className="relative px-5 pt-20 pb-16 sm:px-8 sm:pt-28 sm:pb-24">
        {/* Subtle Vignette Background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_60%,rgba(0,0,0,0.85)_100%)] pointer-events-none z-10 dark:bg-transparent" />
        
        {/* Slow Marquee Ribbon */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.25] pointer-events-none hidden md:block">
          <CircularMarquee size={1400} duration={85} />
        </div>

        <div className="relative z-20 mx-auto max-w-[1240px]">
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12 lg:gap-8 pt-12 md:pt-24">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-start text-left flex-1"
            >
              {/* Tagline */}
              <div className="mono text-[11px] tracking-[0.24em] uppercase text-g4 font-medium mb-8">
                A quiet place to build
              </div>
              
              {/* Editorial Heading */}
              <h1 className="serif text-5xl leading-[1.05] tracking-tight md:text-7xl xl:text-[7.5rem] max-w-4xl text-ink font-light min-h-[3em] md:min-h-[2.5em]">
                {textParts[0]}
                {textParts.length > 1 && (
                  <>
                    <br />
                    <span className="text-[var(--brand)]">{textParts[1]}</span>
                  </>
                )}
                <span className="animate-pulse text-[var(--brand)] ml-1 opacity-60">|</span>
              </h1>
              
              {/* Description */}
              <p className="mt-8 max-w-xl text-[16px] leading-[1.6] text-g5 md:text-[18px]">
                A continuous, high-signal ecosystem where ambitious people meet, collaborate, launch startups, and grow together.
              </p>
              
              {/* Buttons */}
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <Link 
                  href="/login" 
                  className="bg-ink text-paper dark:bg-white dark:text-black rounded-full px-6 py-3 transition hover:opacity-80 font-sans font-medium text-[14px] inline-flex items-center gap-2"
                >
                  <span>Step Inside</span>
                  <span className="text-[12px] opacity-70">→</span>
                </Link>
                <Link 
                  href="/events" 
                  className="text-ink hover:underline underline-offset-4 font-sans font-medium text-[14px] transition inline-flex items-center gap-2"
                >
                  <span>Explore Events</span>
                  <span className="text-[12px] opacity-70">→</span>
                </Link>
              </div>
            </motion.div>

            {/* 3D Hero Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, rotateY: 10 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="hidden lg:flex w-full lg:w-auto shrink-0 justify-center"
            >
              <HeroLogo />
            </motion.div>
          </div>
          
          {/* Established Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-20 w-full flex items-center justify-between border-t border-g3/60 pt-6"
          >
            <div className="mono text-[11px] tracking-[0.16em] uppercase text-g4 font-medium">
              (01) ESTABLISHED MMXXVI
            </div>
            <div className="mono text-[11px] tracking-[0.16em] uppercase text-g4 font-medium">
              GLOBAL BUILDER NETWORK
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 mx-auto mt-14 max-w-[1240px] px-5 sm:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="eyebrow">Campus Feed</div>
            <h2 className="mt-3 serif text-4xl tracking-tight md:text-6xl">What's happening.</h2>
          </div>
          <div className="mono text-[11px] uppercase tracking-[0.18em] text-g4">
            A live record of work and people
          </div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="flex overflow-x-auto gap-5 pb-8 snap-x snap-mandatory scrollbar-hide -mx-5 px-5 sm:-mx-8 sm:px-8"
        >
          <FeedColumn title="Events and gatherings" items={eventsFeed} getIndicator={getIndicator} className="min-w-[85vw] md:min-w-[420px] snap-start shrink-0" />
          <FeedColumn title="Projects and roles" items={workFeed} getIndicator={getIndicator} className="min-w-[85vw] md:min-w-[420px] snap-start shrink-0" />
          <FeedColumn title="Communities and rooms" items={communityFeed} getIndicator={getIndicator} className="min-w-[85vw] md:min-w-[420px] snap-start shrink-0" />
        </motion.div>
      </section>

      <section className="relative z-10 mx-auto mt-20 max-w-[1240px] px-5 pb-24 sm:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="eyebrow">Curated signal</div>
            <h2 className="mt-3 serif text-4xl tracking-tight md:text-6xl">Featured this week.</h2>
          </div>
          <Link href="/explore" className="mono text-[12px] uppercase tracking-[0.18em] text-[var(--brand)] hover:text-ink">
            Open full registry
          </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="grid gap-5 md:grid-cols-2"
        >
          {featuredCards.map((card) => (
            <motion.div key={card.label} variants={itemVariants} className="premium-card group campus-frame p-6 md:p-7 flex flex-col justify-between hover:-translate-y-[2px] transition-transform duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] border border-[#1a1a1a] hover:border-[#2f2f2f] overflow-hidden relative">
              <div className="absolute -right-[20%] top-1/2 -translate-y-1/2 opacity-8 group-hover:opacity-25 transition-opacity duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] hidden md:block">
                <CardRing size={400} text="CONVOKE • FOR PEOPLE BUILDING THE FUTURE • " />
              </div>
              <div className="relative z-10">
                <div className="eyebrow text-[var(--brand)]">{card.label}</div>
                <Link href={card.value.link} className="mt-4 block">
                  <h3 className="serif text-3xl tracking-tight md:text-4xl">{card.value.title}</h3>
                </Link>
                <p className="mt-4 max-w-[60ch] text-[15px] leading-7 text-g5">{card.value.description}</p>
              </div>
              <div className="mt-6 relative z-10">
                {card.value.imageUrl && (
                  <Link href={card.value.link} className="block aspect-[16/9] w-full overflow-hidden rounded-md border border-g3 mb-5 bg-g1">
                     <img src={card.value.imageUrl} alt={card.value.title} className="w-full h-full object-cover" />
                  </Link>
                )}
                <div className="flex items-center justify-between gap-4 border-t border-g3 pt-4 text-[13px]">
                  <span className="text-g5">{card.value.meta}</span>
                  <Link href={card.value.link} className="font-medium text-[var(--brand)] hover:text-ink">
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

function FeedColumn({
  title,
  items,
  getIndicator,
  className = "",
}: {
  title: string;
  items: FeedItem[];
  getIndicator: (tag: string) => string;
  className?: string;
}) {
  return (
    <div className={`premium-card campus-frame p-5 md:p-6 flex-1 ${className}`}>
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
