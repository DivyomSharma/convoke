import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";

export default async function AuthCompletePage() {
  const dbUser = await requireUser().catch(() => null);

  if (!dbUser) {
    redirect("/auth");
  }

  if (!dbUser.onboardingCompleted) {
    redirect("/onboarding");
  }

  redirect("/workspace");
}
