"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Globe, MapPin, Users, Video, Briefcase, Calendar, CheckCircle2 } from "lucide-react";
import { createCommunity, createEvent, createOpportunity } from "@/app/actions";
import { FormSubmitButton } from "@/components/ui/form-submit-button";

type Options = {
  organizations: { id: string; name: string; slug: string }[];
  communities: { id: string; name: string; slug: string }[];
};

export function OrganizeClient({ options }: { options: Options }) {
  const [activeTab, setActiveTab] = useState<"event" | "community" | "opportunity">("event");

  return (
    <div className="mt-12 grid gap-6 lg:grid-cols-[240px_1fr]">
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setActiveTab("event")}
          className={`flex items-center gap-3 rounded-[8px] px-4 py-3 text-sm font-medium transition ${
            activeTab === "event" ? "bg-white/[0.06] text-foreground" : "text-muted hover:bg-white/[0.03]"
          }`}
        >
          <Calendar className="size-4" />
          Event
        </button>
        <button
          onClick={() => setActiveTab("community")}
          className={`flex items-center gap-3 rounded-[8px] px-4 py-3 text-sm font-medium transition ${
            activeTab === "community" ? "bg-white/[0.06] text-foreground" : "text-muted hover:bg-white/[0.03]"
          }`}
        >
          <Users className="size-4" />
          Community
        </button>
        <button
          onClick={() => setActiveTab("opportunity")}
          className={`flex items-center gap-3 rounded-[8px] px-4 py-3 text-sm font-medium transition ${
            activeTab === "opportunity" ? "bg-white/[0.06] text-foreground" : "text-muted hover:bg-white/[0.03]"
          }`}
        >
          <Briefcase className="size-4" />
          Opportunity
        </button>
      </div>

      <div className="relative min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === "event" && <EventFlow key="event" options={options} />}
          {activeTab === "community" && <CommunityFlow key="community" options={options} />}
          {activeTab === "opportunity" && <OpportunityFlow key="opportunity" options={options} />}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Shared Components ──────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="mb-8 flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 w-12 rounded-full transition-colors duration-500 ${
            i <= current ? "bg-bronze" : "bg-white/10"
          }`}
        />
      ))}
      <span className="ml-2 text-xs text-muted">Step {current + 1} of {total}</span>
    </div>
  );
}

// ─── Event Wizard ──────────────────────────────────────────────────

function EventFlow({ options }: { options: Options }) {
  const [step, setStep] = useState(0);

  if (!options.organizations.length) {
    return (
      <div className="rounded-xl border border-line bg-black/40 p-8 text-center">
        <Users className="mx-auto size-12 text-muted" />
        <h3 className="mt-4 text-lg font-medium">Create a community first</h3>
        <p className="mt-2 text-sm text-muted">You need an organization or community to host an event.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-xl border border-line bg-black/40 p-6 md:p-8"
    >
      <StepIndicator current={step} total={3} />
      <h2 className="text-2xl font-medium mb-6">Launch an event</h2>

      <form action={async (formData) => {
        const result = await createEvent({
          organizationId: String(formData.get("organizationId") ?? ""),
          communityId: String(formData.get("communityId") ?? ""),
          title: String(formData.get("title") ?? ""),
          category: String(formData.get("category") ?? ""),
          city: String(formData.get("city") ?? ""),
          venue: String(formData.get("venue") ?? ""),
          mode: String(formData.get("mode") ?? ""),
          shortDescription: String(formData.get("shortDescription") ?? ""),
          description: String(formData.get("description") ?? ""),
          startsAt: String(formData.get("startsAt") ?? ""),
          endsAt: String(formData.get("endsAt") ?? ""),
          isPaid: formData.get("isPaid") === "on",
          approvalBased: formData.get("approvalBased") === "on",
          featured: formData.get("featured") === "on",
          priceInr: Number(formData.get("priceInr") ?? 0),
          ticketName: String(formData.get("ticketName") ?? ""),
          ticketCapacity: Number(formData.get("ticketCapacity") ?? 0),
        });
        window.location.href = `/events/${result.slug}`;
      }}>
        <div className={step === 0 ? "block" : "hidden"}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Host Organization</span>
              <select name="organizationId" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" required>
                {options.organizations.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Community (Optional)</span>
              <select name="communityId" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none">
                <option value="">No linked community</option>
                {options.communities.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Event Title</span>
              <input name="title" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" required />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Category</span>
              <select name="category" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" required>
                <option value="Hackathon">Hackathon</option>
                <option value="Meetup">Meetup</option>
                <option value="Workshop">Workshop</option>
                <option value="Conference">Conference</option>
                <option value="Festival">Festival</option>
                <option value="Demo Day">Demo Day</option>
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Format</span>
              <select name="mode" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" required>
                <option value="ONLINE">Online</option>
                <option value="OFFLINE">In-Person</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </label>
          </div>
          <div className="mt-8 flex justify-end">
            <button type="button" onClick={() => setStep(1)} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition hover:bg-bronze hover:text-black">
              Next: Details <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div className={step === 1 ? "block" : "hidden"}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Short summary</span>
              <input name="shortDescription" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" required />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Full Description</span>
              <textarea name="description" className="min-h-32 w-full rounded-[8px] border border-line bg-black/40 px-4 py-3 text-sm outline-none" required />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">City</span>
              <input name="city" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" required />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Venue Details</span>
              <input name="venue" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Starts at</span>
              <input type="datetime-local" name="startsAt" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" required />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Ends at</span>
              <input type="datetime-local" name="endsAt" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" required />
            </label>
          </div>
          <div className="mt-8 flex justify-between">
            <button type="button" onClick={() => setStep(0)} className="text-sm font-medium text-muted hover:text-foreground">Back</button>
            <button type="button" onClick={() => setStep(2)} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition hover:bg-bronze hover:text-black">
              Next: Tickets <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div className={step === 2 ? "block" : "hidden"}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Ticket name</span>
              <input name="ticketName" defaultValue="General Pass" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" required />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Capacity</span>
              <input type="number" name="ticketCapacity" defaultValue={100} className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" required />
            </label>
            <div className="space-y-4 md:col-span-2 mt-2">
              <label className="flex items-center gap-3 rounded-[8px] border border-line bg-black/30 px-4 py-3 text-sm text-muted">
                <input type="checkbox" name="isPaid" />
                This is a paid event
              </label>
              <label className="space-y-2">
                <span className="text-xs uppercase tracking-[0.22em] text-muted">Price (INR) - If paid</span>
                <input type="number" name="priceInr" defaultValue={0} className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" />
              </label>
              <label className="flex items-center gap-3 rounded-[8px] border border-line bg-black/30 px-4 py-3 text-sm text-muted">
                <input type="checkbox" name="approvalBased" />
                Require manual approval for attendees
              </label>
              <label className="flex items-center gap-3 rounded-[8px] border border-line bg-black/30 px-4 py-3 text-sm text-muted">
                <input type="checkbox" name="featured" defaultChecked />
                Feature this event in discovery
              </label>
            </div>
          </div>
          <div className="mt-8 flex justify-between items-center">
            <button type="button" onClick={() => setStep(1)} className="text-sm font-medium text-muted hover:text-foreground">Back</button>
            <FormSubmitButton className="rounded-full">Publish Event</FormSubmitButton>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

// ─── Community Wizard ──────────────────────────────────────────────

function CommunityFlow({ options }: { options: Options }) {
  const [step, setStep] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-xl border border-line bg-black/40 p-6 md:p-8"
    >
      <StepIndicator current={step} total={2} />
      <h2 className="text-2xl font-medium mb-6">Start a community</h2>

      <form action={async (formData) => {
        const result = await createCommunity({
          organizationName: String(formData.get("organizationName") ?? ""),
          organizationType: String(formData.get("organizationType") ?? ""),
          communityName: String(formData.get("communityName") ?? ""),
          category: String(formData.get("category") ?? ""),
          city: String(formData.get("city") ?? ""),
          tagline: String(formData.get("tagline") ?? ""),
          description: String(formData.get("description") ?? ""),
          website: String(formData.get("website") ?? ""),
        });
        window.location.href = `/communities/${result.slug}`;
      }}>
        <div className={step === 0 ? "block" : "hidden"}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Community Name</span>
              <input name="communityName" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" required />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Catchy Tagline</span>
              <input name="tagline" placeholder="What brings you together?" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" required />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Primary Category</span>
              <select name="category" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" required>
                {["STARTUP", "COLLEGE", "CREATOR", "AI", "DESIGN", "OPEN_SOURCE", "GAMING", "SOCIAL_IMPACT", "NGO"].map((item) => (
                  <option key={item} value={item}>{item.replaceAll("_", " ")}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Base City</span>
              <input name="city" placeholder="e.g. Bangalore" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" required />
            </label>
          </div>
          <div className="mt-8 flex justify-end">
            <button type="button" onClick={() => setStep(1)} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition hover:bg-bronze hover:text-black">
              Next: Organization <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div className={step === 1 ? "block" : "hidden"}>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2 mb-2 rounded-lg bg-bronze/10 border border-bronze/20 p-4 text-sm text-bronze">
              Every community belongs to an umbrella organization.
            </div>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Organization Name</span>
              <input name="organizationName" placeholder="Same as community name if unsure" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" required />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Organization Type</span>
              <select name="organizationType" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" required>
                {["COMMUNITY", "STARTUP", "COLLEGE_SOCIETY", "CREATOR_COLLECTIVE", "NGO"].map((item) => (
                  <option key={item} value={item}>{item.replaceAll("_", " ")}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Full Description</span>
              <textarea name="description" className="min-h-32 w-full rounded-[8px] border border-line bg-black/40 px-4 py-3 text-sm outline-none" required />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Website / Social Link</span>
              <input name="website" type="url" placeholder="https://..." className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" />
            </label>
          </div>
          <div className="mt-8 flex justify-between items-center">
            <button type="button" onClick={() => setStep(0)} className="text-sm font-medium text-muted hover:text-foreground">Back</button>
            <FormSubmitButton className="rounded-full">Launch Community</FormSubmitButton>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

// ─── Opportunity Wizard ────────────────────────────────────────────

function OpportunityFlow({ options }: { options: Options }) {
  const [step, setStep] = useState(0);

  if (!options.organizations.length) {
    return (
      <div className="rounded-xl border border-line bg-black/40 p-8 text-center">
        <Users className="mx-auto size-12 text-muted" />
        <h3 className="mt-4 text-lg font-medium">Create a community first</h3>
        <p className="mt-2 text-sm text-muted">You need an organization to post opportunities.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-xl border border-line bg-black/40 p-6 md:p-8"
    >
      <StepIndicator current={step} total={3} />
      <h2 className="text-2xl font-medium mb-6">Post an opportunity</h2>

      <form action={async (formData) => {
        const result = await createOpportunity({
          organizationId: String(formData.get("organizationId") ?? ""),
          communityId: String(formData.get("communityId") ?? ""),
          title: String(formData.get("title") ?? ""),
          type: String(formData.get("type") ?? ""),
          location: String(formData.get("location") ?? ""),
          isRemote: formData.get("isRemote") === "on",
          shortDescription: String(formData.get("shortDescription") ?? ""),
          description: String(formData.get("description") ?? ""),
          requirements: String(formData.get("requirements") ?? ""),
          skills: String(formData.get("skills") ?? ""),
          perks: String(formData.get("perks") ?? ""),
          stipend: String(formData.get("stipend") ?? ""),
          duration: String(formData.get("duration") ?? ""),
          applicationDeadline: String(formData.get("applicationDeadline") ?? ""),
          positionsAvailable: Number(formData.get("positionsAvailable") ?? 1),
          featured: formData.get("featured") === "on",
        });
        window.location.href = `/opportunities/${result.slug}`;
      }}>
        <div className={step === 0 ? "block" : "hidden"}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Role Title</span>
              <input name="title" placeholder="e.g. Frontend Developer Intern" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" required />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Organization</span>
              <select name="organizationId" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" required>
                {options.organizations.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Type</span>
              <select name="type" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" required>
                <option value="INTERNSHIP">Internship</option>
                <option value="AMBASSADOR">Ambassador Program</option>
                <option value="STARTUP_HIRING">Startup Hiring</option>
                <option value="VOLUNTEER_ROLE">Volunteer Role</option>
                <option value="CREATOR_COLLABORATION">Creator Collaboration</option>
                <option value="FREELANCE_GIG">Freelance Gig</option>
              </select>
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Short Description (1 sentence)</span>
              <input name="shortDescription" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" required />
            </label>
          </div>
          <div className="mt-8 flex justify-end">
            <button type="button" onClick={() => setStep(1)} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition hover:bg-bronze hover:text-black">
              Next: Logistics <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div className={step === 1 ? "block" : "hidden"}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Location</span>
              <input name="location" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" required />
            </label>
            <div className="flex items-end pb-3">
              <label className="flex items-center gap-3 text-sm text-muted">
                <input type="checkbox" name="isRemote" defaultChecked />
                Remote friendly
              </label>
            </div>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Duration</span>
              <input name="duration" placeholder="e.g. 3 months" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" required />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Stipend / Compensation</span>
              <input name="stipend" placeholder="e.g. ₹15,000/month or Unpaid" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" required />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Application Deadline</span>
              <input type="datetime-local" name="applicationDeadline" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" required />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Open Positions</span>
              <input type="number" name="positionsAvailable" defaultValue={1} className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" required />
            </label>
          </div>
          <div className="mt-8 flex justify-between">
            <button type="button" onClick={() => setStep(0)} className="text-sm font-medium text-muted hover:text-foreground">Back</button>
            <button type="button" onClick={() => setStep(2)} className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition hover:bg-bronze hover:text-black">
              Next: Details <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div className={step === 2 ? "block" : "hidden"}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Full Description</span>
              <textarea name="description" className="min-h-24 w-full rounded-[8px] border border-line bg-black/40 px-4 py-3 text-sm outline-none" required />
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Requirements (Comma separated)</span>
              <textarea name="requirements" placeholder="Strong communication, self-motivated" className="h-16 w-full rounded-[8px] border border-line bg-black/40 px-4 py-3 text-sm outline-none" required />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Skills (Comma separated)</span>
              <input name="skills" placeholder="React, Figma, Writing" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" required />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-[0.22em] text-muted">Perks (Comma separated)</span>
              <input name="perks" placeholder="Certificate, LOR" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" required />
            </label>
            <div className="md:col-span-2 mt-2">
              <label className="flex items-center gap-3 rounded-[8px] border border-line bg-black/30 px-4 py-3 text-sm text-muted">
                <input type="checkbox" name="featured" defaultChecked />
                Feature in discovery
              </label>
            </div>
          </div>
          <div className="mt-8 flex justify-between items-center">
            <button type="button" onClick={() => setStep(1)} className="text-sm font-medium text-muted hover:text-foreground">Back</button>
            <FormSubmitButton className="rounded-full">Post Opportunity</FormSubmitButton>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
