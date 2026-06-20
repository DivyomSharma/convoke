export default function OpportunitiesPage() {
  const roles = [
    { title: "Founding engineer", type: "ROLE", company: "LUMEN LABS", meta: "SF · onsite · $160–200k + 1.5%", deadline: "Rolling", tags: ["TypeScript", "Postgres", "0→1"] },
    { title: "Design engineer, web", type: "ROLE", company: "ARC", meta: "Remote · $140–180k", deadline: "Mar 14", tags: ["React", "Motion", "Craft"] },
    { title: "Winter research fellowship", type: "FELLOWSHIP", company: "SEQUOIA LAB", meta: "Remote · 12 weeks · $15k stipend", deadline: "Feb 28", tags: ["LLMs", "Eval"] },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-12">
      <div className="flex flex-col space-y-12">
        <header className="flex items-end justify-between border-b pb-8">
          <div className="flex flex-col space-y-4">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-mono">OPEN RIGHT NOW</span>
            <h1 className="text-5xl font-serif tracking-tight">Opportunities.</h1>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <button className="bg-foreground text-background px-4 py-2 text-xs uppercase tracking-widest font-mono border border-foreground">ALL</button>
            <button className="bg-background text-foreground hover:bg-muted transition-colors px-4 py-2 text-xs uppercase tracking-widest font-mono border border-border">ROLE</button>
            <button className="bg-background text-foreground hover:bg-muted transition-colors px-4 py-2 text-xs uppercase tracking-widest font-mono border border-border">FELLOWSHIP</button>
            <button className="bg-background text-foreground hover:bg-muted transition-colors px-4 py-2 text-xs uppercase tracking-widest font-mono border border-border">GRANT</button>
            <button className="bg-background text-foreground hover:bg-muted transition-colors px-4 py-2 text-xs uppercase tracking-widest font-mono border border-border">HACKATHON</button>
          </div>
        </header>

        <div className="flex flex-col">
          {roles.map((role, idx) => (
            <div key={idx} className="flex items-start justify-between py-10 border-b border-border last:border-0 group cursor-pointer">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-muted-foreground font-mono">
                  <span>{role.type}</span>
                  <span>&middot;</span>
                  <span>{role.company}</span>
                </div>
                <h2 className="text-3xl font-serif tracking-tight group-hover:text-primary transition-colors">{role.title}</h2>
                <p className="text-sm text-muted-foreground">{role.meta}</p>
                <div className="flex gap-2 pt-2">
                  {role.tags.map(tag => (
                    <span key={tag} className="border border-border px-2 py-1 text-xs font-mono text-muted-foreground bg-muted/50 rounded-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono">DEADLINE</span>
                <span className="text-xl font-serif">{role.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
