import type { MetadataRoute } from "next";
import { getPrisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://convoke.app";
  const staticRoutes = ["", "/discover", "/events", "/opportunities", "/communities", "/merch", "/workspace", "/workspace/organize", "/auth/sign-in"];

  if (!process.env.DATABASE_URL) {
    return staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
    }));
  }

  const prisma = getPrisma();
  const [events, communities, profiles, opportunities] = await Promise.all([
    prisma.event.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.community.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.user.findMany({ select: { username: true, updatedAt: true } }),
    prisma.opportunity.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  return [
    ...staticRoutes.map((route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
    })),
    ...events.map((event) => ({
      url: `${baseUrl}/events/${event.slug}`,
      lastModified: event.updatedAt,
    })),
    ...communities.map((community) => ({
      url: `${baseUrl}/communities/${community.slug}`,
      lastModified: community.updatedAt,
    })),
    ...opportunities.map((opportunity) => ({
      url: `${baseUrl}/opportunities/${opportunity.slug}`,
      lastModified: opportunity.updatedAt,
    })),
    ...profiles.map((profile) => ({
      url: `${baseUrl}/u/${profile.username}`,
      lastModified: profile.updatedAt,
    })),
  ];
}
