export default function SpacesPage() {
  const spaces = [
    { name: "Early Builders", type: "FOUNDERS", desc: "Founders before product-market fit." },
    { name: "Research Collective", type: "RESEARCH", desc: "Papers, critiques, weekly readings." },
    { name: "Campus Makers", type: "STUDENTS", desc: "Students shipping side projects." },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-12">
      <div className="flex flex-col space-y-12">
        <header className="flex flex-col space-y-4 border-b pb-8">
          <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono">COMMUNITIES</span>
          <h1 className="text-6xl font-serif tracking-tight">Spaces.</h1>
          <p className="text-xl text-muted-foreground">
            Small rooms with high signal. Run by the people in them &mdash; not by us.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 pt-4">
          {spaces.map((space) => (
            <article key={space.name} className="flex flex-col space-y-4 cursor-pointer group">
              <div className="w-full aspect-[4/5] bg-muted overflow-hidden relative border border-border">
                 <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="flex flex-col space-y-1 pt-2 border-t border-transparent group-hover:border-border transition-colors">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-serif tracking-tight">{space.name}</h2>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">{space.type}</span>
                </div>
                <p className="text-sm text-muted-foreground">{space.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
