"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { ArrowRight, Code2, Loader2, Mail, MessageSquare, Search } from "lucide-react";

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
      const result = await signIn.emailLink.sendLink({
        emailAddress: identifier,
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
    <main className="grid min-h-screen bg-paper lg:grid-cols-[1.02fr_0.98fr]">
      <section className="relative hidden overflow-hidden border-r border-g3 lg:flex">
        <div className="absolute inset-0 bg-[#070707]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_35%,rgba(0,178,255,0.18),transparent_34%),radial-gradient(circle_at_75%_80%,rgba(127,29,45,0.22),transparent_30%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_52%,rgba(0,0,0,0.8)_100%)]" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
          <div className="serif text-3xl tracking-tight">C.</div>
          <div className="max-w-[35rem]">
            <div className="mono mb-5 text-[11px] uppercase tracking-[0.24em] text-white/55">
              Secure ecosystem access
            </div>
            <h1 className="serif text-[clamp(4.2rem,7vw,7.1rem)] leading-[0.92] tracking-[-0.055em]">
              Convoke.
            </h1>
            <p className="mt-6 max-w-[30rem] text-[16px] leading-8 text-white/68">
              For people building the future.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              ["Unified", "One path for every return visit"],
              ["Invisible", "No sign in vs sign up split"],
              ["Native", "Feels like the product, not a vendor"],
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
            {oauthDoors.map((door) => {
              const Icon = door.icon;
              return (
                <button
                  key={door.strategy}
                  type="button"
                  onClick={() => handleOAuth(door.strategy)}
                  disabled={Boolean(loadingStrategy) || emailLoading}
                  className="group flex h-12 w-full items-center justify-between rounded-full border border-white/10 bg-black/65 px-4 text-[14px] font-medium text-white transition-all hover:-translate-y-0.5 hover:border-brand/35 hover:bg-black/78 disabled:cursor-wait disabled:opacity-80"
                >
                  <span className="flex items-center gap-3">
                    <Icon size={15} className="text-white/75" />
                    <span>{door.label}</span>
                  </span>
                  {loadingStrategy === door.strategy ? (
                    <Loader2 size={16} className="animate-spin text-brand" />
                  ) : (
                    <ArrowRight size={15} className="text-white/55 transition-colors group-hover:text-brand" />
                  )}
                </button>
              );
            })}
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
              <span className="flex items-center gap-2">
                <Mail size={14} />
                Continue
              </span>
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
