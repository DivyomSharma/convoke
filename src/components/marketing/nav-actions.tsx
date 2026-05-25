import { auth } from "@clerk/nextjs/server";
import { ButtonLink } from "@/components/ui/button";
import { UserMenu, NavNotificationBell, NavSavedButton } from "./user-menu";

export async function NavActions() {
  const { userId } = await auth();

  if (userId) {
    return (
      <div className="hidden items-center gap-2 md:flex">
        <NavNotificationBell />
        <NavSavedButton />
        <UserMenu />
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-2 md:flex">
      <ButtonLink href="/auth/sign-in" variant="ghost">
        Sign in
      </ButtonLink>
      <ButtonLink href="/auth/sign-in">Join Convoke</ButtonLink>
    </div>
  );
}

export async function MobileNavActions() {
  const { userId } = await auth();

  if (userId) {
    return (
      <div className="space-y-3 border-t border-line p-5">
        <ButtonLink href="/workspace" className="w-full">
          Open Workspace
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="space-y-3 border-t border-line p-5">
      <ButtonLink
        href="/auth/sign-in"
        variant="secondary"
        className="w-full"
      >
        Sign in
      </ButtonLink>
      <ButtonLink href="/auth/sign-in" className="w-full">
        Join Convoke
      </ButtonLink>
    </div>
  );
}
