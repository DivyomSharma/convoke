"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createOpportunity(formData: FormData) {
  const user = await requireUser();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string;
  const organizationId = formData.get("organizationId") as string;
  const location = formData.get("location") as string;
  const compensation = formData.get("compensation") as string;
  
  const deadlineStr = formData.get("deadline") as string;
  const deadline = deadlineStr ? new Date(deadlineStr) : null;

  if (!title || !type || !organizationId) {
    return { error: "Missing required fields" };
  }

  // Auth check
  const membership = await prisma.membership.findUnique({
    where: { userId_organizationId: { userId: user.id, organizationId } }
  });

  if (!membership || !["FOUNDER", "ADMIN", "LEAD"].includes(membership.role)) {
    return { error: "Unauthorized" };
  }

  const opp = await prisma.opportunity.create({
    data: {
      title,
      description,
      type,
      organizationId,
      location,
      compensation,
      deadline
    }
  });

  revalidatePath(`/organizations/${organizationId}`);
  revalidatePath("/explore");
  
  // Decide where to redirect based on type
  if (type === "HACKATHON/CHALLENGE") {
    return { success: true, redirectUrl: `/challenges/${opp.id}` };
  } else {
    return { success: true, redirectUrl: `/opportunities/${opp.id}` };
  }
}

export async function applyToOpportunity(opportunityId: string) {
  const user = await requireUser();
  
  await prisma.application.create({
    data: {
      opportunityId,
      userId: user.id,
      status: "APPLIED"
    }
  });

  revalidatePath(`/opportunities/${opportunityId}`);
  revalidatePath(`/challenges/${opportunityId}`);
  return { success: true };
}
