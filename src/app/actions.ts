"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NotificationType } from "@prisma/client";
import { notifyUser } from "@/lib/notifications";
import { getPrisma } from "@/lib/prisma";
import {
  applicationStatusSchema,
  createCommunitySchema,
  createEventSchema,
  createOpportunitySchema,
  merchInquirySchema,
  sponsorLeadSchema,
} from "@/lib/schemas";
import { slugify } from "@/lib/utils";
import { getAuthenticatedDbUser } from "@/lib/viewer";

async function requireDbUser() {
  const user = await getAuthenticatedDbUser();
  if (!user) {
    redirect("/auth/sign-in");
  }
  return user;
}

export async function registerForEvent(input: {
  eventId: string;
  ticketTypeId?: string;
}) {
  const user = await requireDbUser();
  const prisma = getPrisma();

  const existing = await prisma.registration.findFirst({
    where: { userId: user.id, eventId: input.eventId },
  });

  if (existing) {
    return { ok: true, registrationId: existing.id, status: existing.status };
  }

  const event = await prisma.event.findUniqueOrThrow({
    where: { id: input.eventId },
    include: { ticketTypes: true },
  });

  const ticketTypeId = input.ticketTypeId ?? event.ticketTypes[0]?.id;

  const registration = await prisma.registration.create({
    data: {
      userId: user.id,
      eventId: event.id,
      ticketTypeId,
      status: event.approvalBased ? "PENDING" : "APPROVED",
      qrCode: `convoke-${user.username}-${event.slug}-${Date.now()}`,
    },
  });

  await prisma.event.update({
    where: { id: event.id },
    data: { registrationsCount: { increment: 1 } },
  });

  if (ticketTypeId) {
    await prisma.ticketType.update({
      where: { id: ticketTypeId },
      data: { sold: { increment: 1 } },
    });
  }

  revalidatePath(`/events/${event.slug}`);
  revalidatePath("/events");
  revalidatePath("/workspace");

  await notifyUser({
    userId: user.id,
    email: user.email,
    type: NotificationType.EVENT_REMINDER,
    title: `Registered for ${event.title}`,
    message: event.approvalBased
      ? `Your registration for ${event.title} has been received and is pending approval.`
      : `You are successfully registered for ${event.title}.`,
  });

  return { ok: true, registrationId: registration.id, status: registration.status };
}

export async function createMerchInquiry(input: unknown) {
  const user = await requireDbUser();
  const prisma = getPrisma();
  const data = merchInquirySchema.parse(input);

  const membership = await prisma.membership.findFirst({
    where: { userId: user.id },
    orderBy: { joinedAt: "asc" },
  });

  const inquiry = await prisma.merchInquiry.create({
    data: {
      organizationId: membership?.organizationId,
      apparelType: data.apparelType,
      quantity: data.quantity,
      budget: data.budget,
      timeline: data.timeline,
      city: data.city,
      references: data.references,
      stylePreferences: data.stylePreferences,
    },
  });

  revalidatePath("/merch");
  revalidatePath("/workspace");

  await notifyUser({
    userId: user.id,
    email: user.email,
    type: NotificationType.MERCH_UPDATE,
    title: "Merch inquiry received",
    message: `Your merch inquiry for ${data.apparelType} has been recorded in Convoke.`,
  });

  return {
    ok: true,
    inquiryId: inquiry.id,
    status: inquiry.status,
    whatsappMessage: `Convoke merch inquiry\nProduct: ${data.apparelType}\nQuantity: ${data.quantity}\nBudget: ${data.budget}\nTimeline: ${data.timeline}\nCity: ${data.city}`,
  };
}

export async function upsertSponsorLead(input: unknown) {
  const user = await requireDbUser();
  const prisma = getPrisma();
  const data = sponsorLeadSchema.parse(input);

  const lead = await prisma.sponsorLead.create({
    data: {
      organizationId: data.organizationId,
      eventId: data.eventId,
      companyName: data.companyName,
      contactEmail: data.contactEmail,
      stage: data.pipelineStage,
    },
  });

  revalidatePath("/workspace");
  const organization = await prisma.organization.findUnique({
    where: { id: data.organizationId },
    select: { name: true },
  });

  await notifyUser({
    userId: user.id,
    email: user.email,
    type: NotificationType.SPONSOR_UPDATE,
    title: `Sponsor lead added for ${organization?.name ?? "your organization"}`,
    message: `${data.companyName} has been added to your sponsorship pipeline.`,
  });
  return { ok: true, leadId: lead.id, lead: data.companyName };
}

