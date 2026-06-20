import { Shell } from "@/components/Shell";
import { AmbientGlow } from "@/components/AmbientGlow";
import { prisma } from "@/lib/prisma";
import { OrganizationsList } from "./OrganizationsList";

export const revalidate = 0; // Set to 0 to keep it fresh with new organization creations

export default async function OrganizationsPage() {
  // Query all organizations from database
  const orgs = await prisma.organization.findMany({
    include: {
      members: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  }).catch(() => []);

  return (
    <Shell>
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-12 relative min-h-screen">
        <AmbientGlow className="top-20 -left-20 w-[600px] h-[600px] opacity-[0.03] dark:opacity-[0.08]" color="var(--brand)" />
        
        <OrganizationsList initialOrgs={orgs} />
      </div>
    </Shell>
  );
}
