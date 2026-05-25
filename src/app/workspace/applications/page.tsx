import Link from "next/link";
import { Briefcase } from "lucide-react";
import { Footer } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Panel } from "@/components/ui/panel";
import { getDashboardData } from "@/lib/platform-service";
import { ButtonLink } from "@/components/ui/button";

const statusStyles: Record<string, string> = {
  Approved: "bg-emerald-500/12 text-emerald-300",
  Pending: "bg-amber-500/12 text-amber-300",
  Waitlisted: "bg-white/10 text-white/70",
  Applied: "bg-steel/15 text-steel",
  Reviewing: "bg-bronze/15 text-bronze",
  Shortlisted: "bg-emerald-500/12 text-emerald-300",
  Interview: "bg-rust/15 text-rust",
  Accepted: "bg-emerald-500/12 text-emerald-300",
  Rejected: "bg-red-500/12 text-red-300",
};

function statusClass(status: string) {
  return statusStyles[status] ?? "bg-white/10 text-white/70";
}

export default async function ApplicationsPage() {
  const dashboard = await getDashboardData();

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <Link href="/workspace" className="text-sm text-bronze hover:underline">← Back to Workspace</Link>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Your Applications</h1>
            <p className="mt-2 text-muted">Track the status of roles and internships you've applied for.</p>
          </div>

          <Panel className="p-6">
            <div className="flex items-center gap-2 text-xl font-medium mb-6">
              <Briefcase className="size-6 text-bronze" />
              Applications
            </div>
            
            <div className="space-y-4">
              {dashboard.applications.length ? (
                dashboard.applications.map((application) => (
                  <div key={application.id} className="flex items-center justify-between gap-4 rounded-xl border border-line bg-black/30 p-5 transition hover:border-bronze/40">
                    <div>
                      <p className="text-lg font-medium">{application.title}</p>
                      <p className="mt-1 text-sm text-muted">{application.organization} / Applied {application.appliedAt}</p>
                    </div>
                    <span className={`rounded-full px-4 py-1.5 text-xs font-medium ${statusClass(application.status)}`}>{application.status}</span>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-line p-10 text-center">
                  <p className="text-lg font-medium text-foreground">Ambition needs an outlet.</p>
                  <p className="mt-2 text-sm text-muted">Find internships and roles to accelerate your growth.</p>
                  <ButtonLink href="/opportunities" variant="secondary" className="mt-6">Browse opportunities</ButtonLink>
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