export async function toggleBookmark(input: {
  eventId?: string;
  opportunityId?: string;
  communityId?: string;
}) {
  const user = await requireDbUser();
  const prisma = getPrisma();

  const existing = await prisma.bookmark.findFirst({
    where: {
      userId: user.id,
      eventId: input.eventId ?? null,
      opportunityId: input.opportunityId ?? null,
      communityId: input.communityId ?? null,
    },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
  } else {
    await prisma.bookmark.create({
      data: {
        userId: user.id,
        eventId: input.eventId,
        opportunityId: input.opportunityId,
        communityId: input.communityId,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/discover");
  revalidatePath("/events");
  revalidatePath("/opportunities");
  revalidatePath("/communities");
  revalidatePath("/workspace");

  return { ok: true, saved: !existing };
}

export async function applyToOpportunity(input: {
  opportunityId: string;
  coverLetter?: string;
}) {
  const user = await requireDbUser();
  const prisma = getPrisma();

  const existing = await prisma.opportunityApplication.findFirst({
    where: { userId: user.id, opportunityId: input.opportunityId },
  });

  if (existing) {
    return { ok: true, applicationId: existing.id, status: existing.status };
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  const application = await prisma.opportunityApplication.create({
    data: {
      userId: user.id,
      opportunityId: input.opportunityId,
      status: "APPLIED",
      coverLetter: input.coverLetter || "Applying through Convoke.",
      portfolioUrl: profile?.portfolioUrl || profile?.website || undefined,
    },
  });

  revalidatePath("/opportunities");
  revalidatePath("/workspace");

  const opportunity = await prisma.opportunity.findUniqueOrThrow({
    where: { id: input.opportunityId },
    select: { title: true },
  });

  await notifyUser({
    userId: user.id,
    email: user.email,
    type: NotificationType.APPLICATION_UPDATE,
    title: `Applied to ${opportunity.title}`,
    message: `Your application to ${opportunity.title} has been submitted successfully.`,
  });

  return { ok: true, applicationId: application.id, status: application.status };
}

export async function joinCommunity(input: { communityId: string }) {
  const user = await requireDbUser();
  const prisma = getPrisma();

  const existing = await prisma.communityMembership.findFirst({
    where: { userId: user.id, communityId: input.communityId },
  });

  if (!existing) {
    await prisma.communityMembership.create({
      data: {
        userId: user.id,
        communityId: input.communityId,
        role: "MEMBER",
      },
    });

    await prisma.community.update({
      where: { id: input.communityId },
      data: { memberCount: { increment: 1 } },
    });
  }

  revalidatePath("/communities");
  revalidatePath("/discover");
  revalidatePath("/workspace");

  const community = await prisma.community.findUniqueOrThrow({
    where: { id: input.communityId },
    select: { name: true },
  });

  await notifyUser({
    userId: user.id,
    email: user.email,
    type: NotificationType.COMMUNITY_ANNOUNCEMENT,
    title: `Joined ${community.name}`,
    message: `You are now part of ${community.name} on Convoke.`,
  });

  return { ok: true, joined: true };
}

export async function createCommunity(input: unknown) {
  const user = await requireDbUser();
  const prisma = getPrisma();
  const data = createCommunitySchema.parse(input);

  const organizationSlugBase = slugify(data.organizationName);
  const communitySlugBase = slugify(data.communityName);
  const organizationSlug = `${organizationSlugBase}-${Date.now().toString().slice(-6)}`;
  const communitySlug = `${communitySlugBase}-${Date.now().toString().slice(-6)}`;

  const organization = await prisma.organization.create({
    data: {
      slug: organizationSlug,
      name: data.organizationName,
      type: data.organizationType,
      description: data.description,
      website: data.website || undefined,
      city: data.city,
      memberships: {
        create: {
          userId: user.id,
          role: "OWNER",
          title: "Founder",
        },
      },
    },
  });

  const community = await prisma.community.create({
    data: {
      slug: communitySlug,
      organizationId: organization.id,
      name: data.communityName,
      category: data.category,
      tagline: data.tagline,
      description: data.description,
      city: data.city,
      members: {
        create: {
          userId: user.id,
          role: "ADMIN",
        },
      },
      memberCount: 1,
      momentumScore: 10,
      isFeatured: false,
    },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { primaryRole: "COMMUNITY_ADMIN" },
  });

  revalidatePath("/communities");
  revalidatePath("/discover");
  revalidatePath("/workspace");

  await notifyUser({
    userId: user.id,
    email: user.email,
    type: NotificationType.COMMUNITY_ANNOUNCEMENT,
    title: `Community published: ${data.communityName}`,
    message: `${data.communityName} is now live on Convoke.`,
  });

  return { ok: true, communityId: community.id, slug: community.slug };
}

export async function createEvent(input: unknown) {
  const user = await requireDbUser();
  const prisma = getPrisma();
  const data = createEventSchema.parse(input);

  const membership = await prisma.membership.findFirst({
    where: {
      userId: user.id,
      organizationId: data.organizationId,
    },
  });

  if (!membership) {
    throw new Error("You do not have permission to create events for this organization.");
  }

  const slug = `${slugify(data.title)}-${Date.now().toString().slice(-6)}`;

  const event = await prisma.event.create({
    data: {
      slug,
      organizationId: data.organizationId,
      communityId: data.communityId || undefined,
      organizerId: user.id,
      title: data.title,
      shortDescription: data.shortDescription,
      description: data.description,
      city: data.city,
      venue: data.venue || undefined,
      category: data.category,
      mode: data.mode,
      startsAt: new Date(data.startsAt),
      endsAt: new Date(data.endsAt),
      isPaid: data.isPaid,
      approvalBased: data.approvalBased,
      featured: data.featured,
      ticketTypes: {
        create: {
          name: data.ticketName,
          priceInr: data.priceInr,
          capacity: data.ticketCapacity,
          category: "GENERAL",
        },
      },
    },
    include: { community: true },
  });

  if (event.communityId) {
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        communityId: event.communityId,
        eventId: event.id,
        actorName: user.name,
        action: "published an event",
        detail: `${event.title} is now open for discovery and registrations.`,
      },
    });
  }

  revalidatePath("/events");
  revalidatePath("/discover");
  revalidatePath("/workspace");

  await notifyUser({
    userId: user.id,
    email: user.email,
    type: NotificationType.EVENT_UPDATE,
    title: `Event published: ${event.title}`,
    message: `${event.title} is now live and open on Convoke.`,
  });

  return { ok: true, eventId: event.id, slug: event.slug };
}

export async function createOpportunity(input: unknown) {
  const user = await requireDbUser();
  const prisma = getPrisma();
  const data = createOpportunitySchema.parse(input);

  const membership = await prisma.membership.findFirst({
    where: {
      userId: user.id,
      organizationId: data.organizationId,
    },
  });

  if (!membership) {
    throw new Error("You do not have permission to create opportunities for this organization.");
  }

  const slug = `${slugify(data.title)}-${Date.now().toString().slice(-6)}`;

  const opportunity = await prisma.opportunity.create({
    data: {
      slug,
      organizationId: data.organizationId,
      communityId: data.communityId || undefined,
      title: data.title,
      type: data.type,
      location: data.location,
      isRemote: data.isRemote,
      shortDescription: data.shortDescription,
      description: data.description,
      requirements: data.requirements.split("\n").map((item) => item.trim()).filter(Boolean),
      skills: data.skills.split(",").map((item) => item.trim()).filter(Boolean),
      perks: data.perks.split("\n").map((item) => item.trim()).filter(Boolean),
      stipend: data.stipend || undefined,
      duration: data.duration || undefined,
      applicationDeadline: new Date(data.applicationDeadline),
      positionsAvailable: data.positionsAvailable,
      featured: data.featured,
    },
  });

  if (data.communityId) {
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        communityId: data.communityId,
        opportunityId: opportunity.id,
        actorName: user.name,
        action: "opened an opportunity",
        detail: `${opportunity.title} is now accepting applications on Convoke.`,
      },
    });
  }

  revalidatePath("/opportunities");
  revalidatePath("/discover");
  revalidatePath("/workspace");

  await notifyUser({
    userId: user.id,
    email: user.email,
    type: NotificationType.APPLICATION_UPDATE,
    title: `Opportunity published: ${opportunity.title}`,
    message: `${opportunity.title} is now live and accepting applications.`,
  });

  return { ok: true, opportunityId: opportunity.id, slug: opportunity.slug };
}

export async function updateOpportunityApplicationStatus(input: unknown) {
  const user = await requireDbUser();
  const prisma = getPrisma();
  const data = applicationStatusSchema.parse(input);

  const application = await prisma.opportunityApplication.findUniqueOrThrow({
    where: { id: data.applicationId },
    include: { opportunity: true, user: true },
  });

  const membership = await prisma.membership.findFirst({
    where: {
      userId: user.id,
      organizationId: application.opportunity.organizationId,
    },
  });

  if (!membership) {
    throw new Error("You do not have permission to update this application.");
  }

  await prisma.opportunityApplication.update({
    where: { id: data.applicationId },
    data: { status: data.status },
  });

  await notifyUser({
    userId: application.userId,
    email: application.user.email,
    type: NotificationType.APPLICATION_UPDATE,
    title: `${application.opportunity.title} status updated`,
    message: `Your application is now ${data.status.toLowerCase().replace(/_/g, " ")}.`,
  });

  revalidatePath("/workspace");
  revalidatePath("/opportunities");

  return { ok: true };
}
