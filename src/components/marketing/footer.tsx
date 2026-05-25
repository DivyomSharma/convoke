import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-line bg-black px-5 py-14 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <span className="text-sm font-semibold tracking-[0.18em] text-foreground">CONVOKE</span>
            <p className="mt-4 text-sm leading-7 text-muted">Where ambitious people discover events, communities, and opportunities.</p>
          </div>
          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Product</h4>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <Link href="/discover" className="text-muted transition hover:text-foreground">Discover</Link>
              <Link href="/events" className="text-muted transition hover:text-foreground">Events</Link>
              <Link href="/opportunities" className="text-muted transition hover:text-foreground">Opportunities</Link>
              <Link href="/communities" className="text-muted transition hover:text-foreground">Communities</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-muted">Organize</h4>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <Link href="/workspace/organize" className="text-muted transition hover:text-foreground">Create Event</Link>
              <Link href="/workspace/organize" className="text-muted transition hover:text-foreground">Post Opportunity</Link>
              <Link href="/merch" className="text-muted transition hover:text-foreground">Merch</Link>
              <Link href="/workspace" className="text-muted transition hover:text-foreground">Workspace</Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-medium uppercase tracking-[0.2em] text-muted">PlotArmour</h4>
            <div className="mt-4 flex flex-col gap-3 text-sm">
              <a href="https://theplotarmour.xyz" className="text-muted transition hover:text-foreground">About</a>
              <a href="https://studio.theplotarmour.xyz" className="text-muted transition hover:text-foreground">Studio</a>
              <a href="https://merch.theplotarmour.xyz" className="text-muted transition hover:text-foreground">Merch Store</a>
              <a href="https://store.theplotarmour.xyz" className="text-muted transition hover:text-foreground">Store</a>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 text-xs text-muted md:flex-row">
          <p>© {new Date().getFullYear()} Convoke by PlotArmour. Built for communities that move.</p>
          <div className="flex gap-6">
            <span className="cursor-pointer transition hover:text-foreground">Terms</span>
            <span className="cursor-pointer transition hover:text-foreground">Privacy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
