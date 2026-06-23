import { Shell } from "@/components/Shell";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ShieldAlert, ArrowLeft, X, Calendar } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Create Meet | Convoke",
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
            You must be an administrator or founder of an organization to host meets on Convoke. 
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

  // If they have admin rights, they can create a meet. For now, it's a placeholder.
  return (
    <Shell wide>
      <div className="min-h-[80vh] flex items-center justify-center p-4 py-12">
        <div className="flex w-full max-w-[860px] flex-col overflow-hidden rounded-[34px] border border-g3 bg-paper-elevated shadow-[0_40px_140px_rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between px-6 py-5 border-b border-g3/60">
            <div>
              <div className="eyebrow text-[var(--brand)]">Creation Studio</div>
              <h2 className="serif mt-1 text-3xl text-ink">Host a Meet</h2>
              <p className="text-xs text-g5 mt-1">Publish a conference, meetup, gathering, seminar, or workshop.</p>
            </div>
            <Link 
              href="/workspace"
              className="p-2 rounded-full hover:bg-g1/80 text-g5 hover:text-ink transition-colors cursor-pointer"
            >
              <X size={18} />
            </Link>
          </div>
          
          <div className="flex flex-col flex-1 p-16 text-center items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-g1 flex items-center justify-center mb-6">
              <Calendar size={32} className="text-g4" />
            </div>
            <div className="text-[15px] text-ink mb-2 font-medium">Studio offline for upgrades</div>
            <p className="text-[13px] text-g5 max-w-[40ch] leading-relaxed">Your administrator permissions are verified. Please check back shortly to draft your meet.</p>
          </div>
        </div>
      </div>
    </Shell>
  );
}
