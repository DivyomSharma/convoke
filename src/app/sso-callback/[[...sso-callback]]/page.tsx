"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper text-ink">
      <div className="text-center">
        <div className="serif text-2xl mb-4 text-[var(--brand)] animate-pulse">
          Connecting to Convoke...
        </div>
        <p className="text-sm text-g5 mb-6">Please wait while we secure your connection.</p>
        <AuthenticateWithRedirectCallback />
      </div>
    </div>
  );
}
