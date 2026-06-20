"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, CircleDollarSign, MapPin, Plus, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createOpportunity } from "@/app/actions/workspace";

interface OpportunityWithDetails {
  id: string;
  title: string;
  type: string;
  description: string | null;
  location: string | null;
  compensation: string | null;
  remoteHybrid: string | null;
  openings: number | null;
  experience: string | null;
  deadline: Date | null;
  organization: {
    name: string;
  };
  _count: {
    applications: number;
  };
}

interface OrganizationOption {
  id: string;
  name: string;
}

export function OpportunitiesList({ 
  initialOpportunities, 
  organizations 
}: { 
  initialOpportunities: OpportunityWithDetails[];
  organizations: OrganizationOption[];
}) {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<OpportunityWithDetails[]>(initialOpportunities);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [type, setType] = useState("ROLE");
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id || "");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState("");
  const [employmentType, setEmploymentType] = useState("");
  const [openings, setOpenings] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [compensation, setCompensation] = useState("");
  const [stipend, setStipend] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !type || !organizationId) {
      setError("Title, type, and organization are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await createOpportunity({
        title,
        type,
        organizationId,
        description: description || undefined,
        department: department || undefined,
        employmentType: employmentType || undefined,
        openings: openings ? Number(openings) : undefined,
        experience: experience || undefined,
        location: location || undefined,
        compensation: compensation || undefined,
        stipend: stipend || undefined,
        bannerUrl: bannerUrl || undefined,
        deadline: deadline || undefined,
      });

      if (res.success && res.opportunity) {
        setDrawerOpen(false);
        setTitle("");
        setType("ROLE");
        setDescription("");
        setDepartment("");
        setEmploymentType("");
        setOpenings("");
        setExperience("");
        setLocation("");
        setCompensation("");
        setStipend("");
        setBannerUrl("");
        setDeadline("");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Failed to post opportunity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="campus-frame premium-card p-7 md:p-10 z-10 relative">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="eyebrow">Opportunity board</div>
            <h1 className="mt-3 serif text-5xl tracking-tight md:text-7xl">
              Roles, fellowships, grants, and builder asks.
            </h1>
            <p className="mt-5 max-w-2xl text-[15px] leading-7 text-g5 md:text-[17px]">
              This surface should help ambitious people move: apply faster, discover sharper roles, and connect with organizations that are actively building.
            </p>
          </div>
          <button 
            onClick={() => setDrawerOpen(true)}
            className="ink-button px-5 text-[14px] font-medium flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Plus size={16} />
            <span>Post Opportunity</span>
          </button>
        </div>
      </section>

      {opportunities.length === 0 ? (
        <section className="mt-8 premium-card p-12 text-center relative z-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-g3 bg-g1 text-[var(--brand)]">
            <Building2 size={26} />
          </div>
          <h2 className="mt-6 serif text-3xl">No opportunities are live yet</h2>
          <p className="mx-auto mt-3 max-w-[42ch] text-[15px] leading-7 text-g5">
            Post the first internship, volunteer role, ambassador program, or fellowship. This directory stays honest until the ecosystem is real.
          </p>
          <div className="mt-8">
            <button 
              onClick={() => setDrawerOpen(true)}
              className="ink-button px-5 text-[14px] font-medium cursor-pointer"
            >
              <Plus size={16} />
              <span>Publish first role</span>
            </button>
          </div>
        </section>
      ) : (
        <section className="mt-8 grid gap-5 relative z-10">
          {opportunities.map((opportunity) => (
            <Link key={opportunity.id} href={`/opportunities/${opportunity.id}`} className="premium-card campus-frame block p-6 md:p-8">
              <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-[color:var(--brand)]/25 bg-[color:var(--brand)]/10 px-3 py-1 mono text-[11px] uppercase tracking-[0.18em] text-[var(--brand)]">
                      {opportunity.type}
                    </span>
                    <span className="mono text-[11px] uppercase tracking-[0.18em] text-g4">
                      {opportunity.organization.name}
                    </span>
                  </div>
                  <h2 className="mt-5 serif text-3xl tracking-tight md:text-5xl">{opportunity.title}</h2>
                  <p className="mt-4 max-w-3xl text-[15px] leading-7 text-g5 line-clamp-2">
                    {opportunity.description || "No public description has been published yet."}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3 text-[13px] text-g5">
                    <span className="inline-flex items-center gap-2 rounded-full border border-g3 bg-g1/60 px-3 py-2">
                      <Building2 size={14} className="text-[var(--brand)]" />
                      {opportunity.organization.name}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-g3 bg-g1/60 px-3 py-2">
                      <MapPin size={14} className="text-[var(--brand)]" />
                      {opportunity.location || "Remote"}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-g3 bg-g1/60 px-3 py-2">
                      <CircleDollarSign size={14} className="text-[var(--brand)]" />
                      {opportunity.compensation || "Competitive"}
                    </span>
                  </div>
                </div>

                <div className="glass-panel rounded-[26px] p-5 md:p-6">
                  <div className="eyebrow">Application pulse</div>
                  <div className="mt-3 serif text-4xl">{String(opportunity._count.applications).padStart(2, "0")}</div>
                  <div className="mt-2 text-[14px] leading-6 text-g5">
                    {opportunity.deadline
                      ? `Applications open until ${new Date(opportunity.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}.`
                      : "Rolling applications with no fixed deadline published yet."}
                  </div>

                  <div className="mt-6 space-y-3 border-t border-g3 pt-5 text-[13px] text-g5">
                    <div className="flex items-center justify-between">
                      <span>Work style</span>
                      <span className="text-ink">{opportunity.remoteHybrid || "Flexible"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Openings</span>
                      <span className="text-ink">{opportunity.openings || "Not stated"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Experience</span>
                      <span className="text-ink">{opportunity.experience || "Open to builders"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}

      {/* Creation Drawer Overlay */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 bg-[#000000] z-40 backdrop-blur-sm"
            />

            {/* Slide-over Drawer */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full max-w-[500px] bg-paper border-l border-g3/80 shadow-[0_0_80px_rgba(0,0,0,0.8)] z-50 flex flex-col h-full"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-g3/60">
                <div>
                  <h2 className="serif text-2xl text-ink">Publish Opportunity</h2>
                  <p className="text-xs text-g5 mt-0.5">Post a role, grant, or hackathon ask.</p>
                </div>
                <button 
                  onClick={() => setDrawerOpen(false)}
                  className="p-2 rounded-full hover:bg-g1/80 text-g5 hover:text-ink transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrollable Form */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                {error && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center">
                    {error}
                  </div>
                )}

                <div>
                  <label className="text-ink font-medium text-xs mb-1.5 block">Opportunity Title <span className="text-red-500">*</span></label>
                  <input 
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="E.g. Lead Frontend Architect"
                    className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Type <span className="text-red-500">*</span></label>
                    <select 
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-g3 bg-paper text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                    >
                      <option value="ROLE">Role / Job</option>
                      <option value="FELLOWSHIP">Fellowship</option>
                      <option value="GRANT">Grant</option>
                      <option value="HACKATHON">Hackathon</option>
                      <option value="CHALLENGE">Challenge</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Host Organization <span className="text-red-500">*</span></label>
                    {organizations.length === 0 ? (
                      <div className="text-[11px] text-amber-500 p-2 rounded bg-amber-500/10 border border-amber-500/20">
                        No organizations found.
                      </div>
                    ) : (
                      <select 
                        value={organizationId}
                        onChange={(e) => setOrganizationId(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-g3 bg-paper text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                      >
                        {organizations.map((org) => (
                          <option key={org.id} value={org.id}>{org.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Department / Team</label>
                    <input 
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="E.g. Engineering, Design"
                      className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Employment Type</label>
                    <input 
                      type="text"
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value)}
                      placeholder="E.g. Full-time, Internship"
                      className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Open Positions</label>
                    <input 
                      type="number"
                      value={openings}
                      onChange={(e) => setOpenings(e.target.value)}
                      placeholder="E.g. 2"
                      className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Experience Needed</label>
                    <input 
                      type="text"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="E.g. Open to all, 1+ years"
                      className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Location</label>
                    <input 
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="E.g. Remote, Bangalore"
                      className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Compensation</label>
                    <input 
                      type="text"
                      value={compensation}
                      onChange={(e) => setCompensation(e.target.value)}
                      placeholder="E.g. ₹50k/mo, Equity"
                      className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Deadline</label>
                    <input 
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Stipend / Grants Info</label>
                    <input 
                      type="text"
                      value={stipend}
                      onChange={(e) => setStipend(e.target.value)}
                      placeholder="E.g. Funded travel, $5k award"
                      className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-ink font-medium text-xs mb-1.5 block">Banner Image URL</label>
                  <input 
                    type="url"
                    value={bannerUrl}
                    onChange={(e) => setBannerUrl(e.target.value)}
                    placeholder="https://unsplash.com/... or direct image link"
                    className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="text-ink font-medium text-xs mb-1.5 block">Opportunity Description</label>
                  <textarea 
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detail the role responsibilities, key projects, and ideal candidate profile..."
                    className="w-full p-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all resize-none"
                  />
                </div>
              </form>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-g3/60 bg-g1/20 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="flex-1 h-11 rounded-full border border-g3 text-xs font-semibold hover:bg-g1 text-ink transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || organizations.length === 0}
                  className="flex-1 h-11 rounded-full bg-ink hover:opacity-95 text-paper text-xs font-semibold transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 border border-[var(--brand)]/20 cursor-pointer"
                >
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  <span>Publish Opportunity</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
