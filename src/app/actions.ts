"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPrisma } from "@/lib/prisma";
import { merchInquirySchema, sponsorLeadSchema } from "@/lib/schemas";
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
    where: {
      userId: user.id,
      eventId: input.eventId,
    },
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
      qrCode: `QR-${user.username}-${event.slug}-${Date.now()}`,
      tags: [event.category.toLowerCase()],
    },
  });

  revalidatePath(`/events/${event.slug}`);
  revalidatePath("/workspace");

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

  return {
    ok: true,
    inquiryId: inquiry.id,
    status: inquiry.status,
    whatsappMessage: `Convoke merch inquiry: ${data.apparelType}, ${data.quantity}, ${data.city}`,
  };
}

export async function upsertSponsorLead(input: unknown) {
  await requireDbUser();
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
  return { ok: true, leadId: lead.id, lead: data.companyName };
}

export async function toggleBookmark(input: {
  eventId?: string;
  opportunityId?: string;
  organizationId?: string;
}) {
  const user = await requireDbUser();
  const prisma = getPrisma();

  const existing = await prisma.bookmark.findFirst({
    where: {
      userId: user.id,
      eventId: input.eventId ?? null,
      opportunityId: input.opportunityId ?? null,
      organizationId: input.organizationId ?? null,
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
        organizationId: input.organizationId,
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/discover");
  revalidatePath("/opportunities");
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
    where: {
      userId: user.id,
      opportunityId: input.opportunityId,
    },
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
      coverLetter:
        input.coverLetter ||
        "Applying through Convoke to contribute meaningfully to this opportunity.",
      portfolioUrl: profile?.portfolioUrl || profile?.website || undefined,
    },
  });

  revalidatePath("/opportunities");
  revalidatePath("/workspace");

  return { ok: true, applicationId: application.id, status: application.status };
}

export async function joinCommunity(input: { organizationId: string }) {
  const user = await requireDbUser();
  const prisma = getPrisma();

  const existing = await prisma.membership.findFirst({
    where: {
      userId: user.id,
      organizationId: input.organizationId,
    },
  });

  if (!existing) {
    await prisma.membership.create({
      data: {
        userId: user.id,
        organizationId: input.organizationId,
        role: "Member",
      },
    });
  }

  revalidatePath("/communities");
  revalidatePath("/workspace");

  return { ok: true, joined: true };
}
