"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateSettings(data: {
  displayName?: string;
  username?: string;
  headline?: string;
  bio?: string;
  location?: string;
  website?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  readcvUrl?: string;
}) {
  const user = await requireUser();

  // If username is changing, ensure it's unique
  if (data.username && data.username !== user.username) {
    const existing = await prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existing) {
      return { success: false, error: "Handle is already taken." };
    }
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      displayName: data.displayName,
      username: data.username,
      headline: data.headline,
      bio: data.bio,
      location: data.location,
      website: data.website,
      github: data.githubUrl,
      linkedin: data.linkedinUrl,
      twitter: data.twitterUrl,
      portfolio: data.readcvUrl,
    },
  });

  revalidatePath("/settings");
  revalidatePath("/workspace");
  revalidatePath(`/profile/${data.username || user.username}`);
  return { success: true };
}
