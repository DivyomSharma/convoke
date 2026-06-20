"use client";

import Link from "next/link";
import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      {/* LEFT: Photography Section */}
      <div className="hidden lg:flex flex-1 relative bg-muted items-end p-12 overflow-hidden">
        {/* Placeholder for realistic photography. In a real app, use an optimized Image component */}
        <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800">
          {/* A subtle image could be placed here with object-cover */}
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
        <SignIn 
          appearance={{
            elements: {
              rootBox: "w-full max-w-[380px]",
              card: "bg-transparent shadow-none border-0 p-0 w-full",
              headerTitle: "font-serif text-4xl tracking-tight mb-2 text-ink text-center",
              headerSubtitle: "text-sm text-g5 text-center hidden", // We'll add our own subtitle below if needed, or let clerk use its default
              socialButtonsBlockButton: "rounded-full h-12 shadow-sm font-medium border border-input text-ink hover:bg-g1 w-full justify-center text-[14px]",
              socialButtonsProviderIcon: "w-5 h-5",
              dividerLine: "bg-g3",
              dividerText: "bg-background px-2 text-g5 uppercase text-xs",
              formFieldInput: "flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring text-ink",
              formFieldLabel: "text-ink text-[13px] font-medium",
              formButtonPrimary: "w-full rounded-full h-12 bg-ink text-paper hover:bg-ink-2 shadow-none font-medium mt-2",
              footerActionText: "text-sm text-g5",
              footerActionLink: "underline underline-offset-4 hover:text-ink text-g6 font-medium",
              identityPreviewText: "text-ink",
              identityPreviewEditButton: "text-g5 hover:text-ink",
              formFieldSuccessText: "text-ink",
            }
          }}
          routing="hash"
        />
        
        <p className="absolute bottom-8 px-8 text-center text-sm text-muted-foreground max-w-[380px]">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
