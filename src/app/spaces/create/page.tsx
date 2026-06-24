import { Shell } from "@/components/Shell";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ShieldAlert, ArrowLeft, X, Building2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Create Space | Convoke",
};

export default async function CreateSpacePage() {
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
            You must be an administrator or founder of an organization to create spaces on Convoke. 
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

  return (
    <Shell wide>
      <div className="min-h-[80vh] flex items-center justify-center p-4 py-12">
        <div className="flex w-full max-w-[860px] flex-col overflow-hidden rounded-[34px] border border-g3 bg-paper-elevated shadow-[0_40px_140px_rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between px-6 py-5 border-b border-g3/60">
            <div>
              <div className="eyebrow text-[var(--brand)]">Creation Studio</div>
              <h2 className="serif mt-1 text-3xl text-ink">Create Space</h2>
              <p className="text-xs text-g5 mt-1">Publish a new collective, community, club, or chapter.</p>
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
            const { createSpace } = await import("@/app/actions/space");
            const { redirect } = await import("next/navigation");
            const res = await createSpace(formData);
            if (res.success) {
              redirect(`/spaces/${res.spaceId}`);
            }
          }} className="flex flex-col flex-1 px-8 py-6">
            <div className="space-y-6 max-w-xl mx-auto w-full pt-4">
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-ink block">Space Name *</label>
                <input 
                  name="name" 
                  required 
                  className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors placeholder:text-g4" 
                  placeholder="e.g. AI Research Group" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-medium text-ink block">Parent Organization *</label>
                <select 
                  name="organizationId" 
                  required 
                  className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors"
                >
                  {memberships.map((m) => (
                    <option key={m.organization.id} value={m.organization.id}>
                      {m.organization.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-medium text-ink block">Space Type</label>
                <select 
                  name="type" 
                  className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors"
                  defaultValue="Community"
                >
                  <option value="Community">Community</option>
                  <option value="Club">Club</option>
                  <option value="Society">Society</option>
                  <option value="Chapter">Chapter</option>
                  <option value="Circle">Circle</option>
                  <option value="Collective">Collective</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-ink block">Category / Taxonomy (Optional)</label>
                  <input 
                    name="category" 
                    className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors placeholder:text-g4" 
                    placeholder="e.g. AI, Open Source" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-ink block">Region (Optional)</label>
                  <input 
                    name="region" 
                    className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors placeholder:text-g4" 
                    placeholder="e.g. San Francisco, CA" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-medium text-ink block">Description</label>
                <textarea 
                  name="description" 
                  rows={4}
                  className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors placeholder:text-g4 resize-none" 
                  placeholder="Briefly describe what this space is about..." 
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="ink-button px-6 py-2.5 text-[14px] font-semibold">
                  Launch Space
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Shell>
  );
}
