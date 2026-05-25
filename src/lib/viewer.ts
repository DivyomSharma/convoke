import { auth, currentUser } from "@clerk/nextjs/server";
import { UserRole } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function getAuthenticatedDbUser() {
  const prisma = getPrisma();
  const { userId } = await auth();

  if (userId) {
    const clerk = await currentUser();
    const email = clerk?.emailAddresses[0]?.emailAddress;
    if (!email) return null;

    const username =
      clerk.username ??
      email.split("@")[0].toLowerCase().replace(/[^a-z0-9-]/g, "-");
    const name =
      `${clerk.firstName ?? ""} ${clerk.lastName ?? ""}`.trim() ||
      clerk.fullName ||
      username;

    return prisma.user.upsert({
      where: { email },
      update: {
        clerkId: userId,
        imageUrl: clerk.imageUrl,
        name,
        username,
      },
      create: {
        clerkId: userId,
        email,
        username,
        name,
        headline: "Building through communities, opportunities, and events",
        primaryRole: UserRole.PARTICIPANT,
        imageUrl: clerk.imageUrl,
        profile: {
          create: {
            avatarUrl: clerk.imageUrl,
            skills: [],
            badges: [],
            interests: [],
          },
        },
      },
      include: {
        profile: true,
        memberships: true,
        communityMemberships: true,
      },
    });
  }

  const supabase = await getSupabaseServerClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  const username =
    user.user_metadata?.username ||
    user.email.split("@")[0].toLowerCase().replace(/[^a-z0-9-]/g, "-");
  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    username;

  return prisma.user.upsert({
    where: { email: user.email },
    update: {
      name,
      username,
      imageUrl: user.user_metadata?.avatar_url || null,
    },
    create: {
      email: user.email,
      username,
      name,
      headline: "Building through communities, opportunities, and events",
      primaryRole: UserRole.PARTICIPANT,
      imageUrl: user.user_metadata?.avatar_url || null,
      profile: {
        create: {
          avatarUrl: user.user_metadata?.avatar_url || null,
          skills: [],
          badges: [],
          interests: [],
        },
      },
    },
    include: {
      profile: true,
      memberships: true,
      communityMemberships: true,
    },
  });
}
