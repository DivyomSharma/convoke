"use client";

import { useState } from "react";
import Link from "next/link";
import { useSignIn } from "@clerk/nextjs/legacy";
import { AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";

const oauthProviders = [
  {
    label: "Continue with Google",
    strategy: "oauth_google" as const,
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
        <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84Z" />
        <path fill="#EA4335" d="M12 5.37c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.37 12 5.37Z" />
      </svg>
    ),
  },
  {
    label: "Continue with GitHub",
    strategy: "oauth_github" as const,
    icon: (
      <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
        <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.46 11.46 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.62-2.81 5.65-5.49 5.95.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
      </svg>
    ),
  },
  {
    label: "Continue with Discord",
    strategy: "oauth_discord" as const,
    icon: (
      <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
        <path d="M20.32 4.37A16.62 16.62 0 0 0 16.25 3c-.18.32-.39.76-.53 1.1-1.15-.17-2.3-.17-3.42 0-.15-.34-.36-.78-.54-1.1a16.54 16.54 0 0 0-4.08 1.37C5.1 8.19 4.4 11.9 4.76 15.55a16.72 16.72 0 0 0 5 2.53c.4-.55.75-1.14 1.05-1.76-.58-.22-1.14-.49-1.67-.8.14-.1.27-.2.4-.31 3.22 1.51 6.72 1.51 9.9 0 .14.11.27.21.41.31-.53.31-1.09.58-1.67.8.3.62.65 1.21 1.05 1.76a16.63 16.63 0 0 0 5.01-2.53c.42-4.23-.72-7.9-3.92-11.18ZM9.68 13.3c-.97 0-1.76-.9-1.76-2s.78-2 1.76-2 1.77.9 1.76 2c0 1.1-.78 2-1.76 2Zm4.64 0c-.97 0-1.76-.9-1.76-2s.78-2 1.76-2 1.76.9 1.76 2c0 1.1-.78 2-1.76 2Z" />
      </svg>
    ),
  },
];

export default function SignInPage() {
  const [status, setStatus] = useState<"idle" | "oauth">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const { signIn } = useSignIn();

  const oauthLogin = async (provider: (typeof oauthProviders)[number]["strategy"]) => {
    setMessage(null);
    if (!signIn || typeof signIn.authenticateWithRedirect !== "function") return;

    try {
      setStatus("oauth");
      await signIn.authenticateWithRedirect({
        strategy: provider,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/workspace",
      });
    } catch (error) {
      setMessage(readAuthError(error, "Could not start social login."));
      setStatus("idle");
    }
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
              For organizers, volunteers, creators, founders, and students gathering around the next thing worth building.
            </p>
            <div className="mt-8 flex -space-x-3">
              {["MK", "AS", "NK", "KS", "SR", "VJ"].map((initials) => (
                <span
                  key={initials}
                  className="grid size-10 place-items-center rounded-full border-2 border-background bg-gradient-to-br from-bronze to-rust text-xs font-semibold text-black"
                >
                  {initials}
                </span>
              ))}
              <span className="grid size-10 place-items-center rounded-full border-2 border-background bg-surface text-xs text-muted">
                +3.8K
              </span>
            </div>
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
            {oauthProviders.map((provider) => (
              <Button
                key={provider.strategy}
                variant="secondary"
                onClick={() => oauthLogin(provider.strategy)}
                className="justify-start"
                disabled={status !== "idle"}
              >
                <span className="grid size-5 place-items-center">{provider.icon}</span>
                {provider.label}
              </Button>
            ))}
          </div>

          <div className="my-6 h-px bg-line" />

          {message ? (
            <div
              className="mt-4 flex gap-2 rounded-[8px] border border-rust/30 bg-rust/10 p-3 text-sm text-muted"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-rust" />
              <span>{message}</span>
            </div>
          ) : null}

          <p className="text-center text-xs text-muted">By continuing, you agree to our Terms of Service and Privacy Policy.</p>
        </Panel>
      </section>
    </main>
  );
}

function readAuthError(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return fallback;
}
