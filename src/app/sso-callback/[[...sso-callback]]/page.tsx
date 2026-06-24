"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { ConvokeLoader } from "@/components/ui/convoke-loader";

export default function SSOCallbackPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-6 animate-in fade-in duration-500">
        <ConvokeLoader size={128} className="text-white" />
        <p className="text-g5 mono text-[12px] uppercase tracking-widest">Authenticating session...</p>
      </div>
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
