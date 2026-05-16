"use client";

import { CircleUserRound, Mail } from "lucide-react";
import { useSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

type OAuthStrategy =
  | "oauth_google"
  | "oauth_apple"
  | "oauth_facebook"
  | "oauth_github"
  | "oauth_discord";

const providers: { label: string; strategy: OAuthStrategy }[] = [
  { label: "Google", strategy: "oauth_google" },
  { label: "Apple", strategy: "oauth_apple" },
  { label: "Facebook", strategy: "oauth_facebook" },
  { label: "GitHub", strategy: "oauth_github" },
  { label: "Discord", strategy: "oauth_discord" },
];

export default function SignInPage() {
  const { signIn } = useSignIn();

  const oauth = (strategy: OAuthStrategy) => {
    const clerkSignIn = signIn as unknown as {
      authenticateWithRedirect?: (input: {
        redirectUrl: string;
        redirectUrlComplete: string;
        strategy: OAuthStrategy;
      }) => Promise<unknown>;
    };

    void clerkSignIn.authenticateWithRedirect?.({
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/workspace",
      strategy,
    });
  };

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-[1fr_520px]">
      <section className="relative hidden overflow-hidden border-r border-line p-10 lg:block">
        <div className="metal-grid absolute inset-0 h-full opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(185,101,53,0.24),transparent_34%),radial-gradient(circle_at_70%_70%,rgba(141,161,184,0.18),transparent_32%)]" />
        <div className="relative flex h-full flex-col justify-between">
          <Link href="/" className="text-sm font-semibold tracking-[0.2em]">
            CONVOKE
          </Link>
          <div>
            <h1 className="max-w-3xl text-7xl font-semibold leading-[0.9] tracking-[-0.05em]">
              Step into the room.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-muted">
              For organizers, volunteers, sponsors, creators, attendees, NGOs,
              and student teams gathering around the next thing worth building.
            </p>
          </div>
        </div>
      </section>
      <section className="flex items-center justify-center px-5 py-10">
        <Panel className="w-full max-w-md p-6">
          <h2 className="text-3xl font-medium tracking-[-0.03em]">Sign in</h2>
          <p className="mt-2 text-sm text-muted">
            Join the people, events, and ideas moving forward.
          </p>
          <div className="mt-7 grid gap-3">
            {providers.map((provider) => (
              <Button
                key={provider.strategy}
                variant="secondary"
                onClick={() => oauth(provider.strategy)}
                className="justify-start"
              >
                {provider.label === "GitHub" ? (
                  <CircleUserRound className="size-4" />
                ) : (
                  <span className="grid size-4 place-items-center rounded-full border border-line text-[9px]">
                    {provider.label[0]}
                  </span>
                )}
                Continue with {provider.label}
              </Button>
            ))}
          </div>
          <div className="my-6 h-px bg-line" />
          <label className="space-y-2">
            <span className="text-xs uppercase tracking-[0.22em] text-muted">
              Email
            </span>
            <div className="flex h-12 items-center gap-3 rounded-[8px] border border-line bg-black/40 px-4">
              <Mail className="size-4 text-muted" />
              <input
                type="email"
                placeholder="you@community.org"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted/60"
              />
            </div>
          </label>
          <Button className="mt-4 w-full">Continue with email</Button>
        </Panel>
      </section>
    </main>
  );
}
