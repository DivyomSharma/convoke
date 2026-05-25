import { redirect } from "next/navigation";
import { createCommunity, createEvent, createOpportunity } from "@/app/actions";
import { Footer } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { Panel } from "@/components/ui/panel";
import { getOrganizerFormOptions } from "@/lib/platform-service";

export default async function OrganizePage() {
  const options = await getOrganizerFormOptions();

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.04em] md:text-7xl">
            Publish and operate from one place.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            Create communities, events, and opportunities directly inside Convoke. These forms write real product records, not placeholders.
          </p>

          <div className="mt-12 grid gap-6">
            <Panel className="p-6">
              <h2 className="text-2xl font-medium">Create a community</h2>
              <form
                action={async (formData) => {
                  "use server";
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
                  redirect(`/communities/${result.slug}`);
                }}
                className="mt-6 grid gap-4 md:grid-cols-2"
              >
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Organization name</span>
                  <input name="organizationName" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Organization type</span>
                  <select name="organizationType" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none">
                    {["STARTUP", "COMMUNITY", "COLLEGE_SOCIETY", "CREATOR_COLLECTIVE", "NGO", "BRAND", "SPONSOR", "PLATFORM", "AGENCY"].map((item) => (
                      <option key={item} value={item}>{item.replaceAll("_", " ")}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Community name</span>
                  <input name="communityName" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Category</span>
                  <select name="category" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none">
                    {["STARTUP", "COLLEGE", "CREATOR", "AI", "DESIGN", "OPEN_SOURCE", "GAMING", "SOCIAL_IMPACT", "NGO"].map((item) => (
                      <option key={item} value={item}>{item.replaceAll("_", " ")}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">City</span>
                  <input name="city" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Website</span>
                  <input name="website" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" placeholder="https://..." />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Tagline</span>
                  <input name="tagline" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Description</span>
                  <textarea name="description" className="min-h-32 w-full rounded-[8px] border border-line bg-black/40 px-4 py-3 text-sm outline-none" />
                </label>
                <FormSubmitButton className="md:col-span-2">Create community</FormSubmitButton>
              </form>
            </Panel>

            <Panel className="p-6">
              <h2 className="text-2xl font-medium">Publish an event</h2>
              {!options.organizations.length ? (
                <p className="mt-3 text-sm text-muted">
                  Create your first community above to unlock event publishing.
                </p>
              ) : null}
              <form
                action={async (formData) => {
                  "use server";
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
                  redirect(`/events/${result.slug}`);
                }}
                className="mt-6 grid gap-4 md:grid-cols-2"
              >
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Organization</span>
                  <select name="organizationId" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none">
                    {options.organizations.map((item) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Community</span>
                  <select name="communityId" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none">
                    <option value="">No linked community</option>
                    {options.communities.map((item) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Title</span>
                  <input name="title" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Category</span>
                  <input name="category" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">City</span>
                  <input name="city" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Venue</span>
                  <input name="venue" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Mode</span>
                  <select name="mode" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none">
                    {["ONLINE", "OFFLINE", "HYBRID"].map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Ticket name</span>
                  <input name="ticketName" defaultValue="General Pass" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Starts at</span>
                  <input type="datetime-local" name="startsAt" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Ends at</span>
                  <input type="datetime-local" name="endsAt" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Price (INR)</span>
                  <input type="number" name="priceInr" defaultValue={0} className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Ticket capacity</span>
                  <input type="number" name="ticketCapacity" defaultValue={100} className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Short description</span>
                  <input name="shortDescription" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Full description</span>
                  <textarea name="description" className="min-h-32 w-full rounded-[8px] border border-line bg-black/40 px-4 py-3 text-sm outline-none" />
                </label>
                <label className="flex items-center gap-3 rounded-[8px] border border-line bg-black/30 px-4 py-3 text-sm text-muted">
                  <input type="checkbox" name="isPaid" />
                  Paid event
                </label>
                <label className="flex items-center gap-3 rounded-[8px] border border-line bg-black/30 px-4 py-3 text-sm text-muted">
                  <input type="checkbox" name="approvalBased" />
                  Approval-based registration
                </label>
                <label className="flex items-center gap-3 rounded-[8px] border border-line bg-black/30 px-4 py-3 text-sm text-muted md:col-span-2">
                  <input type="checkbox" name="featured" />
                  Feature this event in discovery
                </label>
                <FormSubmitButton className="md:col-span-2">Publish event</FormSubmitButton>
              </form>
            </Panel>

            <Panel className="p-6">
              <h2 className="text-2xl font-medium">Open an opportunity</h2>
              {!options.organizations.length ? (
                <p className="mt-3 text-sm text-muted">
                  Create your first community above to unlock opportunity publishing.
                </p>
              ) : null}
              <form
                action={async (formData) => {
                  "use server";
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
                  redirect(`/opportunities/${result.slug}`);
                }}
                className="mt-6 grid gap-4 md:grid-cols-2"
              >
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Organization</span>
                  <select name="organizationId" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none">
                    {options.organizations.map((item) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Community</span>
                  <select name="communityId" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none">
                    <option value="">No linked community</option>
                    {options.communities.map((item) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Title</span>
                  <input name="title" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Type</span>
                  <select name="type" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none">
                    {["INTERNSHIP", "AMBASSADOR", "STARTUP_HIRING", "VOLUNTEER_ROLE", "CREATOR_COLLABORATION", "FREELANCE_GIG"].map((item) => (
                      <option key={item} value={item}>{item.replaceAll("_", " ")}</option>
                    ))}
                  </select>
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Location</span>
                  <input name="location" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Duration</span>
                  <input name="duration" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Stipend / compensation</span>
                  <input name="stipend" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Deadline</span>
                  <input type="datetime-local" name="applicationDeadline" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" />
                </label>
                <label className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Open positions</span>
                  <input type="number" name="positionsAvailable" defaultValue={1} className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Short description</span>
                  <input name="shortDescription" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Description</span>
                  <textarea name="description" className="min-h-32 w-full rounded-[8px] border border-line bg-black/40 px-4 py-3 text-sm outline-none" />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Requirements</span>
                  <textarea name="requirements" className="min-h-28 w-full rounded-[8px] border border-line bg-black/40 px-4 py-3 text-sm outline-none" placeholder="One requirement per line" />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Skills</span>
                  <input name="skills" className="h-12 w-full rounded-[8px] border border-line bg-black/40 px-4 text-sm outline-none" placeholder="React, TypeScript, Figma" />
                </label>
                <label className="space-y-2 md:col-span-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-muted">Perks</span>
                  <textarea name="perks" className="min-h-24 w-full rounded-[8px] border border-line bg-black/40 px-4 py-3 text-sm outline-none" placeholder="One perk per line" />
                </label>
                <label className="flex items-center gap-3 rounded-[8px] border border-line bg-black/30 px-4 py-3 text-sm text-muted">
                  <input type="checkbox" name="isRemote" />
                  Remote friendly
                </label>
                <label className="flex items-center gap-3 rounded-[8px] border border-line bg-black/30 px-4 py-3 text-sm text-muted">
                  <input type="checkbox" name="featured" />
                  Feature in discovery
                </label>
                <FormSubmitButton className="md:col-span-2">Publish opportunity</FormSubmitButton>
              </form>
            </Panel>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
