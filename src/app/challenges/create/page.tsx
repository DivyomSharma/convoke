import { Shell } from "@/components/Shell";
import { X, Trophy } from "lucide-react";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createOpportunity } from "@/app/actions/opportunity";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Host Challenge | Convoke",
};

export default async function CreateChallengePage() {
  const user = await requireUser();

  const orgMemberships = await prisma.membership.findMany({
    where: { 
      userId: user.id,
      role: { in: ["FOUNDER", "ADMIN", "LEAD"] }
    },
    include: {
      organization: true
    }
  });

  if (orgMemberships.length === 0) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-5 text-center">
          <div className="w-16 h-16 rounded-full bg-g1 flex items-center justify-center mb-6">
            <Trophy size={32} className="text-g4" />
          </div>
          <h1 className="serif text-4xl text-ink mb-3">Host a Challenge</h1>
          <p className="text-[15px] text-g5 max-w-[40ch] leading-relaxed mb-8">
            You need to be an administrator of an Organization to host hackathons and challenges.
          </p>
          <div className="flex gap-4">
            <Link href="/organizations/create" className="ink-button px-6 py-2.5 rounded-full text-[13px] font-medium">
              Create Organization
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  return (
    <Shell wide>
      <div className="min-h-[80vh] flex items-center justify-center p-4 py-12">
        <div className="flex w-full max-w-[860px] flex-col overflow-hidden rounded-[34px] border border-g3 bg-paper-elevated shadow-[0_40px_140px_rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between px-6 py-5 border-b border-g3/60">
            <div>
              <div className="eyebrow text-[var(--brand)]">Creation Studio</div>
              <h2 className="serif mt-1 text-3xl text-ink">Host Challenge</h2>
              <p className="text-xs text-g5 mt-1">Launch a hackathon, competition, or datathon.</p>
            </div>
            <Link 
              href="/workspace"
              className="p-2 rounded-full hover:bg-g1/80 text-g5 hover:text-ink transition-colors cursor-pointer"
            >
              <X size={18} />
            </Link>
          </div>
          
          <form action={async (formData) => {
            "use server";
            formData.set("type", "HACKATHON/CHALLENGE");
            const res = await createOpportunity(formData);
            if (res.success && res.redirectUrl) {
              redirect(res.redirectUrl);
            }
          }} className="flex flex-col flex-1 px-8 py-6">
            <div className="space-y-6 max-w-xl mx-auto w-full pt-4">
              
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-ink block">Challenge Name *</label>
                <input 
                  name="title" 
                  required 
                  className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors placeholder:text-g4" 
                  placeholder="e.g. AI Agents Hackathon 2026" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-medium text-ink block">Host Organization *</label>
                <select 
                  name="organizationId" 
                  required 
                  className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors"
                >
                  {orgMemberships.map((m) => (
                    <option key={m.organization.id} value={m.organization.id}>
                      {m.organization.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-ink block">Location</label>
                  <input 
                    name="location" 
                    placeholder="e.g. Online, New York"
                    className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors placeholder:text-g4" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-ink block">Prize Pool / Rewards</label>
                  <input 
                    name="compensation" 
                    placeholder="e.g. $10,000 Total Prizes"
                    className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors placeholder:text-g4" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-medium text-ink block">Submission Deadline</label>
                <input 
                  name="deadline" 
                  type="date"
                  className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-medium text-ink block">Description & Rules</label>
                <textarea 
                  name="description" 
                  rows={4}
                  className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors placeholder:text-g4 resize-none" 
                  placeholder="What is this challenge about? What are the rules?" 
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="ink-button px-6 py-2.5 text-[14px] font-semibold">
                  Launch Challenge
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Shell>
  );
}
