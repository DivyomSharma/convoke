import { Shell } from "@/components/Shell";
import { X, BookOpen } from "lucide-react";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createResearch } from "@/app/actions/research";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Publish Research | Convoke",
};

export default async function CreateResearchPage() {
  const user = await requireUser();

  const spaceMemberships = await prisma.spaceMembership.findMany({
    where: { userId: user.id },
    include: { space: { include: { organization: true } } }
  });

  return (
    <Shell wide>
      <div className="min-h-[80vh] flex items-center justify-center p-4 py-12">
        <div className="flex w-full max-w-[860px] flex-col overflow-hidden rounded-[34px] border border-g3 bg-paper-elevated shadow-[0_40px_140px_rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between px-6 py-5 border-b border-g3/60">
            <div>
              <div className="eyebrow text-[var(--brand)]">Creation Studio</div>
              <h2 className="serif mt-1 text-3xl text-ink">Publish Research</h2>
              <p className="text-xs text-g5 mt-1">Share papers, datasets, or whitepapers with the ecosystem.</p>
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
            const res = await createResearch(formData);
            if (res.success && res.redirectUrl) {
              redirect(res.redirectUrl);
            }
          }} className="flex flex-col flex-1 px-8 py-6">
            <div className="space-y-6 max-w-xl mx-auto w-full pt-4">
              
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-ink block">Title / Paper Name *</label>
                <input 
                  name="title" 
                  required 
                  className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors placeholder:text-g4" 
                  placeholder="e.g. Attention Is All You Need" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-medium text-ink block">External Link / PDF URL</label>
                <input 
                  name="url" 
                  type="url"
                  className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors placeholder:text-g4" 
                  placeholder="https://arxiv.org/abs/..." 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-medium text-ink block">Link to Space (Optional)</label>
                <select 
                  name="spaceId" 
                  className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors"
                >
                  <option value="">-- No Space --</option>
                  {spaceMemberships.map((m) => (
                    <option key={m.space.id} value={m.space.id}>
                      {m.space.organization.name} / {m.space.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-medium text-ink block">Abstract / Summary</label>
                <textarea 
                  name="abstract" 
                  rows={6}
                  className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors placeholder:text-g4 resize-none" 
                  placeholder="What is this research about?" 
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="ink-button px-6 py-2.5 text-[14px] font-semibold">
                  Publish
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Shell>
  );
}
