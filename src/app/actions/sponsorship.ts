"use server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createSponsorshipRequest(formData: FormData) {
  const user = await requireUser();

  const sponsorId = formData.get("sponsorId") as string;
  const meetId = formData.get("meetId") as string;
  const challengeId = formData.get("challengeId") as string;
  const audienceSize = formData.get("audienceSize") as string;
  const college = formData.get("college") as string;
  const budget = formData.get("budget") as string;
  const deliverables = formData.get("deliverables") as string;
  const benefits = formData.get("benefits") as string;
  const deckUrl = formData.get("deckUrl") as string;

  try {
    await prisma.sponsorshipRequest.create({
      data: {
        requesterId: user.id,
        sponsorId: sponsorId || undefined,
        meetId: meetId || undefined,
        challengeId: challengeId || undefined,
        audienceSize,
        college,
        budget,
        deliverables,
        benefits,
        deckUrl
      }
    });
  } catch {
    throw new Error("Failed to create sponsorship request.");
  }

  // If created from meet manager, revalidate instead of redirecting
  if (meetId && !sponsorId) {
    revalidatePath(`/meets/${meetId}/manage`);
    return;
  }

  redirect("/sponsors?success=true");
}

export async function getMeetSponsorshipRequests(meetId: string) {
  const user = await requireUser();

  return await prisma.sponsorshipRequest.findMany({
    where: { meetId },
    include: {
      sponsor: {
        select: { id: true, name: true, logoUrl: true, slug: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function getSponsorInbox(orgId: string) {
  const user = await requireUser();

  return await prisma.sponsorshipRequest.findMany({
    where: { sponsorId: orgId },
    include: {
      requester: {
        select: { id: true, name: true, avatarUrl: true, handle: true }
      },
      meet: {
        select: { id: true, title: true, bannerUrl: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function updateSponsorshipRequestStatus(id: string, status: string) {
  const user = await requireUser();

  const req = await prisma.sponsorshipRequest.update({
    where: { id },
    data: { status }
  });

  if (req.sponsorId) {
    const org = await prisma.organization.findUnique({ where: { id: req.sponsorId } });
    if (org) {
      revalidatePath(`/workspace/org/${org.slug}/sponsorship`);
    }
  }

  return { success: true };
}
