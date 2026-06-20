import { notFound } from "next/navigation";
import { Shell } from "@/components/Shell";
import { Avatar } from "@/components/Avatar";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export async function generateMetadata(props: { params?: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const slug = params?.slug;
  if (!slug) return { title: "Organization not found" };

  const org = await prisma.organization.findUnique({
    where: { slug: slug },
  });

  if (!org) return { title: "Organization not found" };

  return {
    title: org.name,
    description: org.description || `${org.name} on Convoke.`,
  };
}

export default async function Org(props: { params?: Promise<{ slug: string }> }) {
  const params = await props.params;
  const slug = params?.slug;
  if (!slug) return notFound();

  const o = await prisma.organization.findUnique({
    where: { slug: slug },
    include: {
      members: { include: { user: true } },
      _count: { select: { opportunities: true, spaces: true } }
    }
  });
  
  if (!o) return notFound();

  return (
    <Shell>
      <div className="aspect-[3/1] overflow-hidden hairline-b bg-g2 flex justify-center items-center">
        <div className="text-g5">Cover Image</div>
      </div>
      <div className="mx-auto max-w-[1080px] px-5 sm:px-8 -mt-12">
        <div className="glass-panel rounded-2xl p-8 md:p-10 relative z-10">
          <div className="eyebrow">Organization · since {o.createdAt.getFullYear()}</div>
          <h1 className="serif text-5xl md:text-7xl leading-[0.95] mt-2">{o.name}</h1>
          <p className="text-g5 text-[15px] mt-3 max-w-[56ch]">{o.description || "No description provided."}</p>
          <div className="mt-6 flex gap-6 text-[13px] text-g5">
            <span><b className="text-ink">{o.members.length}</b> members</span>
            <span><b className="text-ink">{o._count.opportunities}</b> open roles</span>
            <span><b className="text-ink">{o._count.spaces}</b> spaces</span>
          </div>
        </div>

        <section className="mt-14 mb-20">
          <div className="eyebrow mb-4">Team</div>
          <ul className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8">
            {o.members.map((m) => (
              <li key={m.id} className="text-center">
                <div className="flex justify-center">
                  <Avatar src={m.user.avatarUrl || ""} name={m.user.name || "Member"} size={88} />
                </div>
                <div className="serif text-lg mt-3">{m.user.name || "Unknown"}</div>
                <div className="text-g5 text-[12px] mt-1">{m.role}</div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Shell>
  );
}
