"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { ArrowRight, Loader2 } from "lucide-react";

type OAuthStrategy = "oauth_google" | "oauth_discord" | "oauth_github";

const oauthDoors: Array<{
  label: string;
  strategy: OAuthStrategy;
  icon: "google" | "discord" | "github";
}> = [
  { label: "Continue with Google", strategy: "oauth_google", icon: "google" },
  { label: "Continue with Discord", strategy: "oauth_discord", icon: "discord" },
  { label: "Continue with GitHub", strategy: "oauth_github", icon: "github" },
];

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginExperience />
    </Suspense>
  );
}

function LoginExperience() {
  const { signIn, fetchStatus } = useSignIn();
  const searchParams = useSearchParams();
  const [loadingStrategy, setLoadingStrategy] = useState<OAuthStrategy | null>(null);
  const [error, setError] = useState("");
  const requestedNext = searchParams.get("next") || searchParams.get("redirect_url") || "/workspace";
  const next = requestedNext.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/workspace";

  const handleOAuth = async (strategy: OAuthStrategy) => {
    if (loadingStrategy) return;
    if (!signIn || fetchStatus === "fetching") {
      setError("Clerk is still loading. If this stays visible, check NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in the deployment environment.");
      return;
    }

    setError("");
    setLoadingStrategy(strategy);

    try {
      const result = await signIn.sso({
        strategy,
        redirectUrl: "/sso-callback",
        redirectCallbackUrl: next,
      });

      if (result?.error) {
        throw result.error;
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "That sign-in door did not open. Try another provider or come back in a moment.";
      setError(message);
      setLoadingStrategy(null);
    }
  };

  return (
    <main className="grid min-h-screen bg-paper lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden border-r border-g3 lg:flex">
        <div className="absolute inset-0 bg-[#070707]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_35%,rgba(0,178,255,0.18),transparent_34%),radial-gradient(circle_at_75%_80%,rgba(127,29,45,0.22),transparent_30%)]" />

        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
          <Link href="/" className="serif text-3xl tracking-tight">
            Convoke.
          </Link>

          <div className="max-w-[35rem]">
            <div className="mono mb-5 text-[11px] uppercase tracking-[0.24em] text-white/55">
              Secure ecosystem access
            </div>
            <h1 className="serif text-6xl leading-[0.92] tracking-[-0.055em] xl:text-7xl">
              Enter the network where momentum compounds.
            </h1>
            <p className="mt-6 max-w-[30rem] text-[16px] leading-8 text-white/68">
              Sign in once to join spaces, register for events, apply to roles, save opportunities, and build your Convoke passport.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              ["Events", "RSVP and track passes"],
              ["Roles", "Apply with your profile"],
              ["Spaces", "Join real communities"],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-[24px] border border-white/10 bg-white/7 p-4 backdrop-blur-xl">
                <div className="mono text-[10px] uppercase tracking-[0.18em] text-brand">{title}</div>
                <div className="mt-3 text-[13px] leading-6 text-white/68">{copy}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative flex items-center justify-center px-6 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,color-mix(in_srgb,var(--brand)_14%,transparent),transparent_38%)]" />

        <div className="premium-card relative z-10 w-full max-w-[440px] p-7 sm:p-9">
          <div className="text-center">
            <Link href="/" className="serif text-4xl tracking-tight text-ink">
              Convoke.
            </Link>
            <p className="mx-auto mt-4 max-w-[32ch] text-[14px] leading-6 text-g6">
              Choose your identity provider. Clerk handles the secure session; Convoke keeps the experience native.
            </p>
          </div>

          {error ? (
            <div className="mt-6 rounded-[18px] border border-red-500/20 bg-red-500/10 p-4 text-center text-[13px] leading-6 text-red-500">
              {error}
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3">
            {oauthDoors.map((door) => (
              <button
                key={door.strategy}
                type="button"
                onClick={() => handleOAuth(door.strategy)}
                disabled={Boolean(loadingStrategy)}
                className="group flex h-12 w-full items-center justify-between rounded-full border border-g3 bg-paper-elevated/60 px-4 text-[14px] font-medium text-ink transition-all hover:-translate-y-0.5 hover:border-brand/35 hover:bg-paper-elevated disabled:cursor-wait disabled:opacity-80"
              >
                <span className="inline-flex items-center gap-3">
                  <ProviderIcon icon={door.icon} />
                  {door.label}
                </span>
                {loadingStrategy === door.strategy ? (
                  <Loader2 size={16} className="animate-spin text-brand" />
                ) : (
                  <ArrowRight size={15} className="text-g5 transition-colors group-hover:text-brand" />
                )}
              </button>
            ))}
          </div>

          <div className="mt-8 rounded-[22px] border border-g3 bg-g1/50 p-4 text-[13px] leading-6 text-g6">
            Email/password is intentionally not hand-rolled here. OAuth goes through Clerk’s verified redirect flow, then returns to your requested Convoke route.
          </div>

          <p className="mt-7 text-center text-[11px] leading-relaxed text-g5">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="font-medium text-ink hover:text-brand">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-medium text-ink hover:text-brand">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}

function ProviderIcon({ icon }: { icon: "google" | "discord" | "github" }) {
  if (icon === "github") {
    return (
      <svg className="h-[17px] w-[17px] shrink-0 fill-current text-ink" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.16c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.24 3.35.95.1-.74.4-1.24.73-1.53-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.16 1.18A10.9 10.9 0 0 1 12 6c.98 0 1.97.13 2.89.39 2.19-1.49 3.15-1.18 3.15-1.18.63 1.59.24 2.77.12 3.06.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.41-5.27 5.69.41.36.78 1.06.78 2.14v3.16c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
      </svg>
    );
  }

  if (icon === "discord") {
    return (
      <svg className="h-4 w-4 shrink-0 fill-[#5865F2]" viewBox="0 0 127.14 96.36" aria-hidden="true">
        <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c.9-.65,1.76-1.34,2.58-2.06a75.48,75.48,0,0,0,72.84,0c.82.72,1.68,1.41,2.58,2.06a68.43,68.43,0,0,1-10.5,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31-18.83C129,54.65,123.48,31.58,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
      </svg>
    );
  }

  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.63-1.01-1.44-1.21-2.63z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
    </svg>
  );
}
