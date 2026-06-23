import { Shell } from "@/components/Shell";
import { AmbientGlow } from "@/components/AmbientGlow";
import { prisma } from "@/lib/prisma";
import { OpportunitiesList } from "./OpportunitiesList";

export const revalidate = 0; // Fresh listing upon opportunity creations

import { auth } from "@clerk/nextjs/server";

export default async function OpportunitiesPage() {
  const opportunities = await prisma.opportunity.findMany({
    include: {
      organization: true,
      space: true,
      _count: {
        select: {
          applications: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  }).catch(() => []);

  const { userId } = await auth();

  // Fetch organizations to allow user to select which organization they belong to
  const organizations = userId ? await prisma.organization.findMany({
    where: {
      members: {
        some: {
          userId,
          role: { in: ["ADMIN", "FOUNDER"] }
        }
      }
    },
    select: {
      id: true,
      name: true,
    },
  }).catch(() => []) : [];

  return (
    <Shell>
      <div className="relative mx-auto min-h-screen max-w-[1240px] px-5 py-12 sm:px-8">
        <AmbientGlow className="bottom-0 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 opacity-[0.06]" color="var(--brand)" />

        <OpportunitiesList initialOpportunities={opportunities} organizations={organizations} />
      </div>
    </Shell>
  );
}
