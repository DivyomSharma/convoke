import { Shell } from "@/components/Shell";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { createChallenge } from "@/app/actions/challenge";
import { Trophy } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Create Challenge | Convoke" };

export default async function CreateChallengePage() {
  const user = await requireUser();

  const myOrgs = await prisma.organization.findMany({
    where: {
      members: {
        some: { userId: user.id, role: { in: ["FOUNDER", "ADMIN", "LEAD"] } }
      }
    },
    select: { id: true, name: true }
  });

  return (
    <Shell wide>
      <div className="pt-[100px] px-5 sm:px-8 max-w-[800px] mx-auto pb-20">
        <h1 className="serif text-4xl text-ink mb-2 flex items-center gap-3">
          <Trophy className="text-[var(--brand)]" size={32} />
          Creation Studio
        </h1>
        <p className="text-[14px] text-g5 mb-8">Design an engaging challenge, competition, or hackathon for builders.</p>

        {myOrgs.length === 0 ? (
          <div className="p-6 bg-g1 border border-g3 rounded-xl text-center">
            <p className="text-ink font-medium">No Organizations Found</p>
            <p className="text-[13px] text-g5 mt-1 mb-4">You need to be an admin of an organization to host challenges.</p>
            <Link href="/organizations/create" className="ink-button px-4 py-2 text-[13px] font-semibold">
              Create Organization
            </Link>
          </div>
        ) : (
          <form action={createChallenge} className="space-y-6 bg-paper-card border border-g3 rounded-xl p-8">
            
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-ink block">Hosting Organization</label>
              <select name="organizationId" required className="w-full bg-g1 border border-g3 rounded px-3 py-2 text-[14px] text-ink outline-none focus:border-g4">
                {myOrgs.map(org => <option key={org.id} value={org.id}>{org.name}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-medium text-ink block">Challenge Name</label>
              <input type="text" name="name" placeholder="e.g. Open Source Sunday Hackathon, Deep Learning Quiz" required className="w-full bg-g1 border border-g3 rounded px-3 py-2 text-[14px] text-ink outline-none focus:border-g4" />
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-medium text-ink block">Format / Type</label>
              <select name="type" required className="w-full bg-g1 border border-g3 rounded px-3 py-2 text-[14px] text-ink outline-none focus:border-g4">
                <option value="Hackathon">Hackathon</option>
                <option value="Ideathon">Ideathon</option>
                <option value="Quiz">Quiz</option>
                <option value="Debate">Debate</option>
                <option value="Treasure Hunt">Treasure Hunt</option>
                <option value="Gaming Tournament">Gaming Tournament</option>
                <option value="Other">Other Competition</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-medium text-ink block">Description & Guidelines</label>
              <textarea name="description" rows={5} placeholder="Describe the challenge, rules, evaluation criteria, and what the participants are expected to build or do." required className="w-full bg-g1 border border-g3 rounded px-3 py-2 text-[14px] text-ink outline-none focus:border-g4 resize-none" />
            </div>

            <div className="p-4 bg-[var(--brand)]/10 border border-[var(--brand)]/20 rounded-lg">
              <p className="text-[13px] font-semibold text-[var(--brand)]">Need Sponsors?</p>
              <p className="text-[12px] text-[var(--brand)]/80 mt-1">
                Once created, you can submit a sponsorship request directly from your Organization Dashboard to our network of verified sponsors.
              </p>
            </div>

            <div className="pt-4">
              <button type="submit" className="w-full ink-button px-5 py-3 text-[14px] font-semibold">
                Create Challenge Draft
              </button>
            </div>
          </form>
        )}
      </div>
    </Shell>
  );
}
