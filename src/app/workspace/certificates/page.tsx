import Link from "next/link";
import { FileBadge2 } from "lucide-react";
import { Footer } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Panel } from "@/components/ui/panel";
import { getDashboardData } from "@/lib/platform-service";
import { ButtonLink } from "@/components/ui/button";

export default async function CertificatesPage() {
  const dashboard = await getDashboardData();

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <Link href="/workspace" className="text-sm text-bronze hover:underline">← Back to Workspace</Link>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Your Certificates</h1>
            <p className="mt-2 text-muted">Proof of your participation and momentum across the ecosystem.</p>
          </div>

          <Panel className="p-6">
            <div className="flex items-center gap-2 text-xl font-medium mb-6">
              <FileBadge2 className="size-6 text-bronze" />
              Certificates & Achievements
            </div>
            
            <div className="space-y-4">
              {dashboard.certificates.length ? (
                dashboard.certificates.map((certificate) => (
                  <div key={certificate.id} className="flex flex-col gap-2 rounded-xl border border-line bg-black/30 p-5 transition hover:border-bronze/40">
                    <p className="text-lg font-medium">{certificate.title}</p>
                    <p className="text-sm text-muted">{certificate.type} / Issued {certificate.issuedAt}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-line p-10 text-center">
                  <p className="text-lg font-medium text-foreground">Proof of work.</p>
                  <p className="mt-2 text-sm text-muted">Earn certificates by participating in the ecosystem.</p>
                  <ButtonLink href="/events" variant="secondary" className="mt-6">Find events</ButtonLink>
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
