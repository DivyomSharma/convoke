import { Shell } from "@/components/Shell";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { createSponsorshipRequest } from "@/app/actions/sponsorship";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Request Sponsorship | Convoke" };

export default async function RequestSponsorshipPage(props: { searchParams?: Promise<{ sponsorId?: string }> }) {
  const user = await requireUser();
  const searchParams = await props.searchParams;
  const sponsorId = searchParams?.sponsorId;

  const sponsors = await prisma.organization.findMany({
    where: { approvalStatus: "VERIFIED", isSponsorshipEnabled: true },
    select: { id: true, name: true }
  });

  const myMeets = await prisma.meet.findMany({
    where: { 
      space: {
        organization: {
          members: {
            some: {
              userId: user.id,
              role: { in: ["FOUNDER", "ADMIN"] }
            }
          }
        }
      }
    },
    select: { id: true, title: true }
  });

  return (
    <Shell wide>
      <div className="pt-[100px] px-5 sm:px-8 max-w-[800px] mx-auto pb-20">
        <Link href="/sponsors" className="flex items-center gap-2 text-g5 hover:text-ink transition-colors mb-8 text-[14px]">
          <ArrowLeft size={16} /> Back to Directory
        </Link>
        
        <h1 className="serif text-4xl text-ink mb-2">Request Sponsorship</h1>
        <p className="text-[14px] text-g5 mb-8">Submit a proposal to an approved Convoke sponsor for your meet or challenge.</p>

        <form action={createSponsorshipRequest as any} className="space-y-6 bg-paper-card border border-g3 rounded-xl p-8">
          
          <div className="space-y-2">
            <label className="text-[13px] font-medium text-ink block">Select Sponsor</label>
            <select name="sponsorId" defaultValue={sponsorId || ""} required className="w-full bg-g1 border border-g3 rounded px-3 py-2 text-[14px] text-ink outline-none focus:border-g4">
              <option value="" disabled>Choose a sponsor...</option>
              {sponsors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-ink block">Link to Meet (Optional)</label>
            <select name="meetId" defaultValue="" className="w-full bg-g1 border border-g3 rounded px-3 py-2 text-[14px] text-ink outline-none focus:border-g4">
              <option value="">None / It's a Challenge</option>
              {myMeets.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-ink block">Expected Audience Size</label>
              <input type="text" name="audienceSize" placeholder="e.g. 150-200" required className="w-full bg-g1 border border-g3 rounded px-3 py-2 text-[14px] text-ink outline-none focus:border-g4" />
            </div>
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-ink block">College / Venue</label>
              <input type="text" name="college" placeholder="e.g. MIT, Bangalore" required className="w-full bg-g1 border border-g3 rounded px-3 py-2 text-[14px] text-ink outline-none focus:border-g4" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-ink block">Requested Budget (₹ or $)</label>
            <input type="text" name="budget" placeholder="e.g. ₹50,000" required className="w-full bg-g1 border border-g3 rounded px-3 py-2 text-[14px] text-ink outline-none focus:border-g4" />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-ink block">What do you need? (Deliverables)</label>
            <textarea name="deliverables" rows={3} placeholder="Food for 200 people, venue cost, swags..." required className="w-full bg-g1 border border-g3 rounded px-3 py-2 text-[14px] text-ink outline-none focus:border-g4 resize-none" />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-ink block">Sponsor Benefits</label>
            <textarea name="benefits" rows={3} placeholder="Logo on banner, speaking slot, email blast to attendees..." required className="w-full bg-g1 border border-g3 rounded px-3 py-2 text-[14px] text-ink outline-none focus:border-g4 resize-none" />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-medium text-ink block">Link to Pitch Deck (Optional)</label>
            <input type="url" name="deckUrl" placeholder="https://..." className="w-full bg-g1 border border-g3 rounded px-3 py-2 text-[14px] text-ink outline-none focus:border-g4" />
          </div>

          <div className="pt-4">
            <button type="submit" className="w-full ink-button px-5 py-3 text-[14px] font-semibold">
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </Shell>
  );
}