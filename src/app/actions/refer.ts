"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function createReferral(opportunityId: string, note?: string) {
  try {
    const user = await requireUser();
    
    // Check if referral already exists
    const existing = await prisma.referral.findFirst({
      where: {
        opportunityId,
        userId: user.id
      }
    });

    if (existing) {
      return { success: false, error: "You have already referred someone or applied with a referral." };
    }

    const referral = await prisma.referral.create({
      data: {
        opportunityId,
        userId: user.id,
        note: note || null,
      }
    });

    return { success: true, referral };
  } catch (error) {
    return { success: false, error: "Failed to create referral." };
  }
}
