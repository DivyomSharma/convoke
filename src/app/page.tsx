"use client";

import { Shell } from "@/components/Shell";
import { motion } from "framer-motion";
import Link from "next/link";
import { AmbientGlow } from "@/components/AmbientGlow";
import { ArrowRight, Sparkles, Building2, Ticket, Network, Rocket } from "lucide-react";

export default function HomePage() {
  return (
    <Shell>
      <div className="relative min-h-screen overflow-hidden bg-paper">
        {/* Soft elegant glows */}
        <AmbientGlow className="top-0 left-1/4 w-[800px] h-[800px] opacity-10" color="var(--ink)" />
        
        <div className="mx-auto max-w-[1200px] px-5 sm:px-8 pt-32 pb-24 relative z-10">
          
          <div className="max-w-[800px] mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8"
            >
              <Sparkles size={14} className="text-g5" />
              <span className="text-[13px] font-medium text-ink">The Digital Campus for Builders</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="serif text-6xl md:text-8xl text-ink leading-[1.05] tracking-tight mb-6"
            >
              Where ambitious<br/>
              <span className="text-g4 italic">people gather.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="text-lg md:text-xl text-g5 max-w-[500px] mx-auto mb-10 leading-relaxed font-light"
            >
              Convoke is the operating system for your ambition. A beautiful, unified ecosystem for events, hackathons, and organizations.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link 
                href="/explore" 
                className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-ink text-paper rounded-full text-[15px] font-medium overflow-hidden transition-transform hover:scale-105 active:scale-95"
              >
                <span>Enter Campus</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Feature Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-32"
          >
            {[
              { icon: Building2, title: "Organizations", desc: "First-class editorial profiles for communities and startups." },
              { icon: Ticket, title: "Digital Passports", desc: "Beautiful Apple-Wallet style tickets for events and check-ins." },
              { icon: Rocket, title: "Challenges", desc: "Host or join global hackathons with built-in leaderboards." },
              { icon: Network, title: "Spaces", desc: "Discord-style community forums with absolute minimalism." }
            ].map((feat, i) => (
              <div key={i} className="premium-card p-8 group">
                <div className="w-12 h-12 rounded-2xl glass-panel flex items-center justify-center mb-6 text-ink group-hover:scale-110 transition-transform duration-500">
                  <feat.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="serif text-2xl text-ink mb-3">{feat.title}</h3>
                <p className="text-g5 text-[14px] leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </Shell>
  );
}
