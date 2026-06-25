"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight, Globe, Layers, Sparkles, Users, Zap } from "lucide-react";

export default function JoinClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth out the scroll progress for animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates to a percentage (0 to 1)
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Living Glass dynamic values based on scroll
  const glassOpacity = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.8, 0.95, 0.95, 0.8]);
  const glassBlur = useTransform(smoothProgress, [0, 0.5, 1], [20, 30, 20]);
  
  // Section transitions
  const heroOpacity = useTransform(smoothProgress, [0, 0.08], [1, 0]);
  const heroY = useTransform(smoothProgress, [0, 0.08], [0, -50]);

  const problemOpacity = useTransform(smoothProgress, [0.08, 0.15, 0.22, 0.28], [0, 1, 1, 0]);
  const problemY = useTransform(smoothProgress, [0.08, 0.15, 0.22, 0.28], [50, 0, 0, -50]);

  const flywheelOpacity = useTransform(smoothProgress, [0.28, 0.35, 0.42, 0.48], [0, 1, 1, 0]);
  const flywheelY = useTransform(smoothProgress, [0.28, 0.35, 0.42, 0.48], [50, 0, 0, -50]);

  const sponsorOpacity = useTransform(smoothProgress, [0.48, 0.55, 0.62, 0.68], [0, 1, 1, 0]);
  const sponsorY = useTransform(smoothProgress, [0.48, 0.55, 0.62, 0.68], [50, 0, 0, -50]);

  const collabOpacity = useTransform(smoothProgress, [0.68, 0.75, 0.82, 0.88], [0, 1, 1, 0]);
  const collabY = useTransform(smoothProgress, [0.68, 0.75, 0.82, 0.88], [50, 0, 0, -50]);

  const finalOpacity = useTransform(smoothProgress, [0.88, 0.95], [0, 1]);
  const finalY = useTransform(smoothProgress, [0.88, 0.95], [50, 0]);

  return (
    <div ref={containerRef} className="relative w-full h-[600vh] bg-paper">
      
      {/* Living Glass Background Component */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-paper">
        {/* Subtle base gradient that shifts with mouse */}
        <motion.div 
          className="absolute inset-0 transition-opacity duration-1000"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, var(--g1) 0%, transparent 60%)`,
            opacity: glassOpacity,
          }}
        />
        
        {/* Architectural structural lines (subtle reflections) */}
        <div className="absolute top-0 left-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-g3 to-transparent opacity-30" />
        <div className="absolute top-0 right-1/4 w-[1px] h-full bg-gradient-to-b from-transparent via-g3 to-transparent opacity-30" />
        <div className="absolute top-1/3 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-g3 to-transparent opacity-30" />

        {/* The actual "glass" plane using backdrop filter */}
        <motion.div 
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${glassBlur.get()}px) saturate(120%)`,
            WebkitBackdropFilter: `blur(${glassBlur.get()}px) saturate(120%)`,
            boxShadow: `inset 0 0 0 1px color-mix(in srgb, var(--g3) 40%, transparent)`,
          }}
        />
        
        {/* Cinematic vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--paper)_100%)] opacity-80" />
      </div>

      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 md:py-8 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto">
          <Link href="/" className="serif text-2xl tracking-tight text-ink hover:opacity-80 transition-opacity">
            Convoke.
          </Link>
        </div>
        <div className="pointer-events-auto">
          <ThemeToggle />
        </div>
      </header>

      {/* Interactive Content Container */}
      <div className="fixed inset-0 pointer-events-none z-10 flex items-center justify-center">
        
        {/* 1. Hero Section */}
        <motion.div 
          style={{ opacity: heroOpacity, y: heroY }}
          className="absolute w-full max-w-4xl px-6 md:px-12 text-center pointer-events-auto flex flex-col items-center"
        >
          <h1 className="serif text-5xl md:text-7xl lg:text-8xl leading-[1.05] tracking-tight text-ink mb-8">
            Convoke makes<br />
            community building<br />
            effortless.
          </h1>
          <p className="text-g5 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12 font-sans tracking-tight">
            One platform where communities organize, collaborate, fund, publish, hire and grow.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/login" className="ink-button text-base px-8 py-3">
              Start Your Community
            </Link>
            <button className="ghost-button text-base px-8 py-3" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}>
              See How It Works
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </motion.div>

        {/* 2. Problem Section */}
        <motion.div 
          style={{ opacity: problemOpacity, y: problemY }}
          className="absolute w-full max-w-3xl px-6 md:px-12 text-center pointer-events-auto flex flex-col items-center"
        >
          <span className="eyebrow mb-6">The Current State</span>
          <h2 className="serif text-4xl md:text-6xl leading-[1.1] text-ink mb-8">
            Communities have<br />
            outgrown their tools.
          </h2>
          <div className="glass-panel p-8 md:p-12 w-full text-left relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-g1 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <p className="text-g6 text-lg md:text-xl leading-relaxed font-medium relative z-10">
              Everything is fragmented. Members in one app, events in another. Sponsors lost in emails. Identity scattered across the internet. We build complex workflows just to bring people together.
            </p>
            <div className="w-12 h-[1px] bg-g3 my-8 relative z-10" />
            <p className="text-ink text-xl md:text-2xl font-serif relative z-10">
              Communities shouldn't need disconnected systems. Everything belongs together.
            </p>
          </div>
        </motion.div>

        {/* 3. Flywheel Section */}
        <motion.div 
          style={{ opacity: flywheelOpacity, y: flywheelY }}
          className="absolute w-full max-w-4xl px-6 md:px-12 text-center pointer-events-auto flex flex-col items-center"
        >
          <span className="eyebrow mb-6">The Ecosystem</span>
          <h2 className="serif text-4xl md:text-6xl leading-[1.1] text-ink mb-12">
            The Community Flywheel
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
            <div className="premium-card p-8 flex flex-col gap-4">
              <Users className="w-6 h-6 text-brand" />
              <h3 className="serif text-2xl text-ink">People & Events</h3>
              <p className="text-g5 leading-relaxed">
                Seamless RSVPs, beautifully crafted event pages, and an integrated timeline for your community's history.
              </p>
            </div>
            <div className="premium-card p-8 flex flex-col gap-4">
              <Sparkles className="w-6 h-6 text-brand" />
              <h3 className="serif text-2xl text-ink">Identity</h3>
              <p className="text-g5 leading-relaxed">
                One unified profile. Members carry their reputation, projects, and research across every community.
              </p>
            </div>
            <div className="premium-card p-8 flex flex-col gap-4">
              <Layers className="w-6 h-6 text-brand" />
              <h3 className="serif text-2xl text-ink">Growth</h3>
              <p className="text-g5 leading-relaxed">
                Organic visibility through an interconnected network of organizations, hackers, and builders.
              </p>
            </div>
          </div>
        </motion.div>

        {/* 4. Sponsorship & Commerce */}
        <motion.div 
          style={{ opacity: sponsorOpacity, y: sponsorY }}
          className="absolute w-full max-w-3xl px-6 md:px-12 text-center pointer-events-auto flex flex-col items-center"
        >
          <span className="eyebrow mb-6">Funding & Identity</span>
          <h2 className="serif text-4xl md:text-6xl leading-[1.1] text-ink mb-8">
            Infrastructure,<br />not just outreach.
          </h2>
          <div className="glass-panel p-8 md:p-12 w-full text-left">
            <div className="flex flex-col md:flex-row gap-12">
              <div className="flex-1">
                <h3 className="text-ink font-semibold mb-3 font-sans">Sponsorships</h3>
                <p className="text-g5 leading-relaxed">
                  Funding before publishing. Sponsors become part of your infrastructure, discovering your events organically without cold outreach.
                </p>
              </div>
              <div className="w-[1px] bg-g3 hidden md:block" />
              <div className="w-full h-[1px] bg-g3 md:hidden" />
              <div className="flex-1">
                <h3 className="text-ink font-semibold mb-3 font-sans">Community Commerce</h3>
                <p className="text-g5 leading-relaxed">
                  Merchandise is identity. Identity creates visibility. With native fulfillment integration, growth funds your future initiatives effortlessly.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 5. Collaboration & AI */}
        <motion.div 
          style={{ opacity: collabOpacity, y: collabY }}
          className="absolute w-full max-w-4xl px-6 md:px-12 text-center pointer-events-auto flex flex-col items-center"
        >
          <span className="eyebrow mb-6">Network Effects</span>
          <h2 className="serif text-4xl md:text-6xl leading-[1.1] text-ink mb-8">
            Built for collaboration.
          </h2>
          <p className="text-g5 text-lg md:text-xl font-medium max-w-2xl mx-auto mb-12 font-sans tracking-tight">
            Communities shouldn't compete. They should build together. Joint events. Speaker exchanges. Collaborative research. Shared organizations.
          </p>
          
          <div className="premium-card p-6 md:p-8 w-full flex items-center justify-between text-left group cursor-default">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-g2 flex items-center justify-center border border-g3 transition-colors group-hover:bg-ink group-hover:border-ink">
                <Zap className="w-5 h-5 text-ink group-hover:text-paper transition-colors" />
              </div>
              <div>
                <h3 className="text-ink font-medium">AI Operating Layer</h3>
                <p className="text-g5 text-sm">Search becomes action. Find the right people instantly.</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-g4 group-hover:text-ink transition-colors" />
          </div>
        </motion.div>

        {/* 6. Final CTA */}
        <motion.div 
          style={{ opacity: finalOpacity, y: finalY }}
          className="absolute w-full max-w-3xl px-6 md:px-12 text-center pointer-events-auto flex flex-col items-center"
        >
          <Globe className="w-12 h-12 text-brand mb-8 opacity-80" strokeWidth={1} />
          <h2 className="serif text-5xl md:text-7xl leading-[1.05] tracking-tight text-ink mb-8">
            The future will be built<br />by communities.
          </h2>
          <p className="serif text-2xl md:text-3xl text-g5 mb-12">
            We're building where they belong.
          </p>
          <Link href="/login" className="ink-button text-lg px-10 py-4 shadow-[0_0_40px_color-mix(in_srgb,var(--brand)_20%,transparent)] hover:shadow-[0_0_60px_color-mix(in_srgb,var(--brand)_40%,transparent)] transition-all">
            Start Your Community
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
