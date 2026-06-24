"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";

export function OnboardingPrompt() {
  const [dismissed, setDismissed] = useState(false);
  const pathname = usePathname();
  if (dismissed || pathname?.startsWith("/onboarding")) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className="relative flex w-[320px] flex-col overflow-hidden rounded-[24px] border border-[var(--brand)]/20 bg-paper p-5 shadow-2xl">
        <button
          onClick={() => setDismissed(true)}
          className="absolute right-4 top-4 text-g4 transition-colors hover:text-ink"
        >
          <X size={16} />
        </button>
        <div className="mb-1 mono text-[10px] uppercase tracking-wider text-[var(--brand)]">Action Required</div>
        <div className="serif text-xl text-ink">Complete your profile.</div>
        <p className="mt-2 text-[13px] leading-relaxed text-g6">
          Set up your passport and identity to unlock all ecosystem features.
        </p>
        <div className="mt-4">
          <Link
            href="/onboarding"
            className="flex items-center justify-between rounded-full bg-ink px-4 py-2.5 text-[13px] font-medium text-paper transition-transform hover:-translate-y-0.5"
          >
            <span>Finish Setup</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
