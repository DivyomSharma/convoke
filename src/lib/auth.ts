import { prisma } from "@/lib/prisma";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function requireUser() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized: Must be logged in.");
  }

  let dbUser = await prisma.user.findUnique({
    where: { id: userId },
  });

    if (!dbUser) {
      const clerkUser = await currentUser();
      if (!clerkUser) throw new Error("User record not found in Clerk.");
      const email = clerkUser.emailAddresses[0]?.emailAddress || "unknown@example.com";
      const fullName = clerkUser.fullName || [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || "User";
      const username = clerkUser.username || email.split("@")[0] || `user-${userId.slice(0, 8)}`;
      
      const existingByEmail = await prisma.user.findUnique({ where: { email } });
      if (existingByEmail) {
        dbUser = await prisma.user.update({
          where: { email },
          data: { id: userId, displayName: fullName, username },
        });
      } else {
        dbUser = await prisma.user.create({
          data: {
            id: userId,
            email: email,
            displayName: fullName,
            username,
            name: fullName,
            avatarUrl: clerkUser.imageUrl,
          },
        });
      }
  }

  return dbUser;
}
