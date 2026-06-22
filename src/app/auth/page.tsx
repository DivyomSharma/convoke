"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { useTheme } from "next-themes";
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
  const { resolvedTheme } = useTheme();
  const [loadingStrategy, setLoadingStrategy] = useState<OAuthStrategy | null>(null);
  const [email, setEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

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
    <main className={`grid min-h-screen lg:grid-cols-[1.02fr_0.98fr] ${isDark ? "bg-[#000000]" : "bg-[#F7F4EF]"}`}>
      <section
        className={`relative hidden overflow-hidden lg:flex ${
          isDark ? "border-r border-g3 bg-[#000000]" : "border-r border-[rgba(17,17,17,0.08)] bg-[#F7F4EF]"
        }`}
      >
        <div
          className="absolute inset-0"
          style={{
            background: isDark
              ? "radial-gradient(circle at 30% 35%, rgba(0,178,255,0.18), transparent 34%), radial-gradient(circle at 75% 80%, rgba(127,29,45,0.22), transparent 30%)"
              : "radial-gradient(circle at 20% 24%, rgba(0,178,255,0.10), transparent 28%), radial-gradient(circle at 76% 80%, rgba(123,0,20,0.08), transparent 24%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: isDark
              ? "radial-gradient(circle at 50% 50%, transparent 52%, rgba(0,0,0,0.8) 100%)"
              : "radial-gradient(ellipse at center, rgba(255,255,255,.92) 0%, rgba(247,244,239,.98) 60%, #F7F4EF 100%)",
          }}
        />

        <div className={`relative z-10 flex h-full flex-col justify-start p-10 xl:p-12 ${isDark ? "text-[#F5F5F2]" : "text-[#111111]"}`}>
          <div className="max-w-[35rem] pt-6">
            <div className={`mono mb-5 text-[11px] uppercase tracking-[0.24em] ${isDark ? "text-white/55" : "text-[rgba(17,17,17,0.66)]"}`}>
              Secure ecosystem access
            </div>
            <h1 className="serif text-[clamp(4.2rem,7vw,7.1rem)] leading-[0.92] tracking-[-0.055em]">
              Convoke.
            </h1>
            <p className={`mt-6 max-w-[30rem] text-[16px] leading-8 ${isDark ? "text-white/68" : "text-[rgba(17,17,17,0.82)]"}`}>
              For people building the future.
            </p>
          </div>
        </div>
      </section>

      <section className={`relative flex items-center justify-center px-6 py-12 ${isDark ? "bg-[#000000]" : "bg-[#F7F4EF]"}`}>
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: isDark
              ? "radial-gradient(circle at 50% 12%, rgba(0,178,255,0.12), transparent 38%)"
              : "radial-gradient(ellipse at center, rgba(255,255,255,.92) 0%, rgba(247,244,239,.98) 60%, #F7F4EF 100%)",
          }}
        />

        <div
          className={`relative z-10 w-full max-w-[520px] rounded-[40px] p-[72px] ${
            isDark
              ? "border border-white/10 bg-[rgba(12,13,15,0.72)] text-[#F5F5F2] backdrop-blur-2xl"
              : "border border-[rgba(0,0,0,.08)] bg-[rgba(255,255,255,.65)] text-[#111111] shadow-[0_20px_80px_rgba(0,0,0,.06)] backdrop-blur-[24px]"
          }`}
        >
          <div className="text-center">
            <div className="serif text-4xl tracking-tight">Convoke.</div>
            <div className={`mt-3 text-[15px] leading-6 ${isDark ? "text-white/68" : "text-[rgba(17,17,17,0.82)]"}`}>
              For people building the future.
            </div>
          </div>

          {message ? (
            <div
              className={`mt-6 rounded-[18px] p-4 text-center text-[13px] leading-6 ${
                isDark
                  ? "border border-white/10 bg-[rgba(12,13,15,0.72)] text-white/68"
                  : "border border-[rgba(0,0,0,.08)] bg-[rgba(255,255,255,.55)] text-[rgba(17,17,17,0.82)]"
              }`}
            >
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
                  className={`group flex h-12 w-full items-center justify-between rounded-full px-4 text-[14px] font-medium transition-all hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-80 ${
                    isDark
                      ? "border border-white/10 bg-black/65 text-white hover:bg-black/78"
                      : "border border-[rgba(0,0,0,.12)] bg-white text-[#111111] hover:bg-[#faf8f5]"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={15} className={isDark ? "text-white/75" : "text-[rgba(17,17,17,0.66)]"} />
                    <span>{door.label}</span>
                  </span>
                  {loadingStrategy === door.strategy ? (
                    <Loader2 size={16} className="animate-spin text-brand" />
                  ) : (
                    <ArrowRight
                      size={15}
                      className={`transition-transform duration-200 group-hover:translate-x-1 ${isDark ? "text-white/55 group-hover:text-brand" : "text-[rgba(17,17,17,0.34)] group-hover:text-brand"}`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="my-6 flex items-center gap-4">
            <div className={`h-px flex-1 ${isDark ? "bg-g3" : "bg-[rgba(0,0,0,.08)]"}`} />
            <div className={`mono text-[10px] uppercase tracking-[0.2em] ${isDark ? "text-white/55" : "text-[rgba(17,17,17,0.66)]"}`}>or</div>
            <div className={`h-px flex-1 ${isDark ? "bg-g3" : "bg-[rgba(0,0,0,.08)]"}`} />
          </div>

          <div className="space-y-3">
            <label className={`block text-xs font-medium ${isDark ? "text-white" : "text-[#111111]"}`}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className={`h-12 w-full rounded-full px-4 text-[14px] outline-none focus:border-brand focus:ring-0 ${
                isDark ? "border border-g3 bg-transparent text-white" : "border border-[#CFC8BF] bg-white text-[#111111]"
              }`}
            />
            <button
              type="button"
              onClick={continueWithEmail}
              disabled={emailLoading || Boolean(loadingStrategy)}
              className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-[14px] font-medium transition-transform hover:-translate-y-0.5 ${
                isDark ? "bg-white text-black" : "bg-black text-white shadow-[0_10px_30px_rgba(0,0,0,.12)]"
              }`}
            >
              <span>Continue</span>
              {emailLoading ? <Loader2 size={15} className="animate-spin" /> : null}
            </button>
          </div>

          <p className={`mt-7 text-center text-[11px] leading-relaxed ${isDark ? "text-white/55" : "text-[rgba(17,17,17,0.66)]"}`}>
            By continuing, you agree to{" "}
            <Link href="/terms" className={`font-medium hover:text-brand ${isDark ? "text-white" : "text-[#111111]"}`}>
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className={`font-medium hover:text-brand ${isDark ? "text-white" : "text-[#111111]"}`}>
              Privacy
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
