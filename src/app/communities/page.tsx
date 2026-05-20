import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Users } from "lucide-react";
import { Footer } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Panel } from "@/components/ui/panel";
import { listCommunityDirectory } from "@/lib/platform-service";

export const metadata: Metadata = {
  title: "Communities",
  description: "Explore student societies, startup collectives, creator groups, NGOs, and ecosystem communities on Convoke.",
};

export default async function CommunitiesPage() {
  const communities = await listCommunityDirectory();

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] md:text-7xl">
            Communities that actually run things.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            Every community has members, events, opportunities, announcements,
            and profile presence inside the same graph.
          </p>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {communities.map((community) => (
              <Link key={community.id} href={`/communities/${community.slug}`}>
                <Panel className="group h-full overflow-hidden p-0 transition hover:-translate-y-1 hover:border-bronze/50">
                  <div className="relative h-40">
                    <Image src={community.image} alt={community.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-wider text-bronze">
                      {community.type ?? "Community"}
                    </p>
                    <h2 className="mt-2 text-xl font-medium">{community.name}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted">{community.tagline}</p>
                    <div className="mt-4 flex items-center gap-4 text-xs text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="size-3.5" />
                        {community.members.toLocaleString("en-IN")}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-3.5" />
                        {community.location}
                      </span>
                    </div>
                  </div>
                </Panel>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
