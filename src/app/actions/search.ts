"use server";

import { prisma } from "@/lib/prisma";

export type SearchResult = {
  id: string;
  type: "User" | "Event" | "Opportunity" | "Space";
  title: string;
  subtitle: string;
  href: string;
};

export async function globalSearch(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  const safeQuery = query.toLowerCase();

  const [users, events, opportunities, spaces] = await Promise.all([
    prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: safeQuery, mode: "insensitive" } },
          { handle: { contains: safeQuery, mode: "insensitive" } },
        ],
      },
      take: 3,
    }),
    prisma.event.findMany({
      where: { title: { contains: safeQuery, mode: "insensitive" } },
      include: { space: true },
      take: 3,
    }),
    prisma.opportunity.findMany({
      where: { title: { contains: safeQuery, mode: "insensitive" } },
      include: { organization: true },
      take: 3,
    }),
    prisma.space.findMany({
      where: { name: { contains: safeQuery, mode: "insensitive" } },
      include: { organization: true },
      take: 3,
    }),
  ]);

  const results: SearchResult[] = [];

  users.forEach((u) => {
    results.push({
      id: `user-${u.id}`,
      type: "User",
      title: u.name || u.handle || "Unknown",
      subtitle: u.role || "Member",
      href: `/profile/${u.handle || u.id}`,
    });
  });

  spaces.forEach((s) => {
    results.push({
      id: `space-${s.id}`,
      type: "Space",
      title: s.name,
      subtitle: s.organization.name,
      href: `/spaces/${s.id}`,
    });
  });

  events.forEach((e) => {
    results.push({
      id: `event-${e.id}`,
      type: "Event",
      title: e.title,
      subtitle: e.space.name,
      href: `/explore`,
    });
  });

  opportunities.forEach((o) => {
    results.push({
      id: `opp-${o.id}`,
      type: "Opportunity",
      title: o.title,
      subtitle: o.organization.name,
      href: `/opportunities`,
    });
  });

  return results;
}
