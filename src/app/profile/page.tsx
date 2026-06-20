import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12">
      <div className="flex flex-col space-y-16">
        
        {/* Profile Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center gap-8 border-b pb-12">
          <Avatar className="h-32 w-32 md:h-40 md:w-40">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>LC</AvatarFallback>
          </Avatar>
          
          <div className="flex flex-col space-y-4">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
              @LEO &middot; CAMBRIDGE
            </span>
            <h1 className="text-6xl font-serif tracking-tight">Leo Carrillo</h1>
            <p className="text-xl text-muted-foreground">
              CS undergrad, MIT. Building quiet tools for loud problems.
            </p>
            <div className="flex items-center gap-6 pt-2 text-sm">
              <div><span className="font-semibold">12</span> <span className="text-muted-foreground">projects</span></div>
              <div><span className="font-semibold">8</span> <span className="text-muted-foreground">spaces</span></div>
              <div><span className="font-semibold">34</span> <span className="text-muted-foreground">vouches</span></div>
            </div>
          </div>
        </header>

        {/* Two Column Layout for Profile Data */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Main Content (Left) */}
          <div className="md:col-span-8 flex flex-col space-y-16">
            
            {/* Momentum */}
            <section className="flex flex-col space-y-6">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">MOMENTUM &middot; LAST 24 WEEKS</span>
              {/* GitHub style contribution graph placeholder */}
              <div className="flex flex-wrap gap-1">
                {[...Array(168)].map((_, i) => (
                  <div key={i} className={`w-3 h-3 rounded-sm ${((i * 13) % 10) > 7 ? 'bg-foreground' : ((i * 7) % 10) > 5 ? 'bg-muted-foreground/50' : 'bg-muted'}`} />
                ))}
              </div>
            </section>

            {/* Selected Work */}
            <section className="flex flex-col space-y-6">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">SELECTED WORK</span>
              <div className="flex flex-col">
                {[
                  { year: "2026", title: "Lumen — calm tools for solo founders", status: "SHIPPED" },
                  { year: "2025", title: "Mamba reading group, MIT", status: "ORGANIZED" },
                  { year: "2025", title: "Latency-aware MoE routing (paper)", status: "CO-AUTHORED" },
                  { year: "2024", title: "Campus Makers · 3,104 members", status: "FOUNDED" },
                ].map((work, idx) => (
                  <div key={idx} className="flex items-center justify-between py-6 border-b border-border last:border-0 group cursor-pointer">
                    <div className="flex items-center space-x-8">
                      <span className="text-sm text-muted-foreground font-mono">{work.year}</span>
                      <span className="text-lg text-foreground group-hover:text-primary transition-colors">{work.title}</span>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">{work.status}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar (Right) */}
          <div className="md:col-span-4 flex flex-col space-y-16">
            
            {/* Vouches */}
            <section className="flex flex-col space-y-6">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">VOUCHES</span>
              <div className="flex flex-col space-y-6">
                {[
                  { name: "Ananya Rao", quote: "Sharp, kind, ships." },
                  { name: "Marcus Hill", quote: "The taste is real." },
                  { name: "Kenji Watanabe", quote: "Carries rooms." }
                ].map((vouch, idx) => (
                  <div key={idx} className="flex gap-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>{vouch.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <span className="text-sm font-medium">{vouch.name}</span>
                      <span className="text-sm italic text-muted-foreground">&ldquo;{vouch.quote}&rdquo;</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Spaces */}
            <section className="flex flex-col space-y-6">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">SPACES</span>
              <div className="flex flex-col space-y-4">
                {[
                  { name: "Early Builders", count: "1,248" },
                  { name: "Research Collective", count: "612" },
                  { name: "Campus Makers", count: "3,104" },
                  { name: "The Design Room", count: "882" },
                ].map((space, idx) => (
                   <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-foreground/80 hover:text-foreground cursor-pointer">{space.name}</span>
                    <span className="text-muted-foreground font-mono text-xs">{space.count}</span>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
