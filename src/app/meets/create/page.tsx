import { Shell } from "@/components/Shell";
import { X, CalendarDays } from "lucide-react";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { createMeet } from "@/app/actions/meet";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Host Meet | Convoke",
};

export default async function CreateMeetPage() {
  const user = await requireUser();

  const spaceMemberships = await prisma.spaceMembership.findMany({
    where: { 
      userId: user.id,
      role: { in: ["FOUNDER", "LEAD", "ORGANIZER"] }
    },
    include: {
      space: {
        include: { organization: true }
      }
    }
  });

  if (spaceMemberships.length === 0) {
    return (
      <Shell>
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-5 text-center">
          <div className="w-16 h-16 rounded-full bg-g1 flex items-center justify-center mb-6">
            <CalendarDays size={32} className="text-g4" />
          </div>
          <h1 className="serif text-4xl text-ink mb-3">Host a Meet</h1>
          <p className="text-[15px] text-g5 max-w-[40ch] leading-relaxed mb-8">
            You need to be an organizer of a Space to host meets. Create a Space or join an existing one first.
          </p>
          <div className="flex gap-4">
            <Link href="/spaces/create" className="ink-button px-6 py-2.5 rounded-full text-[13px] font-medium">
              Create Space
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
              <h2 className="serif mt-1 text-3xl text-ink">Host Meet</h2>
              <p className="text-xs text-g5 mt-1">Publish an event, conference, workshop, or meetup.</p>
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
            const res = await createMeet(formData);
            if (res.success) {
              redirect(`/meets/${res.meetId}`);
            }
          }} className="flex flex-col flex-1 px-8 py-6">
            <div className="space-y-6 max-w-xl mx-auto w-full pt-4">
              
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-ink block">Meet Title *</label>
                <input 
                  name="title" 
                  required 
                  className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors placeholder:text-g4" 
                  placeholder="e.g. AI Tinkerers Hackathon" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-medium text-ink block">Host Space *</label>
                <select 
                  name="spaceId" 
                  required 
                  className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors"
                >
                  {spaceMemberships.map((m) => (
                    <option key={m.space.id} value={m.space.id}>
                      {m.space.organization?.name} / {m.space.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-ink block">Start Time *</label>
                  <input 
                    name="startTime" 
                    type="datetime-local"
                    required 
                    className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-ink block">End Time *</label>
                  <input 
                    name="endTime" 
                    type="datetime-local"
                    required 
                    className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-ink block">Location City (Optional)</label>
                  <input 
                    name="location" 
                    placeholder="e.g. San Francisco, CA"
                    className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors placeholder:text-g4" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-ink block">Venue / Link (Optional)</label>
                  <input 
                    name="venue" 
                    placeholder="e.g. Hacker Dojo or Zoom Link"
                    className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors placeholder:text-g4" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[13px] font-medium text-ink block">Capacity (Optional)</label>
                <input 
                  name="capacity" 
                  type="number"
                  placeholder="e.g. 100"
                  className="w-full bg-g1 border border-g3 rounded px-3 py-2.5 text-[14px] text-ink outline-none focus:border-g4 transition-colors placeholder:text-g4" 
                />
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
                  placeholder="What is this meet about?" 
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button type="submit" className="ink-button px-6 py-2.5 text-[14px] font-semibold">
                  Publish Meet
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Shell>
  );
}
