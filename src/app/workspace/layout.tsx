"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Building2, 
  CalendarDays, 
  Briefcase, 
  Users, 
  Target, 
  Folder, 
  BookOpen, 
  Settings, 
  ArrowLeft,
  ChevronDown
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/workspace", icon: Folder, exact: true },
    { name: "Spaces", href: "/workspace/spaces", icon: Users },
    { name: "Organizations", href: "/workspace/organizations", icon: Building2 },
    { name: "Events", href: "/workspace/events", icon: CalendarDays },
    { name: "Challenges", href: "/workspace/challenges", icon: Target },
    { name: "Opportunities", href: "/workspace/opportunities", icon: Briefcase },
    { name: "Projects", href: "/workspace/projects", icon: Folder },
    { name: "Research", href: "/workspace/research", icon: BookOpen },
  ];

  return (
    <div className="flex min-h-screen bg-paper text-ink">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-g3 bg-paper-card flex flex-col hidden md:flex shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-g3">
          <Link href="/" className="serif text-[22px] tracking-tight text-ink">
            Convoke.
          </Link>
          <span className="ml-2 px-1.5 py-0.5 rounded bg-g2 text-g5 text-[10px] mono uppercase tracking-wider font-semibold">
            OS
          </span>
        </div>

        <div className="p-4 flex-1 overflow-y-auto">
          <div className="eyebrow text-g5 mb-3 px-2">Management</div>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                    isActive 
                      ? "bg-g2 text-ink" 
                      : "text-g6 hover:bg-g1 hover:text-ink"
                  }`}
                >
                  <item.icon size={16} className={isActive ? "text-brand" : "text-g5"} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-g3 space-y-3">
          <button 
            onClick={() => { signOut(); router.push('/'); }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium text-g6 hover:bg-g1 hover:text-ink transition-colors"
          >
            Sign Out
          </button>
          <div className="flex items-center gap-3 px-3">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-g3 bg-paper flex items-center px-6 justify-between shrink-0">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-g5 hover:text-ink flex items-center gap-2 text-[13px] font-medium transition-colors">
              <ArrowLeft size={16} /> Return to Network
            </Link>
          </div>
          <div className="flex items-center gap-3">
             <div className="text-[13px] font-medium">
               {user?.fullName}
             </div>
             <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-paper font-semibold text-sm">
               {user?.fullName?.charAt(0) || "U"}
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-g1/20">
          <div className="max-w-5xl mx-auto p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
