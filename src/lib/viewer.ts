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
      `${email.split("@")[0].toLowerCase().replace(/[^a-z0-9-]/g, "-")}-${Math.floor(Math.random() * 10000)}`;
    const name =
      `${clerk.firstName ?? ""} ${clerk.lastName ?? ""}`.trim() ||
      clerk.fullName ||
      username;

    return prisma.user.upsert({
      where: { email },
      update: {
        clerkId: userId,
        avatarUrl: clerk.imageUrl,
        displayName: name,
        username,
      },
      create: {
        clerkId: userId,
        email,
        username,
        displayName: name,
        headline: "Building through communities, opportunities, and events",
        role: UserRole.STUDENT,
        avatarUrl: clerk.imageUrl,
      },
      include: {
        
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
    `${user.email.split("@")[0].toLowerCase().replace(/[^a-z0-9-]/g, "-")}-${Math.floor(Math.random() * 10000)}`;
  const name =
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    username;

  return prisma.user.upsert({
    where: { email: user.email },
    update: {
      displayName: name,
      username,
      avatarUrl: user.user_metadata?.avatar_url || null,
    },
    create: {
      clerkId: `supabase_${user.id}`,
      email: user.email,
      username,
      displayName: name,
      headline: "Building through communities, opportunities, and events",
      role: UserRole.STUDENT,
      avatarUrl: user.user_metadata?.avatar_url || null,
    },
    include: {
      
      memberships: true,
      communityMemberships: true,
    },
  });
}
