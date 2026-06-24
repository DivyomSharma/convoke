"use server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function requestIntroduction(targetId: string, reason: string) {
  const user = await requireUser();

  if (user.id === targetId) {
    throw new Error("Cannot request introduction to yourself.");
  }

  // Check if request already exists
  const existing = await prisma.introductionRequest.findFirst({
    where: {
      requesterId: user.id,
      targetId,
      status: "PENDING"
    }
  });

  if (existing) {
    throw new Error("You already have a pending introduction request to this person.");
  }

  await prisma.introductionRequest.create({
    data: {
      requesterId: user.id,
      targetId,
      reason,
      status: "PENDING"
    }
  });

  // Depending on routing, could be profile/[handle] or just any page.
  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateIntroRequestStatus(id: string, status: "ACCEPTED" | "DECLINED") {
  const user = await requireUser();

  const req = await prisma.introductionRequest.findUnique({ where: { id } });
  if (!req || req.targetId !== user.id) {
    throw new Error("Unauthorized");
  }

  await prisma.introductionRequest.update({
    where: { id },
    data: { status }
  });

  revalidatePath("/workspace/personal");
  return { success: true };
}
