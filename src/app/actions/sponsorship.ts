"use server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

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

  if (!sponsorId) throw new Error("Sponsor is required.");

  try {
    await prisma.sponsorshipRequest.create({
      data: {
        requesterId: user.id,
        sponsorId,
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

  redirect("/sponsors?success=true");
}
