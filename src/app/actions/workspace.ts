"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth, currentUser } from "@clerk/nextjs/server";

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
  revalidatePath("/explore");
  return { success: true };
}

export async function applyToOpportunity(opportunityId: string) {
  const user = await requireUser();

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
  revalidatePath("/opportunities");
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

  revalidatePath("/workspace");
  revalidatePath("/spaces");
  return { success: true };
}
