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
    
    const existingByEmail = await prisma.user.findUnique({ where: { email } });
    if (existingByEmail) {
      dbUser = await prisma.user.update({
        where: { email },
        data: { id: userId },
      });
    } else {
      dbUser = await prisma.user.create({
        data: {
          id: userId,
          email: email,
          name: clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName}`.trim() : "User",
          avatarUrl: clerkUser.imageUrl,
        },
      });
    }
  }

  return dbUser;
}
