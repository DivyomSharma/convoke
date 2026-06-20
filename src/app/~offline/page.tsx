import { Shell } from "@/components/Shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline",
};

export default function Offline() {
  return (
    <Shell>
      <div className="flex h-[70vh] flex-col items-center justify-center px-5 sm:px-8 text-center">
        <div className="max-w-[420px]">
          <div className="eyebrow mb-4 text-g5">Network Disconnected</div>
          <h1 className="serif text-5xl md:text-6xl mb-4">You're offline.</h1>
          <p className="text-g5 mb-8 text-[15px]">
            Please check your connection. Convoke requires network access to sync your timeline and messages.
          </p>
        </div>
      </div>
    </Shell>
  );
}
