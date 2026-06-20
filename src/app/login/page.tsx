"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleOAuth = async (provider: "google" | "discord" | "apple" | "linkedin_oidc") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) {
      alert(error.message);
    } else {
      alert("Check your email for the login link!");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* LEFT: Photography Section */}
      <div className="hidden lg:flex flex-1 relative bg-muted items-end p-12 overflow-hidden">
        {/* Placeholder for realistic photography. In a real app, use an optimized Image component */}
        <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800">
          <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />
        </div>
        
        <div className="relative z-10 text-white mix-blend-difference">
          <blockquote className="space-y-2">
            <p className="text-3xl font-serif leading-tight">
              &ldquo;The best way to predict the future is to invent it together.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>

      {/* RIGHT: Auth Card Section */}
      <div className="flex flex-1 flex-col justify-center items-center p-8 bg-background relative">
        <div className="w-full max-w-[380px] space-y-8">
          <div className="flex flex-col space-y-2 text-center">
            <span className="font-serif text-4xl tracking-tight mb-2 text-ink">Convoke.</span>
            <p className="text-sm text-g5">
              Build your future together.
            </p>
          </div>

          <div className="space-y-4">
            {/* OAuth Buttons */}
            <div className="flex flex-col gap-3">
              <Button 
                variant="outline" 
                onClick={() => handleOAuth("google")}
                className="w-full rounded-full h-12 shadow-sm font-medium border-g3 text-ink hover:bg-g1"
              >
                Continue with Google
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleOAuth("apple")}
                className="w-full rounded-full h-12 shadow-sm font-medium border-g3 text-ink hover:bg-g1"
              >
                Continue with Apple
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleOAuth("linkedin_oidc")}
                className="w-full rounded-full h-12 shadow-sm font-medium border-g3 text-ink hover:bg-g1"
              >
                Continue with LinkedIn
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleOAuth("discord")}
                className="w-full rounded-full h-12 shadow-sm font-medium text-white bg-[#5865F2] hover:bg-[#4752C4] border-transparent"
              >
                Continue with Discord
              </Button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-g3" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-g5">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Email Form */}
            <form className="space-y-4" onSubmit={handleEmailLogin}>
              <div className="space-y-2">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 text-ink"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full rounded-full h-12 bg-ink text-paper hover:bg-ink-2 font-medium">
                {loading ? "Sending link..." : "Continue"}
              </Button>
            </form>
          </div>
        </div>

        <p className="absolute bottom-8 px-8 text-center text-sm text-g5 max-w-[380px]">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-4 hover:text-ink text-g6 font-medium">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-ink text-g6 font-medium">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
