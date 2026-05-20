import {
  ApplicationStatus,
  EventMode,
  MerchStatus,
  NotificationStatus,
  OpportunityType,
  PrismaClient,
  RegistrationStatus,
  SponsorStage,
  TicketTypeCategory,
  UserRole,
} from "@prisma/client";
import {
  seedAnnouncements,
  seedEventFaqs,
  seedEventSchedules,
  seedGalleryImages,
  seedMerchInquiries,
  seedOpportunities,
  seedOrganizations,
  seedSponsorLeads,
  seedUsers,
  seedVolunteerApplications,
} from "../src/lib/platform-seed";
import { featuredEvents } from "../src/data/platform";

const prisma = new PrismaClient();

async function main() {
  await prisma.reaction.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.opportunityApplication.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.merchInquiry.deleteMany();
  await prisma.volunteerApplication.deleteMany();
  await prisma.sponsorLead.deleteMany();
  await prisma.eventSponsor.deleteMany();
  await prisma.eventSpeaker.deleteMany();
  await prisma.eventSchedule.deleteMany();
  await prisma.registration.deleteMany();
  await prisma.ticketType.deleteMany();
  await prisma.galleryItem.deleteMany();
  await prisma.gallery.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.event.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.project.deleteMany();
  await prisma.education.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  for (const organization of seedOrganizations) {
    await prisma.organization.create({
      data: {
        slug: organization.slug,
        name: organization.name,
        type: organization.type,
        description: organization.description,
        website: organization.website,
        avatarUrl: organization.avatarUrl,
        bannerUrl: organization.bannerUrl,
        membersCount: organization.membersCount,
        eventsCount: organization.eventsCount,
        opportunitiesCount: organization.opportunitiesCount,
      },
    });
  }

  for (const user of seedUsers) {
    const createdUser = await prisma.user.create({
      data: {
        email: user.email,
        username: user.username,
        name: user.name,
        headline: user.headline,
        bio: user.bio,
        role: user.role as UserRole,
        profile: {
          create: {
            headline: user.headline,
            location: user.location,
            website: user.website,
            linkedinUrl: user.socials.linkedin,
            githubUrl: user.socials.github,
            instagramUrl: user.socials.instagram,
            portfolioUrl: user.website,
            skills: user.skills,
            badges: user.badges,
            reputation: 8.2,
            eventsAttended: user.stats.eventsAttended,
            eventsOrganized: user.stats.eventsOrganized,
            volunteerHours: user.stats.volunteerHours,
            communitiesJoined: user.stats.communitiesJoined,
          },
        },
      },
    });

    await prisma.experience.create({
      data: {
        userId: createdUser.id,
        company: user.experience.company,
        position: user.experience.position,
        location: user.location,
        current: true,
        description: user.experience.description,
      },
    });

    await prisma.project.create({
      data: {
        userId: createdUser.id,
        name: user.project.name,
        description: user.project.description,
        url: user.website,
        technologies: user.project.technologies,
      },
    });

    if (user.organizationSlug) {
      const organization = await prisma.organization.findUniqueOrThrow({
        where: { slug: user.organizationSlug },
      });

      await prisma.membership.create({
        data: {
          userId: createdUser.id,
          organizationId: organization.id,
          role: user.role === "ORGANIZER" ? "Owner" : user.role === "VOLUNTEER" ? "Volunteer" : "Member",
        },
      });
    }
  }

  for (const [index, event] of featuredEvents.entries()) {
    const organization = await prisma.organization.findUniqueOrThrow({
      where: { slug: event.organizerSlug },
    });
    const organizerMembership = await prisma.membership.findFirst({
      where: { organizationId: organization.id },
      include: { user: true },
    });

    const createdEvent = await prisma.event.create({
      data: {
        organizationId: organization.id,
        organizerId: organizerMembership?.userId,
        slug: event.slug,
        title: event.title,
        category: event.category,
        city: event.city,
        mode: event.mode as EventMode,
        startsAt: new Date(Date.UTC(2026, 7 + index, 12, 4)),
        endsAt: new Date(Date.UTC(2026, 7 + index, 12, 12)),
        isPaid: event.price > 0,
        heroImageUrl: event.image,
      },
    });

    await prisma.ticketType.create({
      data: {
        eventId: createdEvent.id,
        name: event.price > 0 ? "General pass" : "Registration",
        category: TicketTypeCategory.GENERAL,
        priceInr: event.price,
        capacity: event.attendees + 150,
        sold: event.attendees,
      },
    });

    const schedules = seedEventSchedules.find((item) => item.eventSlug === event.slug)?.items ?? [];
    for (const schedule of schedules) {
      await prisma.eventSchedule.create({
        data: {
          eventId: createdEvent.id,
          title: schedule.title,
          description: schedule.description,
          startsAt: new Date(schedule.startsAt),
          endsAt: new Date(schedule.endsAt),
          location: schedule.location,
        },
      });
    }

    const speakerUsers = await prisma.user.findMany({ take: 4, orderBy: { createdAt: "asc" } });
    for (const speakerUser of speakerUsers) {
      await prisma.eventSpeaker.create({
        data: {
          eventId: createdEvent.id,
          userId: speakerUser.id,
          name: speakerUser.name,
          title: speakerUser.headline,
          organization: speakerUser.username,
          talkTitle: `${event.title} perspective`,
          bio: speakerUser.bio,
        },
      });
    }

    const leadSponsors = seedSponsorLeads.filter((lead) => lead.eventSlug === event.slug);
    for (const lead of leadSponsors) {
      await prisma.eventSponsor.create({
        data: {
          eventId: createdEvent.id,
          companyName: lead.companyName,
          tier: lead.stage,
          benefits: ["Brand visibility", "Access to builders"],
        },
      });
    }

    const gallery = await prisma.gallery.create({
      data: {
        organizationId: organization.id,
        eventId: createdEvent.id,
        title: `${event.title} gallery`,
      },
    });

    const galleryImages = seedGalleryImages[event.slug] ?? [event.image];
    for (const [galleryIndex, image] of galleryImages.entries()) {
      await prisma.galleryItem.create({
        data: {
          galleryId: gallery.id,
          url: image,
          order: galleryIndex,
        },
      });
    }
  }

  for (const opportunity of seedOpportunities) {
    const organization = await prisma.organization.findUniqueOrThrow({
      where: { slug: opportunity.organizationSlug },
    });

    await prisma.opportunity.create({
      data: {
        organizationId: organization.id,
        title: opportunity.title,
        type: opportunity.type
          .toUpperCase()
          .replace(/[^A-Z]+/g, "_")
          .replace(/^FULL_TIME$/, "STARTUP_JOB")
          .replace(/^HACKATHON_TEAM$/, "CONTEST") as OpportunityType,
        location: opportunity.location,
        isRemote: opportunity.isRemote,
        description: opportunity.description,
        requirements: opportunity.skills,
        skills: opportunity.skills,
        stipend: opportunity.stipend ?? undefined,
        applicationDeadline: opportunity.applicationDeadline
          ? new Date(opportunity.applicationDeadline)
          : undefined,
        positionsAvailable: 3,
        applicationsCount: opportunity.applicants,
        featured: opportunity.featured,
      },
    });
  }

  for (const volunteerApplication of seedVolunteerApplications) {
    const user = await prisma.user.findUniqueOrThrow({
      where: { username: volunteerApplication.username },
    });
    const event = await prisma.event.findUniqueOrThrow({
      where: { slug: volunteerApplication.eventSlug },
    });

    await prisma.volunteerApplication.create({
      data: {
        userId: user.id,
        eventId: event.id,
        role: volunteerApplication.role,
        status: volunteerApplication.status,
        hours: volunteerApplication.hours,
      },
    });
  }

  for (const sponsorLead of seedSponsorLeads) {
    const organization = await prisma.organization.findUniqueOrThrow({
      where: { slug: sponsorLead.organizationSlug },
    });
    const event = sponsorLead.eventSlug
      ? await prisma.event.findUnique({ where: { slug: sponsorLead.eventSlug } })
      : null;

    await prisma.sponsorLead.create({
      data: {
        organizationId: organization.id,
        eventId: event?.id,
        companyName: sponsorLead.companyName,
        contactEmail: sponsorLead.contactEmail,
        stage: sponsorLead.stage as SponsorStage,
        valueInr: sponsorLead.valueInr,
      },
    });
  }

  for (const merchInquiry of seedMerchInquiries) {
    const organization = merchInquiry.organizationSlug
      ? await prisma.organization.findUnique({ where: { slug: merchInquiry.organizationSlug } })
      : null;

    await prisma.merchInquiry.create({
      data: {
        organizationId: organization?.id,
        apparelType: merchInquiry.apparelType,
        quantity: merchInquiry.quantity,
        budget: merchInquiry.budget,
        timeline: merchInquiry.timeline,
        city: merchInquiry.city,
        references: merchInquiry.references,
        stylePreferences: merchInquiry.stylePreferences,
        status: merchInquiry.status as MerchStatus,
      },
    });
  }

  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
  const events = await prisma.event.findMany({ include: { ticketTypes: true }, orderBy: { startsAt: "asc" } });
  const dbOpportunities = await prisma.opportunity.findMany({ orderBy: { createdAt: "asc" } });

  for (const [index, user] of users.entries()) {
    const event = events[index % events.length];
    const ticketType = event.ticketTypes[0];
    await prisma.registration.create({
      data: {
        userId: user.id,
        eventId: event.id,
        ticketTypeId: ticketType?.id,
        status: [RegistrationStatus.APPROVED, RegistrationStatus.PENDING, RegistrationStatus.WAITLISTED][index % 3],
        qrCode: `QR-${user.username}-${event.slug}`,
        tags: [event.category, "seeded"],
      },
    });

    const opportunity = dbOpportunities[index % dbOpportunities.length];
    await prisma.opportunityApplication.create({
      data: {
        userId: user.id,
        opportunityId: opportunity.id,
        status: [
          ApplicationStatus.APPLIED,
          ApplicationStatus.REVIEWING,
          ApplicationStatus.SHORTLISTED,
        ][index % 3],
        coverLetter: `I want to contribute to ${opportunity.title} through Convoke.`,
        portfolioUrl: `https://portfolio.theconvoke.xyz/${user.username}`,
      },
    });

    if (index < 4) {
      await prisma.bookmark.create({
        data: {
          userId: user.id,
          eventId: events[(index + 1) % events.length].id,
          opportunityId: dbOpportunities[(index + 1) % dbOpportunities.length].id,
          organizationId: (
            await prisma.organization.findUniqueOrThrow({
              where: { slug: seedOrganizations[index % seedOrganizations.length].slug },
            })
          ).id,
        },
      });
    }

    await prisma.notification.create({
      data: {
        userId: user.id,
        type: "APPLICATION_UPDATE",
        title: "Your application moved forward",
        message: `${opportunity.title} is now in ${[
          "reviewing",
          "shortlisted",
          "applied",
        ][index % 3]} state.`,
        status: index % 2 === 0 ? NotificationStatus.UNREAD : NotificationStatus.READ,
      },
    });

    await prisma.certificate.create({
      data: {
        userId: user.id,
        eventId: event.id,
        type: "PARTICIPATION",
        title: `${event.title} participation certificate`,
        description: `Issued to ${user.name} through Convoke.`,
      },
    });
  }

  for (const announcement of seedAnnouncements) {
    const organization = await prisma.organization.findUniqueOrThrow({
      where: { slug: announcement.organizationSlug },
    });

    await prisma.announcement.create({
      data: {
        organizationId: organization.id,
        title: announcement.title,
        content: announcement.content,
        published: true,
        publishedAt: new Date(announcement.publishedAt),
      },
    });
  }

  for (const [eventSlug, faqs] of Object.entries(seedEventFaqs)) {
    const event = await prisma.event.findUnique({ where: { slug: eventSlug } });
    if (!event) continue;
    await prisma.event.update({
      where: { id: event.id },
      data: {
        blocks: {
          faqs,
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
