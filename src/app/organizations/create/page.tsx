import { Shell } from "@/components/Shell";
import { X } from "lucide-react";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createOrganization } from "@/app/actions/organization";

export const metadata = {
  title: "Create Organization | Convoke",
};

export default async function CreateOrganizationPage() {
  const user = await requireUser();

  return (
    <Shell wide>
      <div className="min-h-[80vh] flex items-center justify-center p-4 py-12">
        <div className="flex w-full max-w-[860px] flex-col overflow-hidden rounded-[34px] border border-g3 bg-paper-elevated shadow-[0_40px_140px_rgba(0,0,0,0.2)]">
          <div className="flex items-center justify-between px-6 py-5 border-b border-g3/60">
            <div>
              <div className="eyebrow text-[var(--brand)]">Creation Studio</div>
              <h2 className="serif mt-1 text-3xl text-ink">Launch Organization</h2>
              <p className="text-xs text-g5 mt-1">Register a university, company, DAO, or massive community.</p>
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
            const res = await createOrganization(formData);
            if (res.success) {
              redirect(`/organizations/${res.organizationId}/manage`);
            }
          }} className="flex flex-col flex-1 px-8 py-6">
            <div className="space-y-6 max-w-xl mx-auto w-full pt-4">
              
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-ink block">Organization Name *</label>
                <input 
                  name="name" 
                  required 
                  className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors placeholder:text-g4" 
                  placeholder="e.g. Stanford University" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-medium text-ink block">Type</label>
                <select 
                  name="type" 
                  className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors"
                  defaultValue="University"
                >
                  <option value="University">University</option>
                  <option value="Company">Company</option>
                  <option value="Non-profit">Non-profit</option>
                  <option value="DAO">DAO</option>
                  <option value="High School">High School</option>
                  <option value="Club">Club</option>
                  <option value="Community">Community</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-medium text-ink block">Website</label>
                <input 
                  name="website" 
                  type="url"
                  className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors placeholder:text-g4" 
                  placeholder="https://..." 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-medium text-ink block">Description</label>
                <textarea 
                  name="description" 
                  rows={4}
                  className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors placeholder:text-g4 resize-none" 
                  placeholder="Briefly describe what this organization is about..." 
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="ink-button px-6 py-2.5 text-[14px] font-semibold">
                  Register Organization
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Shell>
  );
}
