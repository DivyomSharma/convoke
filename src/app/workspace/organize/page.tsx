import { Footer } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { getOrganizerFormOptions } from "@/lib/platform-service";
import { OrganizeClient } from "./organize-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organize",
  description: "Create and manage your events, communities, and opportunities on Convoke.",
};

export default async function OrganizePage() {
  const options = await getOrganizerFormOptions();

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] md:text-7xl">
            Publish and operate from one place.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            Create communities, events, and opportunities directly inside Convoke. Follow the step-by-step guided flows below to publish live to the ecosystem.
          </p>

          <OrganizeClient options={options} />
        </div>
      </main>
      <Footer />
    </>
  );
}
