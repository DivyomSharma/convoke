import Link from "next/link";
import { SiteHeader } from "@/components/marketing/site-header";
import { Footer } from "@/components/marketing/footer";
import { getAuthenticatedDbUser } from "@/lib/viewer";
import { redirect } from "next/navigation";
import { ProfileBuilder } from "@/components/workspace/profile-builder";

export default async function ProfileEditorPage() {
  const user = await getAuthenticatedDbUser();
  
  if (!user) {
    redirect("/auth/sign-in");
  }

  // experience and socials are stored as Json? in prisma
  // Parse if necessary, or Prisma returns them as objects if Json type
  const experience = user.experience ? (user.experience as any) : [];
  const socials = user.socials ? (user.socials as any) : [];

  const initialData = {
    bio: user.bio,
    skills: user.skills,
    experience,
    socials,
  };

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <Link href="/workspace" className="text-sm text-bronze hover:underline">← Back to Workspace</Link>
              <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em]">Portfolio Builder</h1>
              <p className="mt-2 text-muted">Curate your public presence. Share your journey with the world.</p>
            </div>
            <Link href={`/u/${user.username}`} target="_blank" className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium hover:bg-white/20">
              View Public Profile
            </Link>
          </div>

          <div className="rounded-2xl border border-line bg-black/20 p-6 md:p-8">
            <ProfileBuilder initialData={initialData} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
