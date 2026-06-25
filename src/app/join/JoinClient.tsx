"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionTemplate, MotionValue, useMotionValue } from "framer-motion";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowRight, Globe, Layers, Sparkles, Users, Zap } from "lucide-react";

const TOTAL_FRAMES = 7;

function GlassFrame({ smoothProgress, index, mouseX, mouseY }: { smoothProgress: MotionValue<number>, index: number, mouseX: MotionValue<number>, mouseY: MotionValue<number> }) {
  const startScale = 1 - (index * 0.15);
  const endScale = startScale + 2.5;

  const scale = useTransform(smoothProgress, [0, 1], [startScale, endScale]);
  
  const opacity = useTransform(smoothProgress, (p: number) => {
    const currentScale = startScale + (p * 2.5);
    if (currentScale < 0.05) return 0;
    if (currentScale < 0.2) return (currentScale - 0.05) / 0.15;
    if (currentScale > 1.4) return 0;
    if (currentScale > 1.1) return 1 - ((currentScale - 1.1) / 0.3);
    return 1;
  });

  const blurAmount = useTransform(smoothProgress, (p: number) => {
    const currentScale = startScale + (p * 2.5);
    if (currentScale > 1) return 2;
    return 2 + ((1 - currentScale) * 8);
  });

  const backdropFilter = useMotionTemplate`blur(${blurAmount}px)`;
  
  const mouseXPercent = useTransform(mouseX, x => x * 100);
  const mouseYPercent = useTransform(mouseY, y => y * 100);
  const highlightGradient = useMotionTemplate`radial-gradient(circle at ${mouseXPercent}% ${mouseYPercent}%, color-mix(in srgb, var(--paper) 90%, transparent) 0%, transparent 60%)`;

  return (
    <motion.div
      className="absolute rounded-[40px] md:rounded-[60px] border flex items-center justify-center overflow-hidden"
      style={{
        width: "80vw",
        height: "80vh",
        maxWidth: "1200px",
        maxHeight: "800px",
        scale,
        opacity,
        backdropFilter,
        WebkitBackdropFilter: backdropFilter,
        borderColor: "color-mix(in srgb, var(--brand) 18%, transparent)",
        background: "color-mix(in srgb, var(--paper-card) 25%, transparent)",
        boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--paper) 12%, transparent), 0 20px 60px rgba(0,0,0,0.03)"
      }}
    >
      <motion.div 
        className="absolute inset-0 opacity-50 mix-blend-overlay pointer-events-none"
        style={{
          background: highlightGradient
        }}
      />
    </motion.div>
  );
}

export default function JoinClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  });

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  useEffect(() => {
    let ticking = false;
    const handleMouseMove = (e: MouseEvent) => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          mouseX.set(e.clientX / window.innerWidth);
          mouseY.set(e.clientY / window.innerHeight);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const mouseXPercent = useTransform(mouseX, x => x * 100);
  const mouseYPercent = useTransform(mouseY, y => y * 100);
  const ambientGradient = useMotionTemplate`radial-gradient(circle at ${mouseXPercent}% ${mouseYPercent}%, var(--g2) 0%, var(--paper) 80%)`;

  // Content Sections mapping
  const heroOpacity = useTransform(smoothProgress, [0, 0.1], [1, 0]);
  const heroY = useTransform(smoothProgress, [0, 0.1], [0, -40]);

  const problemOpacity = useTransform(smoothProgress, [0.1, 0.2, 0.3, 0.4], [0, 1, 1, 0]);
  const problemY = useTransform(smoothProgress, [0.1, 0.2, 0.3, 0.4], [40, 0, 0, -40]);

  const flywheelOpacity = useTransform(smoothProgress, [0.4, 0.5, 0.6, 0.65], [0, 1, 1, 0]);
  const flywheelY = useTransform(smoothProgress, [0.4, 0.5, 0.6, 0.65], [40, 0, 0, -40]);

  const sponsorOpacity = useTransform(smoothProgress, [0.65, 0.7, 0.8, 0.85], [0, 1, 1, 0]);
  const sponsorY = useTransform(smoothProgress, [0.65, 0.7, 0.8, 0.85], [40, 0, 0, -40]);

  const finalOpacity = useTransform(smoothProgress, [0.85, 0.95], [0, 1]);
  const finalY = useTransform(smoothProgress, [0.85, 0.95], [40, 0]);

  return (
    <div ref={containerRef} className="relative w-full h-[600vh] bg-paper overflow-hidden">
      
      {/* Infinite Glass Corridor */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden bg-paper">
        
        {/* Deep ambient background responding to mouse */}
        <motion.div 
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ background: ambientGradient }}
        />

        {/* Generate nested glass frames */}
        {Array.from({ length: TOTAL_FRAMES }).map((_, i) => (
          <GlassFrame 
            key={i} 
            index={TOTAL_FRAMES - 1 - i} 
            smoothProgress={smoothProgress} 
            mouseX={mouseX} 
            mouseY={mouseY} 
          />
        ))}
        
        {/* Master overlay vignette to focus center and hide edges */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--paper)_100%)] opacity-95" />
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
            <Link href="/login" className="ink-button text-base px-8 py-3 shadow-none">
              Start Your Community
            </Link>
            <button className="ghost-button text-base px-8 py-3" onClick={() => window.scrollTo({ top: window.innerHeight * 1.5, behavior: "smooth" })}>
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
          <div className="border border-g3 rounded-[24px] bg-paper-elevated p-8 md:p-12 w-full text-left relative overflow-hidden">
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
            <div className="border border-g3 rounded-[24px] bg-paper-card p-8 flex flex-col gap-4">
              <Users className="w-6 h-6 text-brand" />
              <h3 className="serif text-2xl text-ink">People & Events</h3>
              <p className="text-g5 leading-relaxed">
                Seamless RSVPs, beautifully crafted event pages, and an integrated timeline for your community's history.
              </p>
            </div>
            <div className="border border-g3 rounded-[24px] bg-paper-card p-8 flex flex-col gap-4">
              <Sparkles className="w-6 h-6 text-brand" />
              <h3 className="serif text-2xl text-ink">Identity</h3>
              <p className="text-g5 leading-relaxed">
                One unified profile. Members carry their reputation, projects, and research across every community.
              </p>
            </div>
            <div className="border border-g3 rounded-[24px] bg-paper-card p-8 flex flex-col gap-4">
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
          <div className="border border-g3 rounded-[24px] bg-paper-elevated p-8 md:p-12 w-full text-left">
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

        {/* 5. Final CTA */}
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
          <Link href="/login" className="ink-button text-lg px-10 py-4 shadow-none">
            Start Your Community
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
