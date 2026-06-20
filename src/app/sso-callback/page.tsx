import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center">
      <div className="text-g5 text-sm">Authenticating...</div>
      <AuthenticateWithRedirectCallback signUpForceRedirectUrl="/workspace" />
    </div>
  );
}
