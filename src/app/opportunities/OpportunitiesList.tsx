"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, CircleDollarSign, MapPin, Plus, X, Loader2, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createOpportunity } from "@/app/actions/workspace";
import { getFallbackPhoto } from "@/lib/photos";
import { CardRing } from "@/components/ui/card-ring";
import { ImageUploadField } from "@/components/forms/ImageUploadField";
import { LocationAutocomplete } from "@/components/forms/LocationAutocomplete";

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
  bannerUrl: string | null;
  organization: {
    name: string;
  } | null;
  space?: {
    name: string;
  } | null;
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

  // Search & filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");

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
  const [bannerFileName, setBannerFileName] = useState("");
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
        setBannerFileName("");
        setDeadline("");
        router.refresh();
      }
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to post opportunity.");
    } finally {
      setLoading(false);
    }
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (opp.organization?.name || opp.space?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (opp.description && opp.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === "ALL" || opp.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  const types = ["ALL", "ROLE", "FELLOWSHIP", "GRANT", "HACKATHON", "CHALLENGE"];

  return (
    <>
      <section className="premium-card p-6 md:p-8 relative z-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="eyebrow">Collaborations & Roles</div>
            <h1 className="mt-2 serif text-4xl tracking-tight md:text-5xl">
              Where the next great teams are formed.
            </h1>
            <p className="mt-3 max-w-2xl text-[14px] leading-6 text-g5">
              Roles, fellowships, grants, and deep-tech collaborations. Discover and connect with organizations that are actively building.
            </p>
          </div>
          <button 
            onClick={() => setDrawerOpen(true)}
            className="ink-button px-5 text-[13px] font-medium flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <Plus size={15} />
            <span>Post Opportunity</span>
          </button>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-between relative z-10 hairline-b pb-5">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-g5" size={15} />
          <input
            type="text"
            placeholder="Search opportunities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-md border border-g3 bg-paper text-[13px] text-ink outline-none focus:border-[var(--brand)] transition-all placeholder:text-g5"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-md mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer border ${
                selectedType === t 
                  ? "border-[var(--brand)] text-[var(--brand)] bg-[var(--brand)]/5 font-semibold" 
                  : "border-g3 text-g5 hover:text-ink hover:border-g4 bg-transparent"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {filteredOpportunities.length === 0 ? (
        <section className="mt-8 p-12 text-center relative z-10 border border-dashed border-g3 rounded-md">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-g3 bg-g1 text-[var(--brand)]">
            <Building2 size={22} />
          </div>
          <h2 className="mt-5 serif text-2xl">No opportunities found</h2>
          <p className="mx-auto mt-2 max-w-[38ch] text-[13px] leading-relaxed text-g5">
            Adjust your search filter or publish the first opportunity to seed the platform.
          </p>
          <div className="mt-6">
            <button 
              onClick={() => setDrawerOpen(true)}
              className="ink-button px-5 text-[13px] font-medium cursor-pointer"
            >
              <Plus size={15} />
              <span>Publish first role</span>
            </button>
          </div>
        </section>
      ) : (
        <section className="mt-6 relative z-10 divide-y divide-g3/80">
          {filteredOpportunities.map((opportunity) => {
            const banner = opportunity.bannerUrl || getFallbackPhoto(opportunity.id, "opportunity");
            return (
              <div key={opportunity.id} className="group premium-card campus-frame overflow-hidden relative border border-[#1a1a1a] hover:border-[#2f2f2f] transition-all duration-700 hover:-translate-y-[2px] ease-[cubic-bezier(0.22,0.61,0.36,1)] mb-4">
                {/* Opportunity Card Ring */}
                <div className="absolute -right-[10%] top-1/2 -translate-y-1/2 opacity-8 group-hover:opacity-25 transition-opacity duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] hidden md:block z-0 pointer-events-none">
                  <CardRing size={500} text="OPPORTUNITY • ROLE • GRANT • CHALLENGE • " />
                </div>
                
                <Link 
                  href={`/opportunities/${opportunity.id}`} 
                  className="grid grid-cols-12 gap-6 p-5 md:p-6 items-center relative z-10"
                >
                  {/* Left Column: Image Banner */}
                  <div className="col-span-12 sm:col-span-3 md:col-span-2">
                    <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full bg-g1 rounded-sm overflow-hidden border border-g3">
                      <img 
                        src={banner} 
                        alt={opportunity.title} 
                        className="w-full h-full object-cover transition-all duration-700" 
                      />
                    </div>
                  </div>

                  {/* Title & Organization Info */}
                  <div className="col-span-12 sm:col-span-9 md:col-span-6 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="mono text-[10px] uppercase tracking-[0.2em] font-medium text-[var(--brand)]">
                        {opportunity.type}
                      </span>
                      <span className="text-g4 text-[10px]">•</span>
                      <span className="mono text-[10px] uppercase tracking-[0.15em] text-g5">
                        {opportunity.organization?.name || opportunity.space?.name || "Community"}
                      </span>
                    </div>
                    <h2 className="serif text-2xl md:text-3xl font-light text-ink group-hover:text-g5 transition-colors line-clamp-1">
                      {opportunity.title}
                    </h2>
                    {opportunity.description && (
                      <p className="mt-2 text-[14px] text-g5 line-clamp-1 leading-relaxed font-sans">
                        {opportunity.description}
                      </p>
                    )}
                  </div>

                  {/* Right Align Metadata Wrapper */}
                  <div className="col-span-12 md:col-span-4 flex flex-col md:items-end justify-center gap-4 mt-4 md:mt-0 pt-4 md:pt-0 border-t border-g3/50 md:border-t-0">
                    {/* Location & Compensation */}
                    <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-1.5 w-full md:w-auto">
                      <span className="text-[13px] text-ink font-sans flex items-center gap-2">
                        <MapPin size={14} className="text-[var(--brand)] shrink-0" />
                        {opportunity.location || "Remote"}
                      </span>
                      <span className="text-[13px] text-g5 font-sans flex items-center gap-2">
                        <CircleDollarSign size={14} className="text-[var(--brand)] shrink-0" />
                        {opportunity.compensation || "Competitive"}
                      </span>
                    </div>

                    {/* Deadline & Applications count */}
                    <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:gap-1.5 w-full md:w-auto">
                      <span className="text-[12px] mono text-ink uppercase tracking-wider">
                        {String(opportunity._count.applications).padStart(2, "0")} applications
                      </span>
                      <span className="text-[12px] font-sans text-g5">
                        {opportunity.deadline
                          ? `Due ${new Date(opportunity.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                          : "Rolling basis"}
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
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

            {/* Creation modal */}
            <motion.div 
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.97 }}
              transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-4 top-[calc(4rem+1.5rem)] z-50 mx-auto flex max-h-[calc(100vh-6.5rem)] w-[min(860px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[34px] border border-g3 bg-paper-elevated/90 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
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
                    className="w-full h-11 px-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)] transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Type <span className="text-red-500">*</span></label>
                    <select 
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full h-11 px-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)] transition-all"
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
                        className="w-full h-11 px-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)] transition-all"
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
                      className="w-full h-11 px-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Employment Type</label>
                    <input 
                      type="text"
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value)}
                      placeholder="E.g. Full-time, Internship"
                      className="w-full h-11 px-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)] transition-all"
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
                      className="w-full h-11 px-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Experience Needed</label>
                    <input 
                      type="text"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      placeholder="E.g. Open to all, 1+ years"
                      className="w-full h-11 px-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)] transition-all"
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
                      className="w-full h-11 px-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Compensation</label>
                    <input 
                      type="text"
                      value={compensation}
                      onChange={(e) => setCompensation(e.target.value)}
                      placeholder="E.g. ₹50k/mo, Equity"
                      className="w-full h-11 px-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)] transition-all"
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
                      className="w-full h-11 px-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)] transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Stipend / Grants Info</label>
                    <input 
                      type="text"
                      value={stipend}
                      onChange={(e) => setStipend(e.target.value)}
                      placeholder="E.g. Funded travel, $5k award"
                      className="w-full h-11 px-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)] transition-all"
                    />
                  </div>
                </div>

                <ImageUploadField
                  label="Opportunity cover"
                  value={bannerUrl}
                  fileName={bannerFileName}
                  onChange={setBannerUrl}
                  onFileNameChange={setBannerFileName}
                  onError={setError}
                />

                <div>
                  <label className="text-ink font-medium text-xs mb-1.5 block">Opportunity Description</label>
                  <textarea 
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detail the role responsibilities, key projects, and ideal candidate profile..."
                    className="w-full p-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)] transition-all resize-none"
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
