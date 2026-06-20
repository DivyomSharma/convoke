"use client";

import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* LEFT: Photography Section */}
      <div className="hidden lg:flex flex-1 relative bg-muted items-end p-12 overflow-hidden">
        {/* Placeholder for realistic photography */}
        <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800">
          <div className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')" }} />
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
        <div className="w-full max-w-[400px] space-y-8 flex flex-col items-center">
          <div className="flex flex-col space-y-2 text-center w-full">
            <span className="font-serif text-4xl tracking-tight mb-2 text-ink">Convoke.</span>
            <p className="text-sm text-g5 mb-6">
              Build your future together.
            </p>
          </div>

          <SignIn 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none bg-transparent p-0 w-full rounded-none m-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                dividerRow: "my-6",
                dividerLine: "bg-g3",
                dividerText: "text-xs uppercase bg-background px-2 text-g5 font-mono",
                socialButtonsBlockButton: "w-full rounded-full h-12 shadow-sm font-medium border border-g3 text-ink bg-transparent hover:bg-g1 transition-colors justify-center px-4",
                socialButtonsBlockButtonText: "font-medium font-sans text-[14px]",
                socialButtonsBlockButtonArrow: "hidden",
                formFieldInput: "flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink",
                formFieldLabel: "text-ink font-medium text-sm mb-1.5",
                formButtonPrimary: "w-full rounded-full h-12 bg-ink text-paper hover:bg-ink-2 font-medium shadow-none transition-colors",
                footerAction: "hidden",
                identityPreviewEditButtonIcon: "text-ink",
                formFieldAction: "text-ink hover:text-ink-2",
                identityPreviewText: "text-ink font-medium",
                identityPreview: "border border-g3 bg-g1 rounded-md p-3",
              }
            }}
          />
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
