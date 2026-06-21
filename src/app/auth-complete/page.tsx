import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export default async function AuthCompletePage() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    redirect("/auth");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: clerkUser.id },
    select: { onboardingCompleted: true },
  });

  if (!dbUser || !dbUser.onboardingCompleted) {
    redirect("/onboarding");
  }

  redirect("/workspace");
}
