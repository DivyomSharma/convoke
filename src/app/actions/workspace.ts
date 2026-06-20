"use server";

import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Ensures the user is authenticated and mapped to a Prisma User.
 */
async function requireUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized: Must be logged in.");
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
  });

  if (!dbUser) {
    throw new Error("User record not found in database.");
  }

  return dbUser;
}

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
