"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { ArrowRight, Loader2 } from "lucide-react";

type OAuthStrategy = "oauth_google" | "oauth_discord" | "oauth_github";

const oauthDoors: Array<{
  label: string;
  strategy: OAuthStrategy;
}> = [
  { label: "Continue with Google", strategy: "oauth_google" },
  { label: "Continue with GitHub", strategy: "oauth_github" },
  { label: "Continue with Discord", strategy: "oauth_discord" },
];

export default function AuthPage() {
  const router = useRouter();
  const { signIn, isLoaded } = useSignIn();
  const [loadingStrategy, setLoadingStrategy] = useState<OAuthStrategy | null>(null);
  const [email, setEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleOAuth = async (strategy: OAuthStrategy) => {
    if (!isLoaded || !signIn || loadingStrategy || emailLoading) return;

    setMessage("");
    setLoadingStrategy(strategy);

    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/auth-complete",
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to continue right now.");
      setLoadingStrategy(null);
    }
  };

  const continueWithEmail = async () => {
    if (!isLoaded || !signIn || emailLoading || loadingStrategy) return;

    const identifier = email.trim();
    if (!identifier) return;

    setMessage("");
    setEmailLoading(true);

    try {
      const result = await signIn.emailLink.sendLink({
        emailAddress: identifier,
        redirectUrl: "/sso-callback",
        redirectUrlComplete: "/auth-complete",
      });

      if (result.error) throw result.error;
      setMessage("Check your email to continue.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to continue with email right now.");
    } finally {
      setEmailLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-paper lg:grid-cols-[1.08fr_0.92fr]">
      <section className="relative hidden overflow-hidden border-r border-g3 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.4),transparent_22%),linear-gradient(135deg,rgba(255,255,255,0.34),transparent_48%),radial-gradient(circle_at_78%_80%,rgba(0,0,0,0.22),transparent_28%)] opacity-70 dark:opacity-100" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_48%,rgba(0,0,0,0.28)_100%)] dark:bg-[radial-gradient(circle_at_50%_50%,transparent_44%,rgba(0,0,0,0.72)_100%)]" />
        <div className="absolute inset-0 cursor-crosshair" />

        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-ink dark:text-white">
          <div className="max-w-[34rem]">
            <div className="eyebrow mb-5 text-g5">Identity, quietly handled</div>
            <h1 className="serif max-w-[12ch] text-[clamp(4.5rem,8vw,7.8rem)] leading-[0.86] tracking-[-0.07em]">
              Convoke.
            </h1>
            <p className="mt-6 max-w-[30rem] text-[18px] leading-8 text-g6">
              For people building the future.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              ["Unified", "One path for every return visit"],
              ["Invisible", "No sign in vs sign up split"],
              ["Native", "Feels like the product, not a vendor"],
            ].map(([title, copy]) => (
              <div
                key={title}
                className="rounded-[24px] border border-g3 bg-white/20 p-4 backdrop-blur-xl dark:bg-white/6"
              >
                <div className="mono text-[10px] uppercase tracking-[0.18em] text-brand">{title}</div>
                <div className="mt-3 text-[13px] leading-6 text-g6">{copy}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative flex items-center justify-center px-6 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,color-mix(in_srgb,var(--brand)_16%,transparent),transparent_34%)]" />
        <div className="premium-card relative z-10 w-full max-w-[500px] p-7 sm:p-9">
          <div className="text-center">
            <div className="serif text-4xl tracking-tight text-ink">Convoke.</div>
            <div className="mt-3 text-[15px] leading-6 text-g6">For people building the future.</div>
          </div>

          {message ? (
            <div className="mt-6 rounded-[18px] border border-g3 bg-paper-elevated p-4 text-center text-[13px] leading-6 text-g6">
              {message}
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3">
            {oauthDoors.map((door) => (
              <button
                key={door.strategy}
                type="button"
                onClick={() => handleOAuth(door.strategy)}
                disabled={Boolean(loadingStrategy) || emailLoading}
                className="group flex h-12 w-full items-center justify-between rounded-full border border-g3 bg-paper-elevated/70 px-4 text-[14px] font-medium text-ink transition-all hover:-translate-y-0.5 hover:border-brand/35 disabled:cursor-wait disabled:opacity-80"
              >
                <span>{door.label}</span>
                {loadingStrategy === door.strategy ? (
                  <Loader2 size={16} className="animate-spin text-brand" />
                ) : (
                  <ArrowRight size={15} className="text-g5 transition-colors group-hover:text-brand" />
                )}
              </button>
            ))}
          </div>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-g3" />
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-g5">or</div>
            <div className="h-px flex-1 bg-g3" />
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-medium text-ink">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="h-12 w-full rounded-full border border-g3 bg-transparent px-4 text-[14px] text-ink outline-none focus:border-brand/55"
            />
            <button
              type="button"
              onClick={continueWithEmail}
              disabled={emailLoading || Boolean(loadingStrategy)}
              className="ink-button h-12 w-full px-5 text-[14px]"
            >
              <span>Continue</span>
              {emailLoading ? <Loader2 size={15} className="animate-spin" /> : null}
            </button>
          </div>

          <p className="mt-7 text-center text-[11px] leading-relaxed text-g5">
            By continuing, you agree to{" "}
            <Link href="/terms" className="font-medium text-ink hover:text-brand">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-medium text-ink hover:text-brand">
              Privacy
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
