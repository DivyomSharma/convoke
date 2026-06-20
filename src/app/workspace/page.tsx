import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function WorkspacePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        {/* Left Sidebar */}
        <aside className="lg:col-span-3 flex flex-col space-y-12">
          <div className="flex flex-col space-y-4 border-b pb-8">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">WORKSPACE</span>
            <h2 className="text-4xl font-serif tracking-tight">Leo Carrillo</h2>
            <p className="text-sm text-muted-foreground">CS undergrad &middot; MIT &middot; building Lumen</p>
          </div>

          <div className="flex flex-col space-y-4 border-b pb-8">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
              <span>MOMENTUM &middot; 16 WEEKS</span>
              <span className="text-foreground">+38%</span>
            </div>
            {/* Momentum Bar Chart Placeholder */}
            <div className="flex items-end gap-1 h-20 w-full">
              {[...Array(16)].map((_, i) => (
                <div key={i} className="flex-1 bg-foreground" style={{ height: `${Math.max(10, Math.random() * 100)}%` }} />
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">YOUR SPACES</span>
            <div className="flex justify-between items-center text-sm">
              <span className="text-foreground/80 hover:text-foreground cursor-pointer">Early Builders</span>
              <span className="text-muted-foreground font-mono text-xs">1,248</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-foreground/80 hover:text-foreground cursor-pointer">Research Collective</span>
              <span className="text-muted-foreground font-mono text-xs">612</span>
            </div>
          </div>
        </aside>

        {/* Main Feed */}
        <div className="lg:col-span-6 flex flex-col space-y-16">
          <section className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-2 border-b pb-4">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">TODAY &middot; FRIDAY, JUNE 19</span>
              <h1 className="text-3xl font-serif tracking-tight">What you're showing up to.</h1>
            </div>

            <div className="flex items-start gap-6 py-4 border-b">
              <div className="flex flex-col items-center">
                <span className="text-xl font-serif">7:00 PM</span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">MEETUP</span>
              </div>
              <div className="flex flex-col space-y-1">
                <h3 className="text-xl font-serif">Founders before product</h3>
                <p className="text-sm text-muted-foreground">Early Builders &middot; San Francisco &middot; 84 going</p>
              </div>
            </div>
          </section>

          <section className="flex flex-col space-y-8">
             <div className="flex flex-col space-y-2 border-b pb-4">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">APPLICATIONS IN FLIGHT</span>
            </div>
            <div className="flex items-center justify-between py-4 border-b">
               <div className="flex flex-col space-y-1">
                  <span className="text-foreground font-medium">Founding engineer &middot; Lumen Labs</span>
                  <span className="text-sm text-muted-foreground font-mono">Stage: Intro sent</span>
               </div>
               <div className="flex flex-col items-end">
                 <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">NEXT</span>
                 <span className="text-foreground">Rolling</span>
               </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <aside className="lg:col-span-3 flex flex-col space-y-12">
          <div className="flex flex-col space-y-6">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">PEOPLE TO KNOW</span>
            
            <div className="flex items-center gap-3">
               <Avatar className="h-10 w-10">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>MH</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Marcus Hill</span>
                  <span className="text-xs text-muted-foreground">ML researcher</span>
                </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
