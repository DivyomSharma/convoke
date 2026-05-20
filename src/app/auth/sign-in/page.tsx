"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs/legacy";
import { AlertCircle, Loader2, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { getSupabaseBrowserClient } from "@/lib/supabase";

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
    label: "Continue with Apple",
    strategy: "oauth_apple" as const,
    icon: (
      <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
        <path d="M16.37 12.08c.02 2.18 1.92 2.91 1.94 2.92-.02.05-.3 1.04-.99 2.06-.59.88-1.21 1.76-2.18 1.78-.95.02-1.26-.56-2.36-.56-1.1 0-1.44.54-2.33.58-.94.04-1.66-.95-2.25-1.82-1.2-1.74-2.11-4.91-.88-7.03.61-1.05 1.7-1.71 2.88-1.73.9-.02 1.74.6 2.36.6.61 0 1.76-.74 2.97-.63.51.02 1.95.21 2.87 1.55-.07.05-1.71 1-1.69 2.98ZM14.53 6.27c.49-.59.82-1.41.73-2.23-.71.03-1.56.47-2.07 1.05-.45.52-.84 1.35-.73 2.14.79.06 1.58-.4 2.07-.96Z" />
      </svg>
    ),
  },
  {
    label: "Continue with Facebook",
    strategy: "oauth_facebook" as const,
    icon: (
      <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
        <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.88.24-1.48 1.5-1.48H16.7V4.9c-.3-.04-1.32-.12-2.5-.12-2.48 0-4.2 1.51-4.2 4.29V11H7.2v3H10V22h3.5Z" />
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
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "login" | "signup" | "oauth">("idle");
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

  const emailPassword = async (mode: "login" | "signup") => {
    setMessage(null);

    try {
      setStatus(mode);
      const supabase = getSupabaseBrowserClient();

      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/workspace");
        router.refresh();
        return;
      }

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            typeof window !== "undefined" ? `${window.location.origin}/workspace` : undefined,
          data: {
            username: email.split("@")[0],
          },
        },
      });

      if (error) throw error;
      setMessage("Account created. Check your inbox if email confirmation is enabled, then continue to your workspace.");
    } catch (error) {
      setMessage(readAuthError(error, "Could not continue with email."));
    } finally {
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
              For organizers, volunteers, sponsors, creators, attendees, NGOs,
              and student teams gathering around the next thing worth building.
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

          <label className="space-y-2">
            <span className="text-xs uppercase tracking-[0.22em] text-muted">Email</span>
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
            <span className="text-xs uppercase tracking-[0.22em] text-muted">Password</span>
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
            <div
              className={`mt-4 flex gap-2 rounded-[8px] border p-3 text-sm ${
                message.startsWith("Account created")
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                  : "border-rust/30 bg-rust/10 text-muted"
              }`}
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-rust" />
              <span>{message}</span>
            </div>
          ) : null}

          <Button
            className="mt-4 w-full"
            disabled={status !== "idle"}
            onClick={() => emailPassword("login")}
          >
            {status === "login" ? <Loader2 className="size-4 animate-spin" /> : null}
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
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return fallback;
}
