"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

export function HomeClient({ stats, feedItems, featured }: HomeClientProps) {
  // Stagger configurations for Framer Motion (without spring or bounce, calm ease)
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 15 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number], // Calm, editorial ease
      },
    },
  };

  // Split feed items by category for the editorial columns
  const eventsFeed = feedItems.filter((item) => item.tag === "LIVE NOW" || item.tag === "TONIGHT");
  const workFeed = feedItems.filter((item) => item.tag === "NEW PROJECT" || item.tag === "NOW HIRING");
  const communityFeed = feedItems.filter((item) => item.tag === "NEW COMMUNITY");

  // Get indicator dot color / tag mapping
  const getIndicator = (tag: string) => {
    switch (tag) {
      case "LIVE NOW":
        return "• LIVE";
      case "TONIGHT":
        return "• TODAY";
      case "NOW HIRING":
        return "• OPEN";
      case "NEW COMMUNITY":
        return "• TRENDING";
      default:
        return "• NEW";
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-paper flex flex-col animate-fade-in">
      {/* HERO SECTION */}
      <div className="relative flex-1 flex flex-col items-center justify-center pt-20 pb-32 z-10 px-5 sm:px-8">
        {/* 3D Tilted Marquee Background */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 dark:opacity-30 pointer-events-none"
          style={{ perspective: "1000px" }}
        >
          <div style={{ transform: "rotateX(75deg) rotateY(-10deg) scale(1.5)" }}>
            <CircularMarquee size={800} duration={40} />
          </div>
        </div>

        <div className="max-w-[800px] mx-auto text-center relative z-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="serif text-7xl md:text-9xl text-ink leading-[1] tracking-tighter mb-4"
          >
            Convoke.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl text-g5 max-w-[500px] mx-auto mb-12 font-light tracking-wide"
          >
            For people building the future.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center"
          >
            <Link
              href="/explore"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-ink text-paper rounded-full text-[15px] font-medium overflow-hidden transition-all hover:bg-ink-muted active:scale-95 shadow-2xl shadow-[var(--brand)]/10 border border-[var(--brand)]/20"
            >
              <span>Enter Campus</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* LIVE ECOSYSTEM SECTION */}
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8 pb-32 relative z-20 w-full">
        {/* Newspaper Section Title */}
        <div className="border-t border-g3 pt-12 mt-12">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-8">
            <h2 className="serif text-4xl md:text-5xl tracking-tight text-ink uppercase">
              Today on Convoke
            </h2>
            <span className="text-[11px] mono tracking-widest text-g5 uppercase">
              CAMPUS CHRONICLE • VOLUME IV •{" "}
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          {/* Statistics Bar */}
          <div className="py-6 border-y border-g3 mb-16">
            {stats.length > 0 ? (
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-sm md:text-base font-light text-g5">
                {stats.map((stat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="text-ink font-semibold">{stat.count}</span>
                    <span>{stat.label}</span>
                    {i < stats.length - 1 && <span className="text-g3 font-sans ml-6">|</span>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-g5 italic py-2">
                No activity yet. Be the first to build something.
              </div>
            )}
          </div>
        </div>

        {/* Live Feed - Magazine Grid Layout */}
        <motion.div
          variants={containerVariants}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-x-12 gap-y-12"
        >
          {/* Column 1: Live & Today Events (Large Left Column) */}
          <div className="lg:border-r lg:border-g3 lg:pr-12">
            <h3 className="text-[11px] mono tracking-widest text-g5 uppercase mb-6 pb-2 border-b border-g3">
              Campus Events & Interactive
            </h3>
            <div className="flex flex-col">
              {eventsFeed.length > 0 ? (
                eventsFeed.map((item, index) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <Link
                      href={item.link}
                      className="group block py-6 border-b border-g3 first:pt-0 last:border-b-0 transition-all duration-300 hover:translate-y-[-1px] hover:bg-ink/[0.01] px-4 -mx-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[11px] mono tracking-wider text-[#315CFF] font-semibold uppercase">
                          {getIndicator(item.tag)}
                        </span>
                        <span className="text-g4 text-[10px] mono">/</span>
                        <span className="text-g5 text-[11px] mono uppercase tracking-wider">
                          {item.tag}
                        </span>
                      </div>
                      <h4 className="serif text-3xl md:text-4xl text-ink group-hover:underline decoration-1 underline-offset-4 decoration-ink/40 transition-all">
                        {item.title}
                      </h4>
                      <div className="flex items-center justify-between mt-4 text-g5 text-[14px]">
                        <span>{item.meta}</span>
                        <span className="font-medium text-ink group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                          {item.actionText} <span className="serif">→</span>
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="text-g5 text-[14px] italic py-4">No events scheduled.</div>
              )}
            </div>
          </div>

          {/* Column 2: Building & Hiring */}
          <div className="lg:border-r lg:border-g3 lg:pr-12">
            <h3 className="text-[11px] mono tracking-widest text-g5 uppercase mb-6 pb-2 border-b border-g3">
              Building & Hiring
            </h3>
            <div className="flex flex-col">
              {workFeed.length > 0 ? (
                workFeed.map((item, index) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <Link
                      href={item.link}
                      className="group block py-5 border-b border-g3 first:pt-0 last:border-b-0 transition-all duration-300 hover:translate-y-[-1px] hover:bg-ink/[0.01] px-4 -mx-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[11px] mono tracking-wider text-[#315CFF] font-semibold uppercase">
                          {getIndicator(item.tag)}
                        </span>
                        <span className="text-g4 text-[10px] mono">/</span>
                        <span className="text-g5 text-[11px] mono uppercase tracking-wider">
                          {item.tag}
                        </span>
                      </div>
                      <h4 className="serif text-2xl text-ink group-hover:underline decoration-1 underline-offset-4 decoration-ink/40 transition-all">
                        {item.title}
                      </h4>
                      <div className="flex items-center justify-between mt-3 text-g5 text-[13px]">
                        <span className="truncate max-w-[15ch] sm:max-w-[20ch]">{item.meta}</span>
                        <span className="font-medium text-ink group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 shrink-0">
                          {item.actionText} <span className="serif">→</span>
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="text-g5 text-[14px] italic py-4">No projects launched recently.</div>
              )}
            </div>
          </div>

          {/* Column 3: New Communities */}
          <div>
            <h3 className="text-[11px] mono tracking-widest text-g5 uppercase mb-6 pb-2 border-b border-g3">
              New Collectives
            </h3>
            <div className="flex flex-col">
              {communityFeed.length > 0 ? (
                communityFeed.map((item, index) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    <Link
                      href={item.link}
                      className="group block py-5 border-b border-g3 first:pt-0 last:border-b-0 transition-all duration-300 hover:translate-y-[-1px] hover:bg-ink/[0.01] px-4 -mx-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[11px] mono tracking-wider text-[#315CFF] font-semibold uppercase">
                          {getIndicator(item.tag)}
                        </span>
                        <span className="text-g4 text-[10px] mono">/</span>
                        <span className="text-g5 text-[11px] mono uppercase tracking-wider">
                          {item.tag}
                        </span>
                      </div>
                      <h4 className="serif text-2xl text-ink group-hover:underline decoration-1 underline-offset-4 decoration-ink/40 transition-all">
                        {item.title}
                      </h4>
                      <div className="flex items-center justify-between mt-3 text-g5 text-[13px]">
                        <span className="truncate max-w-[15ch] sm:max-w-[20ch]">{item.meta}</span>
                        <span className="font-medium text-ink group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 shrink-0">
                          {item.actionText} <span className="serif">→</span>
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="text-g5 text-[14px] italic py-4">No new communities.</div>
              )}
            </div>
          </div>
        </motion.div>

        {/* FEATURED SECTIONS */}
        <div className="border-t border-g3 pt-16 mt-24">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="serif text-3xl tracking-tight text-ink uppercase">
              Featured on Campus
            </h2>
            <span className="text-[11px] mono tracking-widest text-g5 uppercase">
              EDITORIAL RECOMMENDATIONS
            </span>
          </div>

          <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4"
          >
            {/* Featured Event */}
            <motion.div
              variants={itemVariants}
              className="py-10 border-b border-g3 group md:border-r md:border-g3 md:pr-12"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] mono tracking-widest text-[var(--brand)] font-semibold uppercase">
                  Featured Event
                </span>
              </div>
              <Link href={featured.event.link} className="block">
                <h3 className="serif text-3xl md:text-4xl text-ink mb-3 group-hover:underline decoration-1 underline-offset-4 decoration-ink/40 transition-all">
                  {featured.event.title}
                </h3>
              </Link>
              <p className="text-g5 text-[15px] leading-relaxed mb-4 max-w-[65ch] line-clamp-2">
                {featured.event.description}
              </p>
              <div className="flex items-center justify-between text-g5 text-[13px] mono">
                <span className="truncate max-w-[25ch]">{featured.event.meta}</span>
                <Link
                  href={featured.event.link}
                  className="font-semibold text-ink group-hover:translate-x-0.5 transition-transform flex items-center gap-1 shrink-0"
                >
                  {featured.event.actionText} <span className="serif">→</span>
                </Link>
              </div>
            </motion.div>

            {/* Featured Organization */}
            <motion.div variants={itemVariants} className="py-10 border-b border-g3 group md:pl-12">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] mono tracking-widest text-[var(--brand)] font-semibold uppercase">
                  Featured Organization
                </span>
              </div>
              <Link href={featured.org.link} className="block">
                <h3 className="serif text-3xl md:text-4xl text-ink mb-3 group-hover:underline decoration-1 underline-offset-4 decoration-ink/40 transition-all">
                  {featured.org.title}
                </h3>
              </Link>
              <p className="text-g5 text-[15px] leading-relaxed mb-4 max-w-[65ch] line-clamp-2">
                {featured.org.description}
              </p>
              <div className="flex items-center justify-between text-g5 text-[13px] mono">
                <span className="truncate max-w-[25ch]">{featured.org.meta}</span>
                <Link
                  href={featured.org.link}
                  className="font-semibold text-ink group-hover:translate-x-0.5 transition-transform flex items-center gap-1 shrink-0"
                >
                  {featured.org.actionText} <span className="serif">→</span>
                </Link>
              </div>
            </motion.div>

            {/* Featured Project */}
            <motion.div
              variants={itemVariants}
              className="py-10 border-b border-g3 group md:border-r md:border-g3 md:pr-12"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] mono tracking-widest text-[var(--brand)] font-semibold uppercase">
                  Featured Project
                </span>
              </div>
              <Link href={featured.project.link} className="block">
                <h3 className="serif text-3xl md:text-4xl text-ink mb-3 group-hover:underline decoration-1 underline-offset-4 decoration-ink/40 transition-all">
                  {featured.project.title}
                </h3>
              </Link>
              <p className="text-g5 text-[15px] leading-relaxed mb-4 max-w-[65ch] line-clamp-2">
                {featured.project.description}
              </p>
              <div className="flex items-center justify-between text-g5 text-[13px] mono">
                <span className="truncate max-w-[25ch]">{featured.project.meta}</span>
                <Link
                  href={featured.project.link}
                  className="font-semibold text-ink group-hover:translate-x-0.5 transition-transform flex items-center gap-1 shrink-0"
                >
                  {featured.project.actionText} <span className="serif">→</span>
                </Link>
              </div>
            </motion.div>

            {/* Featured Opportunity */}
            <motion.div variants={itemVariants} className="py-10 border-b border-g3 group md:pl-12">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] mono tracking-widest text-[var(--brand)] font-semibold uppercase">
                  Featured Opportunity
                </span>
              </div>
              <Link href={featured.opportunity.link} className="block">
                <h3 className="serif text-3xl md:text-4xl text-ink mb-3 group-hover:underline decoration-1 underline-offset-4 decoration-ink/40 transition-all">
                  {featured.opportunity.title}
                </h3>
              </Link>
              <p className="text-g5 text-[15px] leading-relaxed mb-4 max-w-[65ch] line-clamp-2">
                {featured.opportunity.description}
              </p>
              <div className="flex items-center justify-between text-g5 text-[13px] mono">
                <span className="truncate max-w-[25ch]">{featured.opportunity.meta}</span>
                <Link
                  href={featured.opportunity.link}
                  className="font-semibold text-ink group-hover:translate-x-0.5 transition-transform flex items-center gap-1 shrink-0"
                >
                  {featured.opportunity.actionText} <span className="serif">→</span>
                </Link>
              </div>
            </motion.div>

            {/* Featured Builder */}
            <motion.div
              variants={itemVariants}
              className="py-10 md:border-b-0 border-b border-g3 group md:border-r md:border-g3 md:pr-12"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] mono tracking-widest text-[var(--brand)] font-semibold uppercase">
                  Featured Builder
                </span>
              </div>
              <Link href={featured.builder.link} className="block">
                <h3 className="serif text-3xl md:text-4xl text-ink mb-3 group-hover:underline decoration-1 underline-offset-4 decoration-ink/40 transition-all">
                  {featured.builder.title}
                </h3>
              </Link>
              <p className="text-g5 text-[15px] leading-relaxed mb-4 max-w-[65ch] line-clamp-2">
                {featured.builder.description}
              </p>
              <div className="flex items-center justify-between text-g5 text-[13px] mono">
                <span className="truncate max-w-[25ch]">{featured.builder.meta}</span>
                <Link
                  href={featured.builder.link}
                  className="font-semibold text-ink group-hover:translate-x-0.5 transition-transform flex items-center gap-1 shrink-0"
                >
                  {featured.builder.actionText} <span className="serif">→</span>
                </Link>
              </div>
            </motion.div>

            {/* Featured Research */}
            <motion.div variants={itemVariants} className="py-10 group md:pl-12">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] mono tracking-widest text-[var(--brand)] font-semibold uppercase">
                  Featured Research
                </span>
              </div>
              <Link href={featured.research.link} className="block">
                <h3 className="serif text-3xl md:text-4xl text-ink mb-3 group-hover:underline decoration-1 underline-offset-4 decoration-ink/40 transition-all">
                  {featured.research.title}
                </h3>
              </Link>
              <p className="text-g5 text-[15px] leading-relaxed mb-4 max-w-[65ch] line-clamp-2">
                {featured.research.description}
              </p>
              <div className="flex items-center justify-between text-g5 text-[13px] mono">
                <span className="truncate max-w-[25ch]">{featured.research.meta}</span>
                <Link
                  href={featured.research.link}
                  className="font-semibold text-ink group-hover:translate-x-0.5 transition-transform flex items-center gap-1 shrink-0"
                >
                  {featured.research.actionText} <span className="serif">→</span>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
