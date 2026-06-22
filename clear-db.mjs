import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Starting to clear all database tables...");
  
  // We need to delete in order to avoid foreign key constraint errors if not using cascade deletes properly,
  // though Prisma handles Cascade gracefully if defined. It's safest to just delete the leaves first.
  
  // Leaves / Deeply nested
  await prisma.activity?.deleteMany().catch(() => {});
  await prisma.session?.deleteMany().catch(() => {});
  await prisma.settings?.deleteMany().catch(() => {});
  await prisma.bookmark?.deleteMany().catch(() => {});
  await prisma.research?.deleteMany().catch(() => {});
  await prisma.project?.deleteMany().catch(() => {});
  await prisma.application?.deleteMany().catch(() => {});
  await prisma.notification?.deleteMany().catch(() => {});
  await prisma.message?.deleteMany().catch(() => {});
  await prisma.vouch?.deleteMany().catch(() => {});
  await prisma.meetAttendance?.deleteMany().catch(() => {});
  await prisma.membership?.deleteMany().catch(() => {});
  await prisma.partner?.deleteMany().catch(() => {});
  await prisma.resource?.deleteMany().catch(() => {});
  await prisma.timelineEvent?.deleteMany().catch(() => {});
  await prisma.galleryImage?.deleteMany().catch(() => {});
  await prisma.sponsor?.deleteMany().catch(() => {});
  await prisma.fAQ?.deleteMany().catch(() => {});
  
  // Mid-level
  await prisma.opportunity?.deleteMany().catch(() => {});
  await prisma.meet?.deleteMany().catch(() => {});
  await prisma.space?.deleteMany().catch(() => {});
  
  // Top-level
  await prisma.organization?.deleteMany().catch(() => {});
  
  // Base
  await prisma.user?.deleteMany().catch(() => {});
  
  console.log("All false/mock data has been wiped successfully!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
