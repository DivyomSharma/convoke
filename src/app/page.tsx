"use client";

import { Shell } from "@/components/Shell";
import { motion } from "framer-motion";
import Link from "next/link";
import { CircularMarquee } from "@/components/CircularMarquee";
import { ArrowRight, Building2, Ticket, Network, Rocket } from "lucide-react";

export default function HomePage() {
  return (
    <Shell>
      <div className="relative min-h-screen overflow-hidden bg-paper flex flex-col">
        
        {/* HERO SECTION */}
        <div className="relative flex-1 flex flex-col items-center justify-center pt-20 pb-32 z-10 px-5 sm:px-8">
          
          {/* 3D Tilted Marquee Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 dark:opacity-30 pointer-events-none" style={{ perspective: "1000px" }}>
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

        {/* Feature Grid */}
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8 pb-32 relative z-20 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: Building2, title: "Organizations", desc: "First-class editorial profiles for communities and startups." },
              { icon: Ticket, title: "Digital Passports", desc: "Beautiful Apple-Wallet style tickets for events and check-ins." },
              { icon: Rocket, title: "Challenges", desc: "Host or join global hackathons with built-in leaderboards." },
              { icon: Network, title: "Spaces", desc: "Discord-style community forums with absolute minimalism." }
            ].map((feat, i) => (
              <div key={i} className="premium-card p-8 group flex flex-col">
                <div className="w-12 h-12 rounded-2xl glass-panel flex items-center justify-center mb-6 text-[var(--brand)] group-hover:scale-110 transition-transform duration-500">
                  <feat.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="serif text-2xl text-ink mb-3">{feat.title}</h3>
                <p className="text-g5 text-[14px] leading-relaxed flex-1">{feat.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </Shell>
  );
}
