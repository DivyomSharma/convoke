"use server";

import { prisma } from "@/lib/prisma";

export type SearchResult = {
  id: string;
  type: "User" | "Event" | "Opportunity" | "Challenge" | "Space" | "Project" | "Organization" | "Research";
  title: string;
  subtitle: string;
  href: string;
};

export async function globalSearch(query: string): Promise<SearchResult[]> {
  if (!query || query.length < 2) return [];

  const safeQuery = query.toLowerCase();

  const [users, events, opportunities, spaces, projects, organizations, research] = await Promise.all([
    prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: safeQuery, mode: "insensitive" } },
          { handle: { contains: safeQuery, mode: "insensitive" } },
        ],
      },
      take: 2,
    }),
    prisma.event.findMany({
      where: { title: { contains: safeQuery, mode: "insensitive" } },
      include: { space: true },
      take: 2,
    }),
    prisma.opportunity.findMany({
      where: { title: { contains: safeQuery, mode: "insensitive" } },
      include: { organization: true },
      take: 4, // Higher take because it contains both roles and challenges
    }),
    prisma.space.findMany({
      where: { name: { contains: safeQuery, mode: "insensitive" } },
      include: { organization: true },
      take: 2,
    }),
    prisma.project.findMany({
      where: { title: { contains: safeQuery, mode: "insensitive" } },
      include: { user: true },
      take: 2,
    }),
    prisma.organization.findMany({
      where: { name: { contains: safeQuery, mode: "insensitive" } },
      take: 2,
    }),
    prisma.research.findMany({
      where: { title: { contains: safeQuery, mode: "insensitive" } },
      take: 2,
    }),
  ]);

  const results: SearchResult[] = [];

  // 1. People
  users.forEach((u) => {
    results.push({
      id: `user-${u.id}`,
      type: "User",
      title: u.name || u.handle || "Unknown",
      subtitle: u.role || "Member",
      href: `/profile/${u.handle || u.username || u.displayName || "builder"}`,
    });
  });

  // 2. Spaces
  spaces.forEach((s) => {
    results.push({
      id: `space-${s.id}`,
      type: "Space",
      title: s.name,
      subtitle: s.organization.name,
      href: `/spaces/${s.id}`,
    });
  });

  // 3. Events
  events.forEach((e) => {
    results.push({
      id: `event-${e.id}`,
      type: "Event",
      title: e.title,
      subtitle: e.space.name,
      href: `/events/${e.id}`,
    });
  });

  // 4. Opportunities (Roles & Challenges)
  opportunities.forEach((o) => {
    const isChallenge = o.type === "HACKATHON" || o.type === "CHALLENGE";
    results.push({
      id: `opp-${o.id}`,
      type: isChallenge ? "Challenge" : "Opportunity",
      title: o.title,
      subtitle: o.organization.name,
      href: isChallenge ? `/challenges/${o.id}` : `/opportunities/${o.id}`,
    });
  });

  // 5. Projects
  projects.forEach((p) => {
    results.push({
      id: `proj-${p.id}`,
      type: "Project",
      title: p.title,
      subtitle: `by ${p.user.name || "Builder"}`,
      href: `/projects/${p.id}`,
    });
  });

  // 6. Organizations
  organizations.forEach((org) => {
    results.push({
      id: `org-${org.id}`,
      type: "Organization",
      title: org.name,
      subtitle: org.industry || "Ecosystem Hub",
      href: `/org/${org.slug}`,
    });
  });

  // 7. Research
  research.forEach((r) => {
    results.push({
      id: `res-${r.id}`,
      type: "Research",
      title: r.title,
      subtitle: "Publication",
      href: "/research", // Route directly to the research list/hub
    });
  });

  return results;
}
