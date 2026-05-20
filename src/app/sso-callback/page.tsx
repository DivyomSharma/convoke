import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SsoCallbackPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <p className="text-sm text-muted">Completing sign-in...</p>
        <AuthenticateWithRedirectCallback signUpForceRedirectUrl="/workspace" />
      </div>
    </div>
  );
}
