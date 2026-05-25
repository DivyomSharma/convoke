import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Footer } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Panel } from "@/components/ui/panel";
import { getDashboardData } from "@/lib/platform-service";
import { ButtonLink } from "@/components/ui/button";

const statusStyles: Record<string, string> = {
  Approved: "bg-emerald-500/12 text-emerald-300",
  Pending: "bg-amber-500/12 text-amber-300",
  Waitlisted: "bg-white/10 text-white/70",
  Confirmed: "bg-emerald-500/12 text-emerald-300",
};

function statusClass(status: string) {
  return statusStyles[status] ?? "bg-white/10 text-white/70";
}

export default async function RegistrationsPage() {
  const dashboard = await getDashboardData();

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <Link href="/workspace" className="text-sm text-bronze hover:underline">← Back to Workspace</Link>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Your Registrations</h1>
            <p className="mt-2 text-muted">Manage your upcoming events and waitlists.</p>
          </div>

          <Panel className="p-6">
            <div className="flex items-center gap-2 text-xl font-medium mb-6">
              <CalendarDays className="size-6 text-bronze" />
              Event Registrations
            </div>
            
            <div className="space-y-4">
              {dashboard.registrations.length ? (
                dashboard.registrations.map((registration) => (
                  <Link
                    key={registration.id}
                    href={`/events/${registration.eventSlug}`}
                    className="flex items-center justify-between gap-4 rounded-xl border border-line bg-black/30 p-5 transition hover:border-bronze/40"
                  >
                    <div>
                      <p className="text-lg font-medium">{registration.eventTitle}</p>
                      <p className="mt-1 text-sm text-muted">{registration.ticketType ?? "Registration"} / Registered {registration.createdAt}</p>
                    </div>
                    <span className={`rounded-full px-4 py-1.5 text-xs font-medium ${statusClass(registration.status)}`}>{registration.status}</span>
                  </Link>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-line p-10 text-center">
                  <p className="text-lg font-medium text-foreground">Your next collaboration starts here.</p>
                  <p className="mt-2 text-sm text-muted">Join events to build your network and momentum.</p>
                  <ButtonLink href="/events" variant="secondary" className="mt-6">Browse events</ButtonLink>
                </div>
              )}
            </div>
          </Panel>
        </div>
      </main>
      <Footer />
    </>
  );
}
