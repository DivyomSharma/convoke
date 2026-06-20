"use client";

import { useState } from "react";
import Link from "next/link";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Mail, Lock, User as UserIcon } from "lucide-react";

export default function LoginPage() {
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();
  const router = useRouter();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn || loading) return;

    setLoading(true);
    setError("");

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.error) {
        const message = result.error.longMessage 
          || result.error.message 
          || "Failed to sign in. Please check your credentials.";
        setError(message);
      } else if (signIn.status === "complete") {
        const finalizeRes = await signIn.finalize();
        if (finalizeRes.error) {
          setError(finalizeRes.error.message || "Failed to finalize session.");
        } else {
          router.push("/workspace");
        }
      } else {
        // Needs additional verification (e.g. 2FA)
        console.log("Sign-in status:", signIn.status);
        setError("Additional verification required. Please check your email or authenticator app.");
      }
    } catch (err: any) {
      console.error("Sign-in error:", err);
      const message = err?.errors?.[0]?.longMessage 
        || err?.errors?.[0]?.message 
        || err?.message 
        || "Failed to sign in. Please check your credentials.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp || loading) return;

    setLoading(true);
    setError("");

    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
        firstName: name.split(" ")[0] || "User",
        lastName: name.split(" ").slice(1).join(" ") || "",
      });

      if (result.error) {
        const message = result.error.longMessage 
          || result.error.message 
          || "Failed to create account. Try a different email or stronger password.";
        setError(message);
      } else if (signUp.status === "complete") {
        const finalizeRes = await signUp.finalize();
        if (finalizeRes.error) {
          setError(finalizeRes.error.message || "Failed to finalize session.");
        } else {
          router.push("/workspace");
        }
      } else {
        // Needs email verification or additional steps
        console.log("Sign-up status:", signUp.status);
        setError("Account created. Please check your inbox to verify your email address.");
      }
    } catch (err: any) {
      console.error("Sign-up error:", err);
      const message = err?.errors?.[0]?.longMessage 
        || err?.errors?.[0]?.message 
        || err?.message 
        || "Failed to create account. Try a different email or stronger password.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple" | "oauth_discord") => {
    if (!signIn) return;

    try {
      const result = await signIn.sso({
        strategy,
        redirectUrl: "/sso-callback",
        redirectCallbackUrl: "/workspace",
      });

      if (result.error) {
        const message = result.error.longMessage 
          || result.error.message 
          || "Social authentication failed to initialize.";
        setError(message);
      }
    } catch (err: any) {
      console.error("Social auth error:", err);
      const message = err?.errors?.[0]?.longMessage 
        || err?.errors?.[0]?.message 
        || err?.message 
        || "Social authentication failed to initialize.";
      setError(message);
    }
  };

  return (
    <div className="grid min-h-screen bg-paper lg:grid-cols-[1.1fr_0.9fr]">
      {/* Editorial side */}
      <section className="relative hidden overflow-hidden border-r border-g3 lg:flex">
        <div className="absolute inset-0 bg-[#0c0c0c]" />

        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-[#f4ede4]">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 mono text-[11px] uppercase tracking-[0.18em] text-white/72">
            Midnight campus
          </div>

          <div className="max-w-[34rem]">
            <h1 className="serif text-6xl leading-[0.94] tracking-tight">
              The network ambitious people open when they want to move.
            </h1>
            <p className="mt-6 max-w-[28rem] text-[16px] leading-8 text-white/68">
              Discover rooms worth entering, people worth meeting, and opportunities worth acting on. Calm, sharp, and built for builders.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              ["Events", "From workshops to founder circles"],
              ["Opportunities", "Roles, grants, internships, collabs"],
              ["Identity", "Profiles built on work and reputation"],
            ].map(([title, copy]) => (
              <div key={title} className="rounded-md border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <div className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--brand)]">{title}</div>
                <div className="mt-3 text-[13px] leading-6 text-white/68">{copy}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Auth Form side */}
      <section className="relative flex items-center justify-center px-6 py-12">
        <div className="premium-card relative z-10 w-full max-w-[420px] p-8 md:p-10">
          <div className="text-center">
            <span className="serif text-4xl tracking-tight text-ink">Convoke.</span>
            <p className="mt-3 text-sm text-g5">
              {mode === "signin" 
                ? "Sign in to build your profile, join communities, and move." 
                : "Create your campus builder passport to get started."}
            </p>
          </div>

          {error && (
            <div className="mt-6 p-4 rounded-md bg-red-500/10 border border-red-500/20 text-red-500 text-[13px] text-center">
              {error}
            </div>
          )}

          {/* Social Logins */}
          <div className="mt-8 space-y-3">
            <button 
              onClick={() => handleSocialAuth("oauth_google")}
              disabled={!signIn}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-full border border-g3 bg-g1/50 hover:bg-g2 text-ink text-[14px] font-medium transition-all active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.62-.63-1.01-1.44-1.21-2.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button 
              onClick={() => handleSocialAuth("oauth_discord")}
              disabled={!signIn}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-full border border-g3 bg-g1/50 hover:bg-g2 text-ink text-[14px] font-medium transition-all active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 shrink-0 fill-current text-[#5865F2]" viewBox="0 0 127.14 96.36">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c.9-.65,1.76-1.34,2.58-2.06a75.48,75.48,0,0,0,72.84,0c.82.72,1.68,1.41,2.58,2.06a68.43,68.43,0,0,1-10.5,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31-18.83C129,54.65,123.48,31.58,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z" />
              </svg>
              <span>Continue with Discord</span>
            </button>
          </div>

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-g3" /></div>
            <span className="relative px-3 bg-paper-card text-[11px] mono text-g4 uppercase">or email</span>
          </div>

          {/* Email Auth Form */}
          <form onSubmit={mode === "signin" ? handleEmailSignIn : handleEmailSignUp} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-ink font-medium text-sm mb-1.5 block">Full Name</label>
                <div className="relative">
                  <UserIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-g4" />
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ananya Rao"
                    className="w-full h-12 pl-11 pr-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)] transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-ink font-medium text-sm mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-g4" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full h-12 pl-11 pr-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-ink font-medium text-sm mb-1.5 block">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-g4" />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 pl-11 pr-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)] transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-ink hover:opacity-95 text-paper font-medium transition-all active:scale-98 flex items-center justify-center gap-2 border border-[var(--brand)]/20 mt-6 cursor-pointer"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              <span>{mode === "signin" ? "Sign In" : "Create Passport"}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Toggle mode */}
          <div className="mt-8 text-center text-[13px] text-g5">
            {mode === "signin" ? (
              <span>
                New to Convoke?{" "}
                <button onClick={() => { setMode("signup"); setError(""); }} className="font-semibold text-ink hover:text-[var(--brand)] hover:underline cursor-pointer">
                  Create a passport
                </button>
              </span>
            ) : (
              <span>
                Already have a passport?{" "}
                <button onClick={() => { setMode("signin"); setError(""); }} className="font-semibold text-ink hover:text-[var(--brand)] hover:underline cursor-pointer">
                  Sign in here
                </button>
              </span>
            )}
          </div>

          <p className="mt-8 text-center text-[11px] leading-relaxed text-g4">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="font-medium text-ink hover:text-[var(--brand)] hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-medium text-ink hover:text-[var(--brand)] hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
