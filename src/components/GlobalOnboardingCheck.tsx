import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { OnboardingPrompt } from "./OnboardingPrompt";

export async function GlobalOnboardingCheck() {
  const { userId } = await auth();
  if (!userId) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { onboardingCompleted: true },
  });

  if (dbUser && !dbUser.onboardingCompleted) {
    return <OnboardingPrompt />;
  }

  return null;
}
