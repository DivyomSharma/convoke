"use client";

import { AlertCircle, Loader2, Lock, Mail } from "lucide-react";
import { useSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { getSupabaseBrowserClient } from "@/lib/supabase";

type OAuthStrategy =
  | "oauth_google"
  | "oauth_apple"
  | "oauth_facebook"
  | "oauth_github"
  | "oauth_discord";

const providers: { label: string; strategy: OAuthStrategy; icon: ReactNode }[] = [
  { label: "Google", strategy: "oauth_google", icon: <GoogleLogo /> },
  { label: "Apple", strategy: "oauth_apple", icon: <AppleLogo /> },
  { label: "Facebook", strategy: "oauth_facebook", icon: <FacebookLogo /> },
  { label: "GitHub", strategy: "oauth_github", icon: <GitHubLogo /> },
  { label: "Discord", strategy: "oauth_discord", icon: <DiscordLogo /> },
];

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "oauth" | "email" | "signup">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const oauth = async (strategy: OAuthStrategy) => {
    setMessage(null);
    if (!signIn) {
      setMessage("Clerk is still loading. Try again in a moment.");
      return;
    }

    setStatus("oauth");
    const clerkSignIn = signIn as unknown as {
      sso?: (input: {
        redirectCallbackUrl?: string;
        redirectUrl: string;
        strategy: OAuthStrategy;
      }) => Promise<{ error: unknown | null }>;
      authenticateWithRedirect?: (input: {
        redirectUrl: string;
        redirectUrlComplete: string;
        strategy: OAuthStrategy;
      }) => Promise<void>;
    };

    try {
      if (clerkSignIn.sso) {
        const result = await clerkSignIn.sso({
          redirectCallbackUrl: "/sso-callback",
          redirectUrl: "/workspace",
          strategy,
        });

        if (result?.error) {
          throw result.error;
        }
      } else {
        await clerkSignIn.authenticateWithRedirect?.({
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/workspace",
          strategy,
        });
      }
    } catch (error) {
      setStatus("idle");
      setMessage(readAuthError(error, "Could not start OAuth. Check the provider in Clerk."));
    }
  };

  const emailPassword = async (mode: "login" | "signup") => {
    setMessage(null);
    if (!email || !password) {
      setMessage("Enter both email and password.");
      return;
    }

    setStatus(mode === "login" ? "email" : "signup");

    try {
      const supabase = getSupabaseBrowserClient();
      const result =
        mode === "login"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({
              email,
              password,
              options: {
                emailRedirectTo:
                  typeof window === "undefined"
                    ? undefined
                    : `${window.location.origin}/workspace`,
              },
            });

      if (result.error) {
        throw result.error;
      }

      if (mode === "signup" && !result.data.session) {
        setStatus("idle");
        setMessage("Account created. Check your email to confirm, then sign in.");
        return;
      }

      router.push("/workspace");
      router.refresh();
    } catch (error) {
      setStatus("idle");
      setMessage(readAuthError(error, "Email/password auth failed. Check Supabase settings."));
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
                disabled={status !== "idle"}
                className="justify-start"
              >
                <span className="grid size-5 place-items-center">{provider.icon}</span>
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
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@community.org"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted/60"
              />
            </div>
          </label>
          <label className="mt-4 block space-y-2">
            <span className="text-xs uppercase tracking-[0.22em] text-muted">
              Password
            </span>
            <div className="flex h-12 items-center gap-3 rounded-[8px] border border-line bg-black/40 px-4">
              <Lock className="size-4 text-muted" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted/60"
              />
            </div>
          </label>
          {message ? (
            <div className="mt-4 flex gap-2 rounded-[8px] border border-rust/30 bg-rust/10 p-3 text-sm text-muted">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-rust" />
              <span>{message}</span>
            </div>
          ) : null}
          <Button
            className="mt-4 w-full"
            disabled={status !== "idle"}
            onClick={() => emailPassword("login")}
          >
            {status === "email" ? <Loader2 className="size-4 animate-spin" /> : null}
            Sign in with email
          </Button>
          <Button
            className="mt-3 w-full"
            disabled={status !== "idle"}
            onClick={() => emailPassword("signup")}
            variant="secondary"
          >
            {status === "signup" ? <Loader2 className="size-4 animate-spin" /> : null}
            Create email account
          </Button>
        </Panel>
      </section>
    </main>
  );
}

function readAuthError(error: unknown, fallback: string) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error && "message" in error) {
    return String((error as { message: unknown }).message);
  }

  return fallback;
}

function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.37c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.37 12 5.37Z" />
    </svg>
  );
}

function AppleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
      <path d="M16.37 1.43c0 1.08-.44 2.11-1.16 2.89-.77.83-2.03 1.48-3.05 1.39-.13-1.03.39-2.15 1.11-2.95.8-.88 2.18-1.52 3.1-1.33Zm3.55 16.96c-.61 1.4-.91 2.03-1.69 3.27-1.1 1.69-2.65 3.8-4.58 3.82-1.71.02-2.15-1.11-4.48-1.1-2.33.01-2.81 1.13-4.52 1.11-1.93-.02-3.4-1.92-4.5-3.62-3.08-4.73-3.4-10.29-1.5-13.24 1.35-2.09 3.48-3.31 5.49-3.31 2.05 0 3.34 1.12 5.04 1.12 1.65 0 2.66-1.12 5.04-1.12 1.8 0 3.71.98 5.06 2.67-4.44 2.43-3.72 8.77.64 10.4Z" transform="scale(.88) translate(2 -1)" />
    </svg>
  );
}

function FacebookLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path fill="#1877F2" d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
    </svg>
  );
}

function GitHubLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.46 11.46 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.62-2.81 5.65-5.49 5.95.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

function DiscordLogo() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path fill="#5865F2" d="M20.32 4.37A19.79 19.79 0 0 0 15.37 2.8a.07.07 0 0 0-.08.04c-.21.38-.45.87-.61 1.25a18.27 18.27 0 0 0-5.36 0 12.64 12.64 0 0 0-.62-1.25.08.08 0 0 0-.08-.04 19.74 19.74 0 0 0-4.95 1.57.07.07 0 0 0-.03.03C.54 9.05-.32 13.58.1 18.06c0 .02.01.04.03.05a19.9 19.9 0 0 0 6.07 3.08.08.08 0 0 0 .09-.03c.47-.64.89-1.31 1.25-2.02a.08.08 0 0 0-.04-.1 13.08 13.08 0 0 1-1.9-.91.08.08 0 0 1-.01-.13l.37-.29a.08.08 0 0 1 .08-.01c3.95 1.8 8.22 1.8 12.12 0a.08.08 0 0 1 .09.01c.12.1.24.2.37.29a.08.08 0 0 1 0 .13c-.6.35-1.23.66-1.9.91a.08.08 0 0 0-.04.11c.37.7.79 1.37 1.25 2.01a.08.08 0 0 0 .09.03 19.84 19.84 0 0 0 6.08-3.08.08.08 0 0 0 .03-.05c.5-5.18-.84-9.67-3.84-13.66a.06.06 0 0 0-.03-.04ZM8.02 15.33c-1.19 0-2.17-1.1-2.17-2.45s.96-2.45 2.17-2.45c1.22 0 2.19 1.1 2.17 2.45 0 1.35-.96 2.45-2.17 2.45Zm7.97 0c-1.19 0-2.17-1.1-2.17-2.45s.96-2.45 2.17-2.45c1.22 0 2.19 1.1 2.17 2.45 0 1.35-.95 2.45-2.17 2.45Z" />
    </svg>
  );
}
