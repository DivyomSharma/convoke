import { MetadataRoute } from 'next';
import { hasDatabaseUrl, prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.theconvoke.xyz';
  const staticUrls = [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/opportunities`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/spaces`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/organizations`,
      lastModified: new Date(),
    },
  ];

  if (!hasDatabaseUrl) {
    return staticUrls;
  }

  try {
    const [spaces, orgs, people] = await Promise.all([
      prisma.space.findMany({ select: { id: true, updatedAt: true } }),
      prisma.organization.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.user.findMany({ select: { handle: true, id: true, updatedAt: true } }),
    ]);

    const spaceUrls = spaces.map((s) => ({
      url: `${baseUrl}/spaces/${s.id}`,
      lastModified: s.updatedAt,
    }));

    const orgUrls = orgs.map((o) => ({
      url: `${baseUrl}/org/${o.slug}`,
      lastModified: o.updatedAt,
    }));

    const profileUrls = people.map((p) => ({
      url: `${baseUrl}/profile/${p.handle || p.id}`,
      lastModified: p.updatedAt,
    }));

    return [
      ...staticUrls,
      ...spaceUrls,
      ...orgUrls,
      ...profileUrls,
    ];
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("[sitemap]", error);
    }
    return staticUrls;
  }
}
