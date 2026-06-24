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
        }
      }
    }
  });

  const spacesCount = await prisma.membership.count({
    where: { userId: user.id }
  });

  return {
    modes: dbUser?.modes || [],
    stats: {
      meets: dbUser?._count.meets || 0,
      spaces: spacesCount,
      projects: dbUser?._count.projects || 0,
      connections: dbUser?._count.follows || 0,
    }
  };
}
