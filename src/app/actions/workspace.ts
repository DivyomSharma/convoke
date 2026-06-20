"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

export async function rsvpToEvent(eventId: string, status: "GOING" | "INTERESTED") {
  const user = await requireUser();

  await prisma.eventAttendance.upsert({
    where: {
      eventId_userId: {
        eventId,
        userId: user.id,
      },
    },
    update: {
      status,
    },
    create: {
      eventId,
      userId: user.id,
      status,
    },
  });

  revalidatePath("/workspace");
  revalidatePath("/workspace/tickets");
  revalidatePath("/events");
  revalidatePath(`/events/${eventId}`);
  return { success: true };
}

export async function applyToOpportunity(opportunityId: string) {
  const user = await requireUser();
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
    select: { type: true },
  });

  if (!opportunity) {
    throw new Error("Opportunity not found.");
  }

  const existing = await prisma.application.findFirst({
    where: { opportunityId, userId: user.id },
  });

  if (existing) {
    throw new Error("Already applied to this opportunity.");
  }

  await prisma.application.create({
    data: {
      opportunityId,
      userId: user.id,
      status: "PENDING",
    },
  });

  revalidatePath("/workspace");
  revalidatePath("/workspace/tickets");
  revalidatePath("/opportunities");
  revalidatePath(`/opportunities/${opportunityId}`);
  if (opportunity.type === "HACKATHON" || opportunity.type === "CHALLENGE") {
    revalidatePath("/challenges");
    revalidatePath(`/challenges/${opportunityId}`);
  }
  return { success: true };
}

export async function joinSpace(organizationId: string) {
  const user = await requireUser();

  const existing = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: user.id,
        organizationId,
      },
    },
  });

  if (existing) {
    throw new Error("Already a member.");
  }

  await prisma.membership.create({
    data: {
      userId: user.id,
      organizationId,
      role: "MEMBER",
    },
  });

  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { slug: true },
  });

  revalidatePath("/workspace");
  revalidatePath("/spaces");
  if (org) {
    revalidatePath("/org/" + org.slug);
  }
  return { success: true };
}

export async function postMessage(spaceId: string, content: string) {
  const user = await requireUser();
  if (!content || !content.trim()) {
    throw new Error("Message content cannot be empty.");
  }

  await prisma.message.create({
    data: {
      content: content.trim(),
      spaceId,
      userId: user.id,
    },
  });

  revalidatePath(`/spaces/${spaceId}`);
  return { success: true };
}
