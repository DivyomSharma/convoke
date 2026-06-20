import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { events, opportunities, orgs, people, spaces } from "../../../../prisma/seed-data";

export async function GET(request: Request) {
  // Basic security check to prevent accidental re-seeding in production
  // You can pass ?secret=convoke123 to authorize the seed
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== "convoke123") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("Start seeding from Vercel...");

    // 1. Seed Users (people)
    for (const p of people) {
      await prisma.user.upsert({
        where: { handle: p.handle },
        update: {},
        create: {
          id: p.handle,
          email: `${p.handle}@example.com`,
          name: p.name,
          handle: p.handle,
          avatarUrl: p.avatar,
          role: p.role,
          university: p.city,
        },
      });
    }

    // 2. Seed Organizations
    for (const o of orgs) {
      await prisma.organization.upsert({
        where: { slug: o.slug },
        update: {},
        create: {
          id: o.slug,
          name: o.name,
          slug: o.slug,
          description: o.kind,
        },
      });
    }

    // 3. Seed Spaces
    for (const s of spaces) {
      const firstOrg = orgs[0];
      
      // Upsert space using ID from mock data if it had one, or create if not exists
      // We will just do a findFirst to check if it exists by name to avoid duplicates
      const existing = await prisma.space.findFirst({ where: { name: s.name } });
      if (!existing) {
        await prisma.space.create({
          data: {
            name: s.name,
            description: s.tagline,
            organizationId: firstOrg.slug,
          },
        });
      }
    }

    // 4. Seed Events
    const firstSpace = await prisma.space.findFirst();
    if (firstSpace) {
      for (const e of events) {
        const existing = await prisma.event.findFirst({ where: { title: e.title } });
        if (!existing) {
          await prisma.event.create({
            data: {
              title: e.title,
              spaceId: firstSpace.id,
              startTime: new Date(),
              endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
              location: e.city,
            },
          });
        }
      }
    }

    // 5. Seed Opportunities
    for (const o of opportunities) {
      const firstOrg = orgs[0];
      const existing = await prisma.opportunity.findFirst({ where: { title: o.title } });
      if (!existing) {
        await prisma.opportunity.create({
          data: {
            title: o.title,
            type: o.type.toUpperCase(),
            location: o.location,
            compensation: o.comp,
            organizationId: firstOrg.slug,
          },
        });
      }
    }

    return NextResponse.json({ success: true, message: "Database seeded successfully!" });
  } catch (error: any) {
    console.error("Seeding error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
