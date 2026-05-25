import { Panel } from "@/components/ui/panel";
import { Briefcase, CalendarDays, FileBadge2, Sparkles } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

export function StudentWorkspace({ dashboard }: { dashboard: any }) {
  return (
    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <section className="grid gap-6 lg:grid-cols-[1.06fr_0.94fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-emerald-400">Student Workspace</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em] md:text-7xl">{dashboard.viewer.name}</h1>
          <p className="mt-3 text-lg text-foreground/90">{dashboard.viewer.headline}</p>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            Track your applications, upcoming hackathons, and earned certificates. Keep building momentum.
          </p>
        </div>

        <Panel className="p-5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <div className="grid gap-3 sm:grid-cols-2 relative z-10">
            {dashboard.metrics.map((metric: any) => (
              <div key={metric.label} className="rounded-[8px] border border-line bg-black/30 px-4 py-3 backdrop-blur-sm transition-all hover:bg-white/5">
                <p className="text-xs text-muted">{metric.label}</p>
                <p className="mt-2 text-lg font-medium">{metric.value}</p>
                <p className="mt-2 text-xs text-muted">{metric.detail}</p>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="mt-12 grid gap-6 xl:grid-cols-[1fr_1fr_320px]">
        {/* Applications */}
        <Panel className="p-5 h-full">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <h2 className="flex items-center gap-2 font-medium">
              <Briefcase className="h-4 w-4 text-emerald-400" /> Active Applications
            </h2>
            <Link href="/workspace/applications" className="text-sm text-muted hover:text-foreground">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {dashboard.applications.length > 0 ? (
              dashboard.applications.map((app: any) => (
                <div key={app.id} className="rounded-lg border border-line bg-black/20 p-3 flex justify-between items-center transition-colors hover:bg-white/5">
                  <div>
                    <p className="font-medium text-sm">{app.opportunity.title}</p>
                    <p className="text-xs text-muted mt-1">{app.opportunity.organization.name}</p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded bg-white/10">{app.status}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted py-4 text-center">No active applications</p>
            )}
          </div>
        </Panel>

        {/* Events */}
        <Panel className="p-5 h-full">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <h2 className="flex items-center gap-2 font-medium">
              <CalendarDays className="h-4 w-4 text-bronze" /> Upcoming Events
            </h2>
            <Link href="/workspace/registrations" className="text-sm text-muted hover:text-foreground">
              View all
            </Link>
          </div>
          <div className="mt-4 space-y-3">
            {dashboard.registrations.length > 0 ? (
              dashboard.registrations.map((reg: any) => (
                <div key={reg.id} className="rounded-lg border border-line bg-black/20 p-3 transition-colors hover:bg-white/5">
                  <p className="font-medium text-sm">{reg.event.title}</p>
                  <p className="text-xs text-muted mt-1">{new Date(reg.event.startsAt).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted py-4 text-center">No upcoming events</p>
            )}
          </div>
        </Panel>

        {/* Actions & Certs */}
        <div className="space-y-6">
          <div className="rounded-xl border border-line bg-gradient-to-br from-emerald-500/5 to-transparent p-5">
            <h3 className="font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-400" /> Next Steps
            </h3>
            <div className="mt-4 space-y-2">
              <ButtonLink href="/discover" variant="secondary" className="w-full justify-start border-line bg-black/50">
                Discover Hackathons
              </ButtonLink>
              <ButtonLink href="/opportunities" variant="secondary" className="w-full justify-start border-line bg-black/50">
                Find Internships
              </ButtonLink>
            </div>
          </div>

          <Panel className="p-5">
            <h2 className="flex items-center gap-2 font-medium border-b border-line pb-4">
              <FileBadge2 className="h-4 w-4 text-steel" /> Certificates
            </h2>
            <div className="mt-4 space-y-3">
              {dashboard.certificates.length > 0 ? (
                dashboard.certificates.map((cert: any) => (
                  <div key={cert.id} className="rounded-lg border border-line p-3 hover:bg-white/5">
                    <p className="font-medium text-sm">{cert.title}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted">No certificates yet.</p>
              )}
            </div>
          </Panel>
        </div>
      </section>
    </div>
  );
}
