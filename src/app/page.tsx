import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center container mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <main className="flex flex-col items-center text-center space-y-12 max-w-4xl">
        <div className="flex flex-col space-y-6">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
            V2.0 &middot; TIMELY & TIMELESS
          </span>
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif tracking-tight text-foreground leading-[1.1]">
            Build your future together.
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mx-auto font-sans font-light">
            Convoke is the place where students, founders, creators, developers, researchers, and communities gather to craft what's next.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6 pt-8">
          <Link 
            href="/explore"
            className="flex items-center gap-2 bg-foreground text-background px-8 py-4 text-sm font-medium tracking-wide hover:bg-foreground/90 transition-all rounded-sm"
          >
            Start Exploring
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link 
            href="/login"
            className="flex items-center gap-2 bg-transparent text-foreground px-8 py-4 text-sm font-medium tracking-wide border border-border hover:bg-muted transition-all rounded-sm"
          >
            Log in
          </Link>
        </div>

        {/* Feature Grid / Social Proof Placeholder */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-24 border-t border-border/50 w-full text-left">
          <div className="flex flex-col space-y-2">
            <span className="text-3xl font-serif">100k+</span>
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Builders</span>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-3xl font-serif">1k+</span>
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Organizations</span>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-3xl font-serif">Zero</span>
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Noise</span>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-3xl font-serif">High</span>
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Signal</span>
          </div>
        </div>
      </main>
    </div>
  );
}
