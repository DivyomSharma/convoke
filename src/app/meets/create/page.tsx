import { Shell } from "@/components/Shell";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Create Event | Convoke",
};

export default async function CreateMeetPage() {
  const dbUser = await requireUser();

  const memberships = await prisma.membership.findMany({
    where: { 
      userId: dbUser.id,
      role: { in: ["ADMIN", "FOUNDER"] }
    },
    include: {
      organization: true
    }
  });

  const hasAdminRights = memberships.length > 0;

  if (!hasAdminRights) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-5 text-center">
          <div className="w-16 h-16 rounded-full bg-g1 flex items-center justify-center mb-6">
            <ShieldAlert size={32} className="text-g4" />
          </div>
          <h1 className="serif text-4xl text-ink mb-3">Restricted Access</h1>
          <p className="text-[15px] text-g5 max-w-[40ch] leading-relaxed mb-8">
            You must be an administrator or founder of an organization to host events on Convoke. 
          </p>
          <div className="flex gap-4">
            <Link href="/workspace" className="ink-button px-6 py-2.5 rounded-full text-[13px] font-medium">
              Return to Workspace
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  // If they have admin rights, they can create an event. For now, it's a placeholder.
  return (
    <Shell wide>
      <div className="max-w-[800px] mx-auto px-5 sm:px-8 py-16">
        <Link href="/workspace" className="inline-flex items-center gap-2 text-[13px] text-g5 hover:text-ink transition-colors mb-8">
          <ArrowLeft size={14} /> Back
        </Link>
        <div className="eyebrow mb-2">Host a Meet</div>
        <h1 className="serif text-5xl text-ink mb-10">Create Event</h1>
        
        <div className="p-8 border border-g3 rounded-xl bg-g1/30 text-center">
          <div className="text-[15px] text-g6 mb-4">Event creation wizard is currently being upgraded.</div>
          <p className="text-[13px] text-g5">Your permissions are verified. Please check back shortly to draft your event.</p>
        </div>
      </div>
    </Shell>
  );
}
