import { Panel } from "@/components/ui/panel";
import { activityFeed, dashboardStats, sponsorPipeline } from "@/data/platform";

export function CommandPreview() {
  return (
    <Panel className="relative overflow-hidden p-4 md:p-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(198,161,111,0.18),transparent_34%),radial-gradient(circle_at_90%_20%,rgba(141,161,184,0.16),transparent_30%)]" />
      <div className="relative space-y-5">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted">Live event</p>
            <h3 className="mt-2 text-xl font-medium text-foreground">
              Forge Hack weekend
            </h3>
          </div>
          <div className="rounded-full border border-rust/40 bg-rust/15 px-3 py-1 text-xs text-rust">
            Live
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {dashboardStats.map(([label, value, delta]) => (
            <div key={label} className="rounded-[8px] border border-line bg-black/35 p-4">
              <p className="text-xs text-muted">{label}</p>
              <p className="mt-3 text-2xl font-semibold">{value}</p>
              <p className="mt-1 text-xs text-steel">{delta}</p>
            </div>
          ))}
        </div>
        <div className="rounded-[8px] border border-line bg-black/35 p-4">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium">Sponsor conversations</p>
            <p className="font-mono text-xs text-muted">warm leads</p>
          </div>
          <div className="space-y-3">
            {sponsorPipeline.map(([stage, count], index) => (
              <div key={stage} className="grid grid-cols-[110px_1fr_36px] items-center gap-3 text-xs">
                <span className="text-muted">{stage}</span>
                <span className="h-1.5 overflow-hidden rounded-full bg-white/10">
                  <span
                    className="block h-full rounded-full bg-gradient-to-r from-rust via-bronze to-steel"
                    style={{ width: `${86 - index * 13}%` }}
                  />
                </span>
                <span className="text-right font-mono text-foreground">{count}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[8px] border border-line bg-black/35 p-4">
          <p className="mb-4 text-sm font-medium">People making it happen</p>
          <div className="space-y-3">
            {activityFeed.slice(0, 3).map(([name, action, time]) => (
              <div key={`${name}-${time}`} className="flex items-center gap-3 text-xs">
                <span className="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-bronze to-rust font-medium text-black">
                  {name[0]}
                </span>
                <span className="min-w-0 flex-1 text-muted">
                  <span className="text-foreground">{name}</span> {action}
                </span>
                <span className="font-mono text-muted/70">{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Panel>
  );
}
