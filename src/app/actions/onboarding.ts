"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function completeOnboarding(data: {
  name?: string;
  handle?: string;
  bio?: string;
  headline?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  dob?: string;
  country?: string;
  state?: string;
  city?: string;
  timezone?: string;
  visibility?: "public" | "members" | "private";
}) {
  const user = await requireUser();

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: data.name?.trim() || user.name,
      handle: data.handle?.trim() || user.handle,
      bio: data.bio?.trim() || user.bio,
      headline: data.headline?.trim() || user.headline,
      avatarUrl: data.avatarUrl || user.avatarUrl,
      bannerUrl: data.bannerUrl || user.bannerUrl,
      country: data.country || user.country,
      state: data.state || user.state,
      city: data.city || user.city,
      timezone: data.timezone || user.timezone,
      visibility: data.visibility || user.visibility,
      location: [data.city, data.state, data.country].filter(Boolean).join(", ") || user.location,
      onboardingCompleted: true,
    },
  });

  revalidatePath("/workspace");
  revalidatePath("/settings");
  revalidatePath("/profile");
  revalidatePath("/");
  return { success: true };
}
