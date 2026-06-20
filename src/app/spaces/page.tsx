import { Shell } from "@/components/Shell";
import { AmbientGlow } from "@/components/AmbientGlow";
import { prisma } from "@/lib/prisma";
import { SpacesList } from "./SpacesList";

export const revalidate = 0; // Fresh listing upon space creation

export default async function SpacesPage() {
  const spaces = await prisma.space.findMany({
    include: {
      organization: {
        include: {
          members: true,
        },
      },
      _count: {
        select: {
          messages: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  }).catch(() => []);

  // Fetch organizations to allow user to select which organization they belong to
  const organizations = await prisma.organization.findMany({
    select: {
      id: true,
      name: true,
    },
  }).catch(() => []);

  return (
    <Shell>
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-12 relative min-h-screen">
        <AmbientGlow className="top-10 -right-20 w-[600px] h-[600px] opacity-[0.03] dark:opacity-[0.08]" color="var(--brand)" />
        
        <SpacesList initialSpaces={spaces} organizations={organizations} />
      </div>
    </Shell>
  );
}
