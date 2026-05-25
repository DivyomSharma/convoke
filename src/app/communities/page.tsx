import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Panel } from "@/components/ui/panel";
import { listCommunityDirectory } from "@/lib/platform-service";

export const metadata: Metadata = {
  title: "Communities",
  description: "Explore the real community layer inside Convoke.",
};

type CommunitiesPageProps = {
  searchParams?: Promise<{ q?: string; city?: string; category?: string }>;
};

export default async function CommunitiesPage({ searchParams }: CommunitiesPageProps) {
  const communities = await listCommunityDirectory();
  const filters = (await searchParams) ?? {};
  const q = filters.q?.trim().toLowerCase() ?? "";
  const city = filters.city?.trim().toLowerCase() ?? "";
  const category = filters.category?.trim().toLowerCase() ?? "";
  const filtered = communities.filter((community) => {
    const matchesQ = q
      ? [community.name, community.tagline, community.type].some((value) => value.toLowerCase().includes(q))
      : true;
    const matchesCity = city ? community.location.toLowerCase().includes(city) : true;
    const matchesCategory = category ? community.type.toLowerCase() === category : true;
    return matchesQ && matchesCity && matchesCategory;
  });

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] md:text-7xl">
            Communities with actual structure.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            Members, events, opportunities, announcements, and momentum should all point back to a real community.
          </p>
          <form className="mt-10 grid gap-3 rounded-[8px] border border-line bg-white/[0.03] p-4 md:grid-cols-[1fr_180px_180px_auto]">
            <input name="q" defaultValue={filters.q ?? ""} placeholder="Community, category, vibe" className="h-11 rounded-[8px] border border-line bg-black/35 px-4 text-sm outline-none" />
            <input name="city" defaultValue={filters.city ?? ""} placeholder="City" className="h-11 rounded-[8px] border border-line bg-black/35 px-4 text-sm outline-none" />
            <input name="category" defaultValue={filters.category ?? ""} placeholder="Category" className="h-11 rounded-[8px] border border-line bg-black/35 px-4 text-sm outline-none" />
            <button type="submit" className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition hover:bg-bronze hover:text-black">Apply</button>
          </form>

          {filtered.length ? (
            <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((community) => (
                <Link key={community.id} href={`/communities/${community.slug}`}>
                  <Panel className="panel-hover group overflow-hidden p-0">
                    <div className="relative h-56">
                      <Image src={community.image} alt={community.name} fill className="object-cover transition duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.88))]" />
                    </div>
                    <div className="p-5">
                      <p className="text-xs uppercase tracking-wider text-bronze">{community.type}</p>
                      <h2 className="mt-2 text-2xl font-medium">{community.name}</h2>
                      <p className="mt-3 text-sm leading-7 text-muted">{community.tagline}</p>
                      <div className="mt-4 flex items-center justify-between text-xs text-muted">
                        <span>{community.location}</span>
                        <span>{community.members.toLocaleString("en-IN")} members</span>
                      </div>
                    </div>
                  </Panel>
                </Link>
              ))}
            </div>
          ) : (
            <Panel className="mt-12 p-8">
              <p className="text-lg font-medium">No communities have been created yet.</p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
                This page stays empty until someone actually creates the first community.
              </p>
            </Panel>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
