import { PrismaClient } from "@prisma/client";
import { events, opportunities, orgs, people, spaces, feed } from "./seed-data";

const prisma = new PrismaClient();

async function main() {
  console.log("Start seeding...");

  // 1. Seed Users (people)
  for (const p of people) {
    await prisma.user.upsert({
      where: { handle: p.handle },
      update: {},
      create: {
        id: p.handle, // Using handle as ID for easy matching in this mock setup
        email: `${p.handle}@example.com`,
        name: p.name,
        handle: p.handle,
        avatarUrl: p.avatar,
        role: p.role,
        university: p.city, // Storing city in university for now based on mock data
      },
    });
  }

  // 2. Seed Organizations
  for (const o of orgs) {
    await prisma.organization.upsert({
      where: { slug: o.slug },
      update: {},
      create: {
        id: o.slug, // Using slug as ID
        name: o.name,
        slug: o.slug,
        description: o.kind, // Storing kind as description for now
      },
    });
  }

  // 3. Seed Spaces
  for (const s of spaces) {
    // Assuming all spaces belong to the first org for now, or you could match them up
    const firstOrg = orgs[0];
    await prisma.space.create({
      data: {
        name: s.name,
        description: s.tagline,
        organizationId: firstOrg.slug,
      },
    });
  }

  // 4. Seed Events
  const firstSpace = await prisma.space.findFirst();
  if (firstSpace) {
    for (const e of events) {
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

  // 5. Seed Opportunities
  for (const o of opportunities) {
    const firstOrg = orgs[0];
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

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
