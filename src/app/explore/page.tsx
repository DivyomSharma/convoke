import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ExplorePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12">
      <div className="flex flex-col space-y-12">
        <header className="flex items-end justify-between border-b pb-8">
          <h1 className="text-5xl font-serif tracking-tight">Explore</h1>
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono">9 Items</span>
        </header>

        <div className="flex items-center gap-6 overflow-x-auto pb-4 scrollbar-hide text-xs uppercase tracking-widest font-medium border-b border-border/50">
          <button className="bg-foreground text-background px-3 py-1.5 rounded-sm">ALL</button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">EVENTS</button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">ROLES</button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">HACKATHONS</button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">PROJECTS</button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">DROPS</button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">VOUCHES</button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">OFFICE HOURS</button>
        </div>

        <div className="flex flex-col space-y-24 pt-4">
          {/* Feed Item 1 */}
          <article className="flex flex-col space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>AR</AvatarFallback>
                </Avatar>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="font-medium">Ananya Rao</span>
                  <span className="text-muted-foreground">&middot;</span>
                  <span className="text-muted-foreground">Founder, Lumen Labs</span>
                  <span className="text-muted-foreground">&middot;</span>
                  <span className="text-muted-foreground">12m</span>
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">LAUNCH</span>
            </div>
            
            <div className="space-y-3">
              <h2 className="text-3xl font-serif tracking-tight leading-snug">
                Launched Lumen &mdash; calm tools for solo founders.
              </h2>
              <p className="text-lg text-muted-foreground">
                Eight months of nights and weekends. First 100 users get free lifetime.
              </p>
            </div>

            <div className="w-full aspect-[16/9] bg-muted overflow-hidden relative border border-border">
              {/* Image Placeholder */}
              <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800" />
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
