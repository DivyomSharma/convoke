import { Panel } from "@/components/ui/panel";
import { Megaphone, Sparkles, Heart } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

export function CreatorWorkspace({ dashboard }: { dashboard: any }) {
  return (
    <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <section className="grid gap-6 lg:grid-cols-[1.06fr_0.94fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-purple-400">Creator Workspace</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em] md:text-7xl">{dashboard.viewer.name}</h1>
          <p className="mt-3 text-lg text-foreground/90">{dashboard.viewer.headline}</p>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
            Partner with ecosystems, manage your collaborations, and grow your audience.
          </p>
        </div>

        <Panel className="p-5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
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
        {/* Collaborations */}
        <Panel className="p-5 h-full">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <h2 className="flex items-center gap-2 font-medium">
              <Heart className="h-4 w-4 text-purple-400" /> Collaborations
            </h2>
          </div>
          <div className="mt-4 space-y-3">
            <p className="text-sm text-muted py-4 text-center">No active partnerships</p>
          </div>
        </Panel>

        {/* Reach */}
        <Panel className="p-5 h-full">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <h2 className="flex items-center gap-2 font-medium">
              <Megaphone className="h-4 w-4 text-steel" /> Reach
            </h2>
          </div>
          <div className="mt-4 space-y-3">
            <p className="text-sm text-muted py-4 text-center">Publish content to track impact.</p>
          </div>
        </Panel>

        {/* Actions */}
        <div className="space-y-6">
          <div className="rounded-xl border border-line bg-gradient-to-br from-purple-500/5 to-transparent p-5">
            <h3 className="font-medium flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-400" /> Quick Actions
            </h3>
            <div className="mt-4 space-y-2">
              <ButtonLink href="/discover" variant="secondary" className="w-full justify-start border-line bg-black/50">
                Find Sponsorships
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
