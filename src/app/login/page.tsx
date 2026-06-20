"use client";

import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen bg-paper lg:grid-cols-[1.1fr_0.9fr]">
      <section className="relative hidden overflow-hidden border-r border-g3 lg:flex">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,161,109,0.18),transparent_34%),radial-gradient(circle_at_80%_22%,rgba(117,184,203,0.08),transparent_26%),linear-gradient(180deg,#0c0c0c_0%,#111111_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.03),transparent_55%)]" />

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
              <div key={title} className="rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
                <div className="mono text-[11px] uppercase tracking-[0.18em] text-[var(--brand-2)]">{title}</div>
                <div className="mt-3 text-[13px] leading-6 text-white/68">{copy}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative flex items-center justify-center px-6 py-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,161,109,0.12),transparent_34%)]" />
        <div className="premium-card campus-frame relative z-10 w-full max-w-[440px] p-7 md:p-9">
          <div className="text-center">
            <span className="serif text-4xl tracking-tight text-ink">Convoke.</span>
            <p className="mt-3 text-sm text-g5">
              Sign in to build your profile, join communities, and move through the ecosystem.
            </p>
          </div>

          <div className="mt-8">
            <SignIn
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-none bg-transparent p-0 w-full rounded-none m-0",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  dividerRow: "my-6",
                  dividerLine: "bg-[color:var(--g3)]",
                  dividerText: "text-xs uppercase bg-transparent px-2 text-g5 font-mono tracking-[0.18em]",
                  socialButtonsBlockButton: "w-full rounded-full min-h-12 font-medium border border-g3 text-ink bg-g1/65 hover:bg-g2 transition-colors justify-center px-4 shadow-none",
                  socialButtonsBlockButtonText: "font-medium font-sans text-[14px]",
                  socialButtonsBlockButtonArrow: "hidden",
                  formFieldInput: "flex h-12 w-full rounded-2xl border border-g3 bg-transparent px-4 text-sm text-ink shadow-none transition-colors focus-visible:outline-none",
                  formFieldLabel: "text-ink font-medium text-sm mb-1.5",
                  formButtonPrimary: "w-full rounded-full h-12 bg-ink text-paper hover:opacity-95 font-medium shadow-none transition-all",
                  footerAction: "hidden",
                  identityPreviewEditButtonIcon: "text-ink",
                  formFieldAction: "text-[var(--brand)] hover:text-ink",
                  identityPreviewText: "text-ink font-medium",
                  identityPreview: "border border-g3 bg-g1/50 rounded-2xl p-3",
                },
              }}
            />
          </div>

          <p className="mt-8 text-center text-[13px] leading-6 text-g5">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="font-medium text-ink hover:text-[var(--brand)]">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-medium text-ink hover:text-[var(--brand)]">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
