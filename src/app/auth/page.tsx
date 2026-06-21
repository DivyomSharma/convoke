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
  const { signIn, fetchStatus } = useSignIn();
  const [loadingStrategy, setLoadingStrategy] = useState<OAuthStrategy | null>(null);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"email" | "code">("email");
  const [emailLoading, setEmailLoading] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);

  const handleOAuth = async (strategy: OAuthStrategy) => {
    if (loadingStrategy || !signIn || fetchStatus === "fetching") return;
    setError("");
    setLoadingStrategy(strategy);
    try {
      const result = await signIn.sso({
        strategy,
        redirectUrl: "/auth-complete",
        redirectCallbackUrl: "/sso-callback",
      });
      if (result?.error) throw result.error;
    } catch (err) {
      setError(err instanceof Error ? err.message : "That continue door did not open. Try again.");
      setLoadingStrategy(null);
    }
  };

  const sendEmailCode = async () => {
    if (!signIn || !email.trim()) return;
    setEmailLoading(true);
    setError("");
    try {
      const result = await signIn.create({
        identifier: email.trim(),
        signUpIfMissing: true,
        actionCompleteRedirectUrl: "/auth-complete",
      });
      if (result.error) throw result.error;
      const sent = await signIn.emailCode.sendCode({ emailAddress: email.trim() });
      if (sent.error) throw sent.error;
      setStep("code");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to continue with email right now.");
    } finally {
      setEmailLoading(false);
    }
  };

  const verifyEmailCode = async () => {
    if (!signIn || !code.trim()) return;
    setCodeLoading(true);
    setError("");
    try {
      const result = await signIn.emailCode.verifyCode({ code: code.trim() });
      if (result.error) throw result.error;
      await signIn.finalize();
      router.push("/auth-complete");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "That code did not work. Try again.");
    } finally {
      setCodeLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-paper lg:grid-cols-[1.02fr_0.98fr]">
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
              One path in. No sign-up split. No sign-in split. Just continue.
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
        <div className="premium-card relative z-10 w-full max-w-[480px] p-7 sm:p-9">
          <div className="text-center">
            <div className="serif text-4xl tracking-tight text-ink">Convoke.</div>
            <div className="mt-3 text-[15px] leading-6 text-g6">For people building the future.</div>
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
            <label className="block text-xs font-medium text-ink">Continue with email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="h-12 w-full rounded-full border border-g3 bg-transparent px-4 text-[14px] text-ink outline-none focus:border-brand/55"
            />
            {step === "code" ? (
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="6-digit code"
                className="h-12 w-full rounded-full border border-g3 bg-transparent px-4 text-[14px] text-ink outline-none focus:border-brand/55"
              />
            ) : null}
            <button
              type="button"
              onClick={step === "email" ? sendEmailCode : verifyEmailCode}
              disabled={step === "email" ? emailLoading : codeLoading}
              className="ink-button h-12 w-full px-5 text-[14px]"
            >
              <span>{step === "email" ? "Continue" : "Verify and continue"}</span>
              {step === "email" && emailLoading ? <Loader2 size={15} className="animate-spin" /> : null}
              {step === "code" && codeLoading ? <Loader2 size={15} className="animate-spin" /> : null}
            </button>
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
