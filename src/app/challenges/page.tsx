import { Shell } from "@/components/Shell";
import { AmbientGlow } from "@/components/AmbientGlow";
import { prisma } from "@/lib/prisma";
import { ChallengesList } from "./ChallengesList";

export const revalidate = 0; // Fresh listing upon challenge creations

import { auth } from "@clerk/nextjs/server";

export default async function ChallengesPage() {
  const challenges = await prisma.opportunity.findMany({
    where: {
      type: {
        in: ["HACKATHON", "CHALLENGE"],
      },
    },
    include: {
      organization: true,
      applications: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  }).catch(() => []);

  const { userId } = await auth();

  // Fetch organizations to allow user to select which organization hosts the challenge
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
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8 py-12 relative min-h-screen">
        <AmbientGlow className="top-20 -left-40 w-[800px] h-[800px] opacity-[0.03] dark:opacity-[0.08]" color="var(--brand)" />
        
        <ChallengesList initialChallenges={challenges} organizations={organizations} />
      </div>
    </Shell>
  );
}
