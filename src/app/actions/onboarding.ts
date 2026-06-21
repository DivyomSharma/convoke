"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

export async function completeOnboarding(data: {
  displayName?: string;
  name?: string;
  username?: string;
  handle?: string;
  bio?: string;
  headline?: string;
  pronouns?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  dob?: string;
  country?: string;
  state?: string;
  city?: string;
  timezone?: string;
  visibility?: "public" | "members" | "private";
  website?: string;
  portfolio?: string;
  linkedin?: string;
  github?: string;
  twitter?: string;
  instagram?: string;
  discord?: string;
  telegram?: string;
  currentRole?: string;
  company?: string;
  themePreference?: string;
}) {
  const user = await requireUser();

  await prisma.user.update({
    where: { id: user.id },
    data: {
      displayName: data.displayName?.trim() || data.name?.trim() || user.displayName || user.name,
      name: data.displayName?.trim() || data.name?.trim() || user.name,
      username: data.username?.trim() || data.handle?.trim() || user.username || user.handle,
      handle: data.username?.trim() || data.handle?.trim() || user.handle,
      bio: data.bio?.trim() || user.bio,
      headline: data.headline?.trim() || user.headline,
      pronouns: data.pronouns?.trim() || user.pronouns,
      avatarUrl: data.avatarUrl || user.avatarUrl,
      bannerUrl: data.bannerUrl || user.bannerUrl,
      country: data.country || user.country,
      state: data.state || user.state,
      city: data.city || user.city,
      timezone: data.timezone || user.timezone,
      visibility: data.visibility || user.visibility,
      website: data.website?.trim() || user.website,
      portfolio: data.portfolio?.trim() || user.portfolio,
      linkedin: data.linkedin?.trim() || user.linkedin,
      github: data.github?.trim() || user.github,
      twitter: data.twitter?.trim() || user.twitter,
      instagram: data.instagram?.trim() || user.instagram,
      discord: data.discord?.trim() || user.discord,
      telegram: data.telegram?.trim() || user.telegram,
      currentRole: data.currentRole?.trim() || user.currentRole,
      company: data.company?.trim() || user.company,
      themePreference: data.themePreference?.trim() || user.themePreference,
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
