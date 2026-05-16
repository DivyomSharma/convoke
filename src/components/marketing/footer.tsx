export function Footer() {
  return (
    <footer className="border-t border-line bg-black px-5 py-10 text-sm text-muted md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p>Convoke by PlotArmour. Built for communities that operate with intent.</p>
        <div className="flex flex-wrap gap-5">
          <a href="https://theplotarmour.xyz" className="hover:text-foreground">
            PlotArmour
          </a>
          <a href="https://studio.theplotarmour.xyz" className="hover:text-foreground">
            Studio
          </a>
          <a href="https://merch.theplotarmour.xyz" className="hover:text-foreground">
            Merch
          </a>
          <a href="https://store.theplotarmour.xyz" className="hover:text-foreground">
            Store
          </a>
        </div>
      </div>
    </footer>
  );
}
