import { Shell } from "@/components/Shell";
import { AmbientGlow } from "@/components/AmbientGlow";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <Shell wide>
      <div className="relative flex flex-col items-center justify-center min-h-[80vh] text-center px-5 overflow-hidden">
        <AmbientGlow />
        
        <div className="relative z-10 space-y-6 flex flex-col items-center">
          <div className="mono text-[11px] uppercase tracking-[0.2em] text-[var(--brand)]">
            Error 404
          </div>
          
          <h1 className="serif text-7xl md:text-9xl text-ink font-light tracking-tight mix-blend-difference">
            Lost
          </h1>
          
          <p className="max-w-[40ch] text-[15px] leading-relaxed text-g5 mt-4 mb-8">
            The page you are looking for has been moved, deleted, or never existed in the first place.
          </p>
          
          <Link 
            href="/" 
            className="flex items-center gap-2 px-6 py-3 border border-g3 rounded-full text-[13px] font-medium text-ink hover:bg-g1 hover:border-g4 transition-all duration-300 group"
          >
            <ArrowLeft size={14} className="text-g4 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Convoke</span>
          </Link>
        </div>
      </div>
    </Shell>
  );
}
