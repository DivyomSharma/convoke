import { redirect } from "next/navigation";
import { getAuthenticatedDbUser } from "@/lib/viewer";
import { OnboardingClient } from "./client";

export default async function OnboardingPage() {
  const user = await getAuthenticatedDbUser();

  if (!user) {
    redirect("/auth/sign-in");
  }

  if (user.onboardingDone) {
    redirect("/workspace");
  }

  return <OnboardingClient user={user} />;
}
