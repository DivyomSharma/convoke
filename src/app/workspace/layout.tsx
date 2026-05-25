import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organize — Convoke Dashboard",
  description: "A collaborative Convoke hub for event teams, volunteers, sponsors, merch plans, and community momentum.",
};

import { redirect } from "next/navigation";
import { getAuthenticatedDbUser } from "@/lib/viewer";

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const user = await getAuthenticatedDbUser();
  if (user && !user.onboardingDone) {
    redirect("/onboarding");
  }
  
  return children;
}
