import type { Metadata } from "next";
import { Footer } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Panel } from "@/components/ui/panel";

export const metadata: Metadata = {
  title: "Community",
  description: "Convoke community pages for members, events, socials, galleries, and merch collections.",
};

export default function CommunityPage() {
  return (
    <>
      <SiteHeader />
      <main className="px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="max-w-4xl text-6xl font-semibold tracking-[-0.05em] md:text-8xl">
            North Grid Societies
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            A community surface for about, socials, members, hosted events,
            galleries, and merch collections.
          </p>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {["About", "Members", "Hosted events", "Galleries", "Merch collections", "Socials"].map((item) => (
              <Panel key={item} className="min-h-48 p-5">
                <h2 className="text-2xl font-medium">{item}</h2>
                <p className="mt-4 text-sm leading-6 text-muted">
                  Modular community content with permissions and publishing controls.
                </p>
              </Panel>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
