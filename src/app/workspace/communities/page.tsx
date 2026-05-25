import Link from "next/link";
import { Users } from "lucide-react";
import { Footer } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Panel } from "@/components/ui/panel";
import { getDashboardData } from "@/lib/platform-service";
import { ButtonLink } from "@/components/ui/button";

export default async function CommunitiesPage() {
  const dashboard = await getDashboardData();

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <Link href="/workspace" className="text-sm text-bronze hover:underline">← Back to Workspace</Link>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Your Communities</h1>
            <p className="mt-2 text-muted">Rooms where your identity compounds.</p>
          </div>

          <Panel className="p-6">
            <div className="flex items-center gap-2 text-xl font-medium mb-6">
              <Users className="size-6 text-bronze" />
              Joined Communities
            </div>
            
            <div className="space-y-4">
              {dashboard.communities.length ? (
                dashboard.communities.map((community) => (
                  <Link
                    key={community.id}
                    href={`/communities/${community.slug}`}
                    className="flex items-center justify-between gap-4 rounded-xl border border-line bg-black/30 p-5 transition hover:border-bronze/40"
                  >
                    <div>
                      <p className="text-lg font-medium">{community.name}</p>
                      <p className="mt-1 text-sm text-muted">{community.role}</p>
                    </div>
                    <span className="text-sm font-medium text-bronze">Enter →</span>
                  </Link>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-line p-10 text-center">
                  <p className="text-lg font-medium text-foreground">Find your people.</p>
                  <p className="mt-2 text-sm text-muted">Join rooms where ambitious builders gather.</p>
                  <ButtonLink href="/communities" variant="secondary" className="mt-6">Discover communities</ButtonLink>
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
