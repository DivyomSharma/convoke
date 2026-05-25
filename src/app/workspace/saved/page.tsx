import Link from "next/link";
import { SiteHeader } from "@/components/marketing/site-header";
import { Footer } from "@/components/marketing/footer";
import { getDashboardData } from "@/lib/platform-service";
import { Panel } from "@/components/ui/panel";
import { Bookmark, CalendarDays, Briefcase, Users } from "lucide-react";
import Image from "next/image";

export default async function SavedItemsPage() {
  const dashboard = await getDashboardData();
  const { saved } = dashboard;

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8">
            <Link href="/workspace" className="text-sm text-bronze hover:underline">← Back to Workspace</Link>
            <h1 className="mt-4 flex items-center gap-3 text-4xl font-semibold tracking-[-0.04em]">
              <Bookmark className="size-8 text-bronze" /> Saved Items
            </h1>
            <p className="mt-2 text-muted">Events, opportunities, and communities you have bookmarked.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Saved Events */}
            <Panel className="p-5 flex flex-col min-h-[400px]">
              <h2 className="flex items-center gap-2 font-medium border-b border-line pb-4">
                <CalendarDays className="size-4 text-bronze" /> Saved Events
              </h2>
              <div className="mt-4 flex flex-col gap-4 flex-1">
                {saved.events && saved.events.length > 0 ? (
                  saved.events.map((event: any) => (
                    <Link key={event.id} href={`/events/${event.slug}`} className="group flex gap-3 rounded-[8px] border border-line bg-black/30 p-3 transition hover:border-bronze/40 hover:bg-white/5">
                      {event.heroImageUrl ? (
                        <Image src={event.heroImageUrl} alt={event.title} width={48} height={48} className="size-12 rounded bg-white/5 object-cover" />
                      ) : (
                        <div className="grid size-12 place-items-center rounded bg-white/5 text-muted"><CalendarDays className="size-5" /></div>
                      )}
                      <div>
                        <p className="text-sm font-medium transition group-hover:text-bronze line-clamp-1">{event.title}</p>
                        <p className="mt-1 text-xs text-muted line-clamp-1">{event.category} · {event.city}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center text-center">
                    <p className="text-sm text-muted">No saved events.</p>
                  </div>
                )}
              </div>
            </Panel>

            {/* Saved Opportunities */}
            <Panel className="p-5 flex flex-col min-h-[400px]">
              <h2 className="flex items-center gap-2 font-medium border-b border-line pb-4">
                <Briefcase className="size-4 text-emerald-400" /> Saved Opportunities
              </h2>
              <div className="mt-4 flex flex-col gap-4 flex-1">
                {saved.opportunities && saved.opportunities.length > 0 ? (
                  saved.opportunities.map((opp: any) => (
                    <Link key={opp.id} href={`/opportunities/${opp.slug}`} className="group flex flex-col gap-2 rounded-[8px] border border-line bg-black/30 p-3 transition hover:border-emerald-500/40 hover:bg-white/5">
                      <p className="text-sm font-medium transition group-hover:text-emerald-400 line-clamp-1">{opp.title}</p>
                      <p className="text-xs text-muted line-clamp-1">{opp.organization}</p>
                      <div className="mt-1 flex flex-wrap gap-2">
                        <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted">{opp.type}</span>
                        {opp.stipend && <span className="rounded bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-emerald-400">{opp.stipend}</span>}
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center text-center">
                    <p className="text-sm text-muted">No saved opportunities.</p>
                  </div>
                )}
              </div>
            </Panel>

            {/* Saved Communities */}
            <Panel className="p-5 flex flex-col min-h-[400px]">
              <h2 className="flex items-center gap-2 font-medium border-b border-line pb-4">
                <Users className="size-4 text-indigo-400" /> Saved Communities
              </h2>
              <div className="mt-4 flex flex-col gap-4 flex-1">
                {saved.communities && saved.communities.length > 0 ? (
                  saved.communities.map((comm: any) => (
                    <Link key={comm.id} href={`/communities/${comm.slug}`} className="group flex gap-3 rounded-[8px] border border-line bg-black/30 p-3 transition hover:border-indigo-400/40 hover:bg-white/5">
                      <div className="grid size-12 place-items-center rounded-full bg-indigo-500/10 text-indigo-400">
                        {comm.initials}
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium transition group-hover:text-indigo-400 line-clamp-1">{comm.name}</p>
                        <p className="mt-1 text-xs text-muted line-clamp-1">{comm.tagline}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center text-center">
                    <p className="text-sm text-muted">No saved communities.</p>
                  </div>
                )}
              </div>
            </Panel>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
