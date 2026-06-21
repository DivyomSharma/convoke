import { Shell } from "@/components/Shell";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Admin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    redirect("/");
  }

  const [
    totalUsers,
    activeUsers,
    totalSpaces,
    totalEvents,
    liveEvents,
    totalOrganizations,
    totalOpportunities,
    totalProjects,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.session.count({ where: { expires: { gt: new Date() } } }),
    prisma.space.count(),
    prisma.event.count(),
    prisma.event.count({ where: { startTime: { lte: new Date() }, endTime: { gte: new Date() } } }),
    prisma.organization.count(),
    prisma.opportunity.count(),
    prisma.project.count(),
  ]);

  const metrics = [
    { e: "Total Members", n: totalUsers.toLocaleString(), d: "All time" },
    { e: "Active Sessions", n: activeUsers.toLocaleString(), d: "Currently active" },
    { e: "Spaces", n: totalSpaces.toLocaleString(), d: "Communities" },
    { e: "Live Events", n: liveEvents.toLocaleString(), d: `Out of ${totalEvents}` },
    { e: "Organizations", n: totalOrganizations.toLocaleString(), d: "Hubs" },
    { e: "Opportunities", n: totalOpportunities.toLocaleString(), d: "Jobs & Hackathons" },
    { e: "Projects", n: totalProjects.toLocaleString(), d: "Shipped" },
  ];

  return (
    <Shell wide>
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 py-12">
        <div className="hairline-b pb-6">
          <div className="eyebrow">Operator view</div>
          <h1 className="serif text-5xl mt-2">Admin.</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
          {metrics.map((m) => (
            <div key={m.e} className="hairline p-6">
              <div className="eyebrow">{m.e}</div>
              <div className="serif text-5xl mt-3 leading-none">{m.n}</div>
              <div className="text-g5 text-[12px] mt-2 mono">{m.d}</div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}
