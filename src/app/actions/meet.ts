"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createMeet(formData: FormData) {
  const user = await requireUser();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const spaceId = formData.get("spaceId") as string;
  const location = formData.get("location") as string;
  const venue = formData.get("venue") as string;
  const startTime = new Date(formData.get("startTime") as string);
  const endTime = new Date(formData.get("endTime") as string);
  const capacity = formData.get("capacity") ? parseInt(formData.get("capacity") as string, 10) : null;

  if (!title || !spaceId || !startTime || !endTime) {
    return { error: "Missing required fields" };
  }

  // Check if user is admin of the space
  const membership = await prisma.spaceMembership.findUnique({
    where: { userId_spaceId: { userId: user.id, spaceId } }
  });

  if (!membership || !["FOUNDER", "LEAD", "ORGANIZER"].includes(membership.role)) {
    return { error: "Unauthorized to create meets in this space" };
  }

  const meet = await prisma.meet.create({
    data: {
      title,
      description,
      spaceId,
      location,
      venue,
      startTime,
      endTime,
      capacity,
    }
  });

  revalidatePath(`/spaces/${spaceId}`);
  revalidatePath("/meets");
  return { success: true, meetId: meet.id };
}

export async function applyToMeet(meetId: string, formData: FormData) {
  const user = await requireUser();
  const answers = formData.get("answers") as string;

  await prisma.meetApplication.create({
    data: {
      meetId,
      userId: user.id,
      status: "PENDING",
      answers
    }
  });

  revalidatePath(`/meets/${meetId}`);
  return { success: true };
}

export async function approveMeetApplication(applicationId: string) {
  const user = await requireUser();
  const application = await prisma.meetApplication.findUnique({
    where: { id: applicationId },
    include: { meet: true }
  });

  if (!application) return { error: "Application not found" };

  // Verification...
  const membership = await prisma.spaceMembership.findUnique({
    where: { userId_spaceId: { userId: user.id, spaceId: application.meet.spaceId } }
  });

  if (!membership || !["FOUNDER", "LEAD", "ORGANIZER"].includes(membership.role)) {
    return { error: "Unauthorized" };
  }

  await prisma.meetApplication.update({
    where: { id: applicationId },
    data: { status: "APPROVED" }
  });

  await prisma.meetAttendance.create({
    data: {
      meetId: application.meetId,
      userId: application.userId,
      status: "GOING",
      role: "ATTENDEE"
    }
  });

  revalidatePath(`/meets/${application.meetId}/manage`);
  return { success: true };
}
