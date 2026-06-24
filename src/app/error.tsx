"use client";

import { useEffect } from "react";
import { Shell } from "@/components/Shell";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Shell>
      <div className="flex h-[70vh] flex-col items-center justify-center px-5 sm:px-8">
        <div className="max-w-[420px] text-center">
          <div className="eyebrow mb-4 text-destructive">System Error</div>
          <h1 className="serif text-5xl md:text-6xl mb-4">Connection lost.</h1>
          <p className="text-g5 mb-8 text-[15px]">
            We&apos;re unable to retrieve this data right now. The error has been logged securely.
          </p>
          <button
            onClick={() => reset()}
            className="bg-ink text-paper px-6 py-3 text-[14px] hover:bg-ink-2 transition-colors"
          >
            Retry request
          </button>
        </div>
      </div>
    </Shell>
  );
}
