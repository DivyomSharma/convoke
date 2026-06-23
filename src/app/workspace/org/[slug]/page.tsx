import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { 
  Building2, 
  CalendarDays, 
  Users, 
  Megaphone, 
  Mic2, 
  Handshake, 
  Plus,
  ArrowUpRight,
  Search,
  Settings,
  ChevronRight,
  MoreVertical
} from "lucide-react";
import { Shell } from "@/components/Shell";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function OrganizationWorkspacePage(props: { params?: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params?.slug;
  if (!slug) return notFound();

  const user = await requireUser();

  const organization = await prisma.organization.findUnique({
    where: { slug },
    include: {
      members: {
        include: { user: true }
      },
      spaces: {
        include: {
          meets: {
            orderBy: { startTime: "desc" },
            take: 5
          }
        }
      },
      opportunities: {
        orderBy: { createdAt: "desc" },
        take: 5
      }
    }
  });

  if (!organization) return notFound();

  // Validate that the user is an admin or founder of this organization
  const membership = organization.members.find(m => m.userId === user.id);
  if (!membership || !["ADMIN", "FOUNDER"].includes(membership.role)) {
    redirect("/workspace");
  }

  // Define the operations tabs based on user's vision
  const operations = [
    { id: "crm", icon: <Users size={16} />, label: "People CRM", desc: "Members, Leads, Mentors", active: true },
    { id: "outreach", icon: <Megaphone size={16} />, label: "Outreach", desc: "Cold DMs & Comm", active: false },
    { id: "speakers", icon: <Mic2 size={16} />, label: "Speakers", desc: "Session management", active: false },
    { id: "sponsors", icon: <Handshake size={16} />, label: "Sponsorships", desc: "Partner pipeline", active: false },
  ];

  return (
    <Shell wide>
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 py-8">
        
        {/* Workspace Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 hairline-b pb-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-xl border border-g3 bg-g1 flex items-center justify-center shrink-0">
              {organization.logoUrl ? (
                <img src={organization.logoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <Building2 size={24} className="text-g4" />
              )}
            </div>
            <div>
              <div className="eyebrow flex items-center gap-2 text-brand">
                <span>Workspace Context</span>
                <span className="h-1 w-1 rounded-full bg-brand"></span>
                <span>{membership.role}</span>
              </div>
              <h1 className="serif mt-1 text-4xl text-ink leading-none">{organization.name}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href={`/org/${organization.slug}`} 
              target="_blank"
              className="flex items-center gap-2 rounded-full border border-g3 bg-paper-card px-4 py-2 text-[13px] font-medium text-g6 transition hover:border-g4 hover:text-ink"
            >
              Public Page <ArrowUpRight size={14} />
            </Link>
            <button className="flex items-center justify-center h-9 w-9 rounded-full border border-g3 bg-paper-card text-g6 transition hover:border-g4 hover:text-ink">
              <Settings size={14} />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          
          {/* Main Workspace Area */}
          <div className="col-span-12 lg:col-span-8 space-y-8">
            
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricBox label="Spaces" value={organization.spaces.length} />
              <MetricBox label="Core Team" value={organization.members.length} />
              <MetricBox label="Meets Hosted" value={organization.spaces.reduce((acc, space) => acc + space.meets.length, 0)} />
              <MetricBox label="Active Roles" value={organization.opportunities.length} />
            </div>

            {/* Operations Dashboard (The Missing CRM) */}
            <div className="premium-card p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="serif text-2xl text-ink">Operations HQ</h2>
                  <p className="mt-1 text-[13px] text-g5">Manage your entire ecosystem from one place.</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-g4" />
                    <input 
                      type="text" 
                      placeholder="Search CRM..." 
                      className="h-9 w-64 rounded-full border border-g3 bg-g1/30 pl-9 pr-4 text-[13px] text-ink placeholder:text-g4 outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {operations.map(op => (
                  <button 
                    key={op.id} 
                    className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                      op.active 
                        ? "border-brand/30 bg-brand/5 shadow-[0_0_15px_rgba(var(--brand-rgb),0.05)]" 
                        : "border-g3/60 bg-paper-elevated/30 hover:border-g4 hover:bg-paper-card"
                    }`}
                  >
                    <div className={`mt-0.5 rounded-lg p-2 ${op.active ? "bg-brand/10 text-brand" : "bg-g2 text-g5"}`}>
                      {op.icon}
                    </div>
                    <div>
                      <div className={`font-semibold text-[14px] ${op.active ? "text-brand" : "text-ink"}`}>
                        {op.label}
                      </div>
                      <div className="mt-1 text-[12px] text-g5">{op.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* People CRM Placeholder view */}
              <div className="rounded-xl border border-g3 bg-paper-card overflow-hidden">
                <div className="flex items-center justify-between border-b border-g3 bg-g1/30 px-4 py-3">
                  <div className="flex items-center gap-4">
                    <span className="text-[13px] font-medium text-ink">All Contacts</span>
                    <span className="text-[13px] font-medium text-g5 hover:text-ink cursor-pointer">Leads</span>
                    <span className="text-[13px] font-medium text-g5 hover:text-ink cursor-pointer">Alumni</span>
                  </div>
                  <button className="flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[12px] font-medium text-paper transition-colors hover:bg-ink-2">
                    <Plus size={14} /> Add Contact
                  </button>
                </div>
                <div className="p-8 text-center">
                  <Users size={32} className="mx-auto text-g4 mb-3" />
                  <h3 className="text-[14px] font-medium text-ink">Community CRM</h3>
                  <p className="mt-1 max-w-md mx-auto text-[13px] text-g5 leading-relaxed">
                    Track leads, members, volunteers, and partners. The full CRM interface with pipeline stages (New, Contacted, Active) will be available here.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Sidebar Area */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            
            <div className="premium-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="eyebrow text-ink">Ecosystem Spaces</div>
                <Link href="/spaces/create" className="text-brand hover:text-brand-light">
                  <Plus size={16} />
                </Link>
              </div>
              <div className="space-y-3">
                {organization.spaces.length > 0 ? (
                  organization.spaces.map(space => (
                    <Link key={space.id} href={`/spaces/${space.id}`} className="group flex items-center justify-between rounded-lg border border-g3/60 bg-paper-elevated/50 p-3 transition hover:border-brand/30">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-g2 text-g5">
                          <Building2 size={14} />
                        </div>
                        <div>
                          <div className="text-[13px] font-medium text-ink group-hover:text-brand">{space.name}</div>
                          <div className="text-[11px] text-g5">{space.type || "Community"}</div>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-g4" />
                    </Link>
                  ))
                ) : (
                  <div className="text-[13px] text-g5 p-3 border border-dashed border-g3 rounded-lg">
                    No spaces attached to this organization yet.
                  </div>
                )}
              </div>
            </div>

            <div className="premium-card p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="eyebrow text-ink">Recent Meets</div>
                <Link href="/meets/create" className="text-brand hover:text-brand-light">
                  <Plus size={16} />
                </Link>
              </div>
              <div className="space-y-3">
                {organization.spaces.flatMap(s => s.meets).length > 0 ? (
                  organization.spaces.flatMap(s => s.meets).slice(0, 5).map((meet) => (
                    <Link key={meet.id} href={`/meets/${meet.id}`} className="group flex items-center justify-between rounded-lg border border-g3/60 bg-paper-elevated/50 p-3 transition hover:border-brand/30">
                      <div>
                        <div className="text-[13px] font-medium text-ink group-hover:text-brand truncate w-48">{meet.title}</div>
                        <div className="text-[11px] text-g5 mt-0.5">
                          {new Date(meet.startTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </div>
                      </div>
                      <MoreVertical size={14} className="text-g4" />
                    </Link>
                  ))
                ) : (
                  <div className="text-[13px] text-g5 p-3 border border-dashed border-g3 rounded-lg">
                    No meets hosted yet.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </Shell>
  );
}

function MetricBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-g3 bg-paper-card p-4">
      <div className="text-2xl font-light text-ink">{value}</div>
      <div className="mono mt-1 text-[10px] uppercase tracking-wider text-g5">{label}</div>
    </div>
  );
}
