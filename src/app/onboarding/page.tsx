import { redirect } from "next/navigation";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { Shell } from "@/components/Shell";
import { OnboardingClient } from "./OnboardingClient";

export default async function OnboardingPage() {
  const user = await requireUser().catch(() => null);
  
  if (!user) {
    redirect("/auth");
  }

  if (user.onboardingCompleted) {
    redirect("/workspace");
  }

  return (
    <Shell>
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 py-10">
        <div className="mb-8 flex items-center justify-between border-b border-g3/60 pb-5">
          <div>
            <div className="eyebrow">New user setup</div>
            <h1 className="serif text-5xl mt-2">Welcome to Convoke.</h1>
            <p className="mt-3 max-w-[56ch] text-[15px] leading-7 text-g5">
              Let’s build your home on the internet. This takes a minute, and you can edit everything later from settings.
            </p>
          </div>
          <Link href="/workspace" className="ghost-button text-[13px]">
            Skip for now
          </Link>
        </div>

        <OnboardingClient initialUser={user} />
      </div>
    </Shell>
  );
}
