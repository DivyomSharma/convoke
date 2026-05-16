import type { Metadata } from "next";
import { Badge, Camera, Code2, Link2, Trophy } from "lucide-react";
import { Footer } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Panel } from "@/components/ui/panel";

type PageProps = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  return {
    title: `@${username}`,
    description: "Convoke community reputation profile.",
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;
  const socials = [Link2, Code2, Camera, Badge];

  return (
    <>
      <SiteHeader />
      <main className="px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          <Panel className="overflow-hidden">
            <div className="h-56 bg-[radial-gradient(circle_at_25%_20%,rgba(198,161,111,0.28),transparent_32%),linear-gradient(135deg,#111,#050505)]" />
            <div className="p-6 md:p-8">
              <div className="-mt-20 size-32 rounded-[8px] border border-bronze/50 bg-gradient-to-br from-bronze via-rust to-steel p-1">
                <div className="grid size-full place-items-center rounded-[6px] bg-black text-5xl font-semibold">
                  A
                </div>
              </div>
              <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
                <div>
                  <h1 className="text-5xl font-semibold tracking-[-0.04em]">
                    Arya Sen
                  </h1>
                  <p className="mt-2 text-muted">@{username}</p>
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
                    Organizer, creative technologist, sponsorship operator, and
                    volunteer lead building campus ecosystems across India.
                  </p>
                  <div className="mt-7 flex gap-3">
                    {socials.map((Icon, index) => (
                      <button key={index} className="grid size-10 place-items-center rounded-full border border-line text-muted hover:text-foreground">
                        <Icon className="size-4" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3">
                  {[
                    ["Reputation", "9.4"],
                    ["Events", "38"],
                    ["Volunteer hours", "420"],
                    ["Communities", "12"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between rounded-[8px] border border-line bg-black/35 px-4 py-3">
                      <span className="text-sm text-muted">{label}</span>
                      <span className="font-mono text-bronze">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Panel>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {["Experience timeline", "Communities", "Events participated", "Projects", "Badges", "Analytics"].map((section) => (
              <Panel key={section} className="min-h-52 p-5">
                <Trophy className="size-5 text-rust" />
                <h2 className="mt-8 text-2xl font-medium">{section}</h2>
                <p className="mt-3 text-sm leading-6 text-muted">
                  LinkedIn import and community activity hydrate this section
                  into a reputation system.
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
