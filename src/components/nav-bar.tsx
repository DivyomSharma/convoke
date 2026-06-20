import Link from "next/link";
import { Bell, Mail, Search } from "lucide-react";

export function NavBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-8 md:gap-12">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-serif text-2xl tracking-tight">Convoke.</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/explore" className="transition-colors hover:text-foreground/80 text-foreground/60">Explore</Link>
            <Link href="/spaces" className="transition-colors hover:text-foreground/80 text-foreground/60">Spaces</Link>
            <Link href="/opportunities" className="transition-colors hover:text-foreground/80 text-foreground/60">Opportunities</Link>
            <Link href="/workspace" className="transition-colors hover:text-foreground/80 text-foreground/60">Workspace</Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex relative group">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search people, spaces, drops..."
              className="h-9 w-64 rounded-md border border-input bg-transparent pl-9 pr-12 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </button>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9">
            <Mail className="h-4 w-4" />
            <span className="sr-only">Messages</span>
          </button>
          <div className="h-8 w-8 rounded-full bg-secondary overflow-hidden border">
            {/* Avatar placeholder */}
          </div>
        </div>
      </div>
    </header>
  );
}
