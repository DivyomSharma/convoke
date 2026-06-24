"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function getCommandCenterProfile() {
  const user = await requireUser();

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      modes: true,
      _count: {
        select: {
          meets: true,
          projects: true,
          follows: true,
          research: true,
        }
      }
    }
  });

  const spacesCount = await prisma.membership.count({
    where: { userId: user.id }
  });

  const pendingApps = await prisma.application.count({
    where: { userId: user.id, status: "PENDING" }
  });

  return {
    modes: dbUser?.modes || [],
    stats: {
      meets: dbUser?._count.meets || 0,
      spaces: spacesCount,
      projects: dbUser?._count.projects || 0,
      research: dbUser?._count.research || 0,
      connections: dbUser?._count.follows || 0,
    },
    aiContext: {
      pendingApps,
    }
  };
}
