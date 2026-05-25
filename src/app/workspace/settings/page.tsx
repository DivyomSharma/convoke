import Link from "next/link";
import { Settings, User, Bell } from "lucide-react";
import { Footer } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Panel } from "@/components/ui/panel";
import { getDashboardData } from "@/lib/platform-service";

export default async function SettingsPage() {
  const dashboard = await getDashboardData();

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <Link href="/workspace" className="text-sm text-bronze hover:underline">← Back to Workspace</Link>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Settings</h1>
            <p className="mt-2 text-muted">Manage your profile and preferences.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-[240px_1fr]">
            <nav className="space-y-1">
              <a href="#" className="flex items-center gap-3 rounded-lg bg-white/[0.04] px-4 py-3 text-sm font-medium text-foreground">
                <User className="size-4" /> Profile Details
              </a>
              <a href="#" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted transition hover:bg-white/[0.02] hover:text-foreground">
                <Bell className="size-4" /> Notifications
              </a>
              <a href="#" className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-muted transition hover:bg-white/[0.02] hover:text-foreground">
                <Settings className="size-4" /> Preferences
              </a>
            </nav>

            <Panel className="p-6">
              <h2 className="text-xl font-medium">Account Preferences</h2>
              <p className="mt-2 text-sm text-muted">Manage your basic account details.</p>

              <form className="mt-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-muted">Display Name</label>
                  <input type="text" defaultValue={dashboard.viewer.name} disabled className="mt-2 w-full rounded-lg border border-line bg-black/40 px-4 py-3 text-foreground opacity-70" />
                  <p className="mt-2 text-xs text-muted">Managed by your SSO provider.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-muted">Username</label>
                  <input type="text" defaultValue={`@${dashboard.viewer.username}`} disabled className="mt-2 w-full rounded-lg border border-line bg-black/40 px-4 py-3 text-foreground opacity-70" />
                </div>

                <div className="rounded-xl border border-line bg-white/5 p-5">
                  <h3 className="font-medium">Public Profile & Portfolio</h3>
                  <p className="mt-1 text-sm text-muted mb-4">
                    Your bio, skills, experience timeline, and social links are managed in the Portfolio Builder.
                  </p>
                  <Link href="/workspace/profile" className="rounded-full bg-bronze/10 text-bronze px-5 py-2 text-sm font-medium transition hover:bg-bronze/20 inline-flex items-center gap-2">
                    <User className="size-4" /> Open Portfolio Builder
                  </Link>
                </div>
              </form>
            </Panel>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
