import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export default async function AuthCompletePage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/auth");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: userId },
    select: { onboardingCompleted: true },
  });

  if (!dbUser || !dbUser.onboardingCompleted) {
    redirect("/onboarding");
  }

  redirect("/workspace");
}
