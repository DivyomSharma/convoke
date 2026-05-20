// SSO callback page — no longer needed with Supabase Auth
// Supabase handles OAuth redirects natively via the redirect URL config
export default function SsoCallbackPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <p className="text-sm text-muted">Completing sign-in...</p>
    </div>
  );
}
