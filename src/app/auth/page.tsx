"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { ArrowRight, Code2, Loader2, MessageSquare, Search } from "lucide-react";

type OAuthStrategy = "oauth_google" | "oauth_discord" | "oauth_github";

const oauthDoors: Array<{
  label: string;
  strategy: OAuthStrategy;
  icon: typeof ArrowRight;
}> = [
  { label: "Continue with Google", strategy: "oauth_google", icon: Search },
  { label: "Continue with GitHub", strategy: "oauth_github", icon: Code2 },
  { label: "Continue with Discord", strategy: "oauth_discord", icon: MessageSquare },
];

export default function AuthPage() {
  const router = useRouter();
  const { signIn } = useSignIn();
  const [loadingStrategy, setLoadingStrategy] = useState<OAuthStrategy | null>(null);
  const [email, setEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleOAuth = async (strategy: OAuthStrategy) => {
    if (!signIn || loadingStrategy || emailLoading) return;

    setMessage("");
    setLoadingStrategy(strategy);

    try {
      await signIn.sso({
        strategy,
        redirectUrl: "/sso-callback",
        redirectCallbackUrl: "/auth-complete",
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to continue right now.");
      setLoadingStrategy(null);
    }
  };

  const continueWithEmail = async () => {
    if (!signIn || emailLoading || loadingStrategy) return;

    const identifier = email.trim();
    if (!identifier) return;

    setMessage("");
    setEmailLoading(true);

    try {
      const start = await signIn.create({
        identifier,
        signUpIfMissing: true,
      });

      if (start.error) throw start.error;

      const result = await signIn.emailLink.sendLink({
        verificationUrl: "/auth-complete",
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
    <main className="grid min-h-screen bg-[#F7F4EF] lg:grid-cols-[1.02fr_0.98fr] dark:bg-[#000]">
      <section className="relative hidden overflow-hidden border-r border-g3 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,.92)_0%,rgba(247,244,239,.98)_60%,#F7F4EF_100%)] lg:flex dark:bg-[#000]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_26%,rgba(0,178,255,0.10),transparent_30%),radial-gradient(circle_at_74%_80%,rgba(123,0,20,0.09),transparent_28%)] dark:bg-[radial-gradient(circle_at_30%_35%,rgba(0,178,255,0.18),transparent_34%),radial-gradient(circle_at_75%_80%,rgba(127,29,45,0.22),transparent_30%)]" />
        <div className="pointer-events-none absolute inset-0 hidden dark:block dark:bg-[radial-gradient(circle_at_50%_50%,transparent_52%,rgba(0,0,0,0.8)_100%)]" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-ink dark:text-white">
          <div className="max-w-[35rem]">
            <div className="mono mb-5 text-[11px] uppercase tracking-[0.24em] text-g5 dark:text-white/55">
              Secure ecosystem access
            </div>
            <h1 className="serif text-[clamp(4.2rem,7vw,7.1rem)] leading-[0.92] tracking-[-0.055em] text-ink dark:text-white">
              Convoke.
            </h1>
            <p className="mt-6 max-w-[30rem] text-[16px] leading-8 text-g6 dark:text-white/68">
              For people building the future.
            </p>
          </div>
        </div>
      </section>

      <section className="relative flex items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,.92)_0%,rgba(247,244,239,.98)_60%,#F7F4EF_100%)] px-6 py-12 dark:bg-[#000]">
        <div className="absolute inset-0 hidden dark:block dark:bg-[radial-gradient(circle_at_50%_12%,color-mix(in_srgb,var(--brand)_14%,transparent),transparent_38%)]" />
        <div className="relative z-10 w-full max-w-[500px] rounded-[40px] border border-[rgba(0,0,0,.08)] bg-[rgba(255,255,255,.65)] p-[72px] shadow-[0_20px_80px_rgba(0,0,0,.06)] backdrop-blur-[24px] dark:border-white/10 dark:bg-[rgba(12,13,15,0.72)] dark:shadow-none dark:backdrop-blur-2xl">
          <div className="text-center">
            <div className="serif text-4xl tracking-tight text-ink dark:text-white">Convoke.</div>
            <div className="mt-3 text-[15px] leading-6 text-g6 dark:text-white/68">For people building the future.</div>
          </div>

          {message ? (
            <div className="mt-6 rounded-[18px] border border-[rgba(0,0,0,.08)] bg-[rgba(255,255,255,.55)] p-4 text-center text-[13px] leading-6 text-g6 dark:border-white/10 dark:bg-[rgba(12,13,15,0.72)] dark:text-white/68">
              {message}
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3">
            {oauthDoors.map((door) => {
              const Icon = door.icon;
              return (
                <button
                  key={door.strategy}
                  type="button"
                  onClick={() => handleOAuth(door.strategy)}
                  disabled={Boolean(loadingStrategy) || emailLoading}
                  className="group flex h-12 w-full items-center justify-between rounded-full border border-[rgba(0,0,0,.12)] bg-white px-4 text-[14px] font-medium text-ink transition-all hover:-translate-y-0.5 hover:bg-[#faf8f5] disabled:cursor-wait disabled:opacity-80 dark:border-white/10 dark:bg-black/65 dark:text-white dark:hover:bg-black/78"
                >
                  <span className="flex items-center gap-3">
                    <Icon size={15} className="text-g5 dark:text-white/75" />
                    <span>{door.label}</span>
                  </span>
                  {loadingStrategy === door.strategy ? (
                    <Loader2 size={16} className="animate-spin text-brand" />
                  ) : (
                    <ArrowRight size={15} className="text-g4 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-brand dark:text-white/55" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-[rgba(0,0,0,.08)] dark:bg-g3" />
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-g5 dark:text-white/55">or</div>
            <div className="h-px flex-1 bg-[rgba(0,0,0,.08)] dark:bg-g3" />
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-medium text-ink dark:text-white">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="h-12 w-full rounded-full border border-[#CFC8BF] bg-white px-4 text-[14px] text-ink outline-none focus:border-brand focus:ring-0 dark:border-g3 dark:bg-transparent dark:text-white"
            />
            <button
              type="button"
              onClick={continueWithEmail}
              disabled={emailLoading || Boolean(loadingStrategy)}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black px-5 text-[14px] font-medium text-white shadow-[0_10px_30px_rgba(0,0,0,.12)] transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-black"
            >
              <span>Continue</span>
              {emailLoading ? <Loader2 size={15} className="animate-spin" /> : null}
            </button>
          </div>

          <p className="mt-7 text-center text-[11px] leading-relaxed text-g5 dark:text-white/55">
            By continuing, you agree to{" "}
            <Link href="/terms" className="font-medium text-ink hover:text-brand dark:text-white dark:hover:text-brand">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-medium text-ink hover:text-brand dark:text-white dark:hover:text-brand">
              Privacy
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
