"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-paper text-ink min-h-screen flex items-center justify-center p-5">
        <div className="max-w-[420px] text-center">
          <div className="font-mono text-[11px] tracking-widest uppercase text-g5 mb-4">Fatal Error</div>
          <h1 className="font-serif text-5xl mb-4">System failure.</h1>
          <p className="text-g5 mb-8 text-[15px]">
            A critical error occurred preventing the application from loading.
          </p>
          <button
            onClick={() => reset()}
            className="bg-ink text-paper px-6 py-3 text-[14px] hover:opacity-90 transition-opacity"
          >
            Reload application
          </button>
        </div>
      </body>
    </html>
  );
}
