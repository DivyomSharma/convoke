"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Users, MapPin, Plus, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createOrganization } from "@/app/actions/workspace";
import { getFallbackPhoto } from "@/lib/photos";
import { CardRing } from "@/components/ui/card-ring";
import { ImageUploadField } from "@/components/forms/ImageUploadField";

interface OrganizationWithMembers {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  industry: string | null;
  location: string | null;
  members: any[];
}

export function OrganizationsList({ initialOrgs }: { initialOrgs: OrganizationWithMembers[] }) {
  const router = useRouter();
  const [orgs, setOrgs] = useState<OrganizationWithMembers[]>(initialOrgs);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoFileName, setLogoFileName] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerFileName, setBannerFileName] = useState("");
  const [description, setDescription] = useState("");
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");

  const handleNameChange = (val: string) => {
    setName(val);
    // Auto-generate slug from name
    setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) {
      setError("Name and slug are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await createOrganization({
        name,
        slug,
        industry: industry || undefined,
        location: location || undefined,
        website: website || undefined,
        logoUrl: logoUrl || undefined,
        bannerUrl: bannerUrl || undefined,
        description: description || undefined,
        mission: mission || undefined,
        vision: vision || undefined,
      });

      if (res.success && res.organization) {
        setDrawerOpen(false);
        // Clear fields
        setName("");
        setSlug("");
        setIndustry("");
        setLocation("");
        setWebsite("");
        setLogoUrl("");
        setLogoFileName("");
        setBannerUrl("");
        setBannerFileName("");
        setDescription("");
        setMission("");
        setVision("");

        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Failed to create organization.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-g3 pb-8 relative z-10">
        <div>
          <div className="mono text-[11px] tracking-[0.2em] uppercase text-g5">
            (03) Collectives
          </div>
          <h1 className="serif text-5xl md:text-7xl mt-4 tracking-tight">Organizations</h1>
          <p className="text-g5 mt-4 text-[16px] max-w-[50ch] leading-relaxed">
            Startup hubs, hacker syndicates, university chapters, and creator rooms defining the future.
          </p>
        </div>
        <button 
          onClick={() => setDrawerOpen(true)}
          className="ink-button px-5 text-[14px] font-medium flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus size={15} />
          <span>Create Organization</span>
        </button>
      </div>

      {orgs.length === 0 ? (
        <div className="py-24 text-center relative z-10 flex flex-col items-center justify-center">
          <h3 className="serif text-4xl text-ink font-light">No organizations established</h3>
          <p className="text-g5 text-[15px] max-w-[36ch] leading-relaxed mt-4 mb-8">
            Create the first builder workspace presence for your team or syndicate.
          </p>
          <button 
            onClick={() => setDrawerOpen(true)}
            className="ink-button px-5 text-[14px] font-medium cursor-pointer"
          >
            Create Organization
          </button>
        </div>
      ) : (
        <div className="mt-12 flex flex-col gap-20 relative z-10">
          {orgs.map((org, index) => {
            const banner = org.logoUrl || getFallbackPhoto(org.id, 'space');
            return (
              <div key={org.id} className="group grid gap-0 lg:grid-cols-12 lg:items-stretch premium-card campus-frame overflow-hidden relative border border-[#1a1a1a] hover:border-[#2f2f2f] transition-all duration-700 hover:-translate-y-[2px] ease-[cubic-bezier(0.22,0.61,0.36,1)]">
                {/* Org Card Ring */}
                <div className="absolute -right-[15%] top-1/2 -translate-y-1/2 opacity-8 group-hover:opacity-25 transition-opacity duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] hidden md:block">
                  <CardRing size={600} text="ORGANIZATION • COLLECTIVE • ORGANIZATION • " />
                </div>

                {/* Large Photography */}
                <div className="lg:col-span-5 relative z-10">
                  <Link href={`/org/${org.slug}`} className="block overflow-hidden bg-g1 h-full min-h-[240px] relative">
                    <img 
                      src={banner} 
                      alt={org.name} 
                      className="absolute inset-0 w-full h-full object-cover" 
                    />
                  </Link>
                </div>

                {/* Feature Content */}
                <div className="lg:col-span-7 flex flex-col justify-center p-6 md:p-10 relative z-10">
                  <div className="flex items-center gap-3 mono text-[11px] uppercase tracking-[0.25em] font-medium text-[var(--brand)] mb-4">
                    <span>(0{index + 1})</span>
                    <span>•</span>
                    <span>{org.industry || "Ecosystem Hub"}</span>
                  </div>

                  <Link href={`/org/${org.slug}`} className="block mt-2">
                    <h3 className="serif text-4xl md:text-5xl leading-tight text-ink group-hover:text-g5 transition-colors font-light">
                      {org.name}
                    </h3>
                  </Link>

                  <p className="text-g5 text-[15px] mt-5 leading-[1.6] max-w-[48ch] font-sans">
                    {org.description || "A collective group of makers and builders shaping technology on campus."}
                  </p>

                  <div className="mt-8 flex items-center gap-6 text-[13px] font-sans text-g5">
                    <span>{org.members.length} Members</span>
                    <span>•</span>
                    <span>{org.location || "Remote"}</span>
                  </div>

                  <div className="mt-8">
                    <Link 
                      href={`/org/${org.slug}`}
                      className="text-[13px] font-medium text-ink hover:underline underline-offset-4 inline-flex items-center gap-2"
                    >
                      <span>Enter Workspace</span>
                      <span className="text-[11px] opacity-70">→</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
                  <h2 className="serif text-2xl text-ink">New Organization</h2>
                  <p className="text-xs text-g5 mt-0.5">Establish your workspace presence.</p>
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
                  <label className="text-ink font-medium text-xs mb-1.5 block">Organization Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="E.g. Delhi Hacker Club"
                    className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="text-ink font-medium text-xs mb-1.5 block">Organization Slug (URL path) <span className="text-red-500">*</span></label>
                  <div className="relative flex items-center h-11 rounded-xl border border-g3 bg-transparent focus-within:border-[var(--brand)]/55 focus-within:ring-1 focus-within:ring-[var(--brand)]/20 transition-all overflow-hidden">
                    <span className="pl-4 pr-0.5 text-g4 text-sm font-mono select-none">theconvoke.xyz/org/</span>
                    <input 
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      placeholder="delhi-hacker-club"
                      className="flex-1 h-full pr-4 bg-transparent text-sm text-ink outline-none font-mono min-w-0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Industry / Tag</label>
                    <input 
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="E.g. Hacking, Startup"
                      className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Location</label>
                    <input 
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="E.g. New Delhi, Remote"
                      className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-ink font-medium text-xs mb-1.5 block">Website URL</label>
                  <input 
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://myclub.com"
                    className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <ImageUploadField
                    label="Organization logo"
                    value={logoUrl}
                    fileName={logoFileName}
                    onChange={setLogoUrl}
                    onFileNameChange={setLogoFileName}
                    onError={setError}
                    compact
                  />
                  <ImageUploadField
                    label="Organization banner"
                    value={bannerUrl}
                    fileName={bannerFileName}
                    onChange={setBannerUrl}
                    onFileNameChange={setBannerFileName}
                    onError={setError}
                    compact
                  />
                </div>

                <div>
                  <label className="text-ink font-medium text-xs mb-1.5 block">Brief Description</label>
                  <textarea 
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your organization's focus and core activities..."
                    className="w-full p-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Mission Statement</label>
                    <textarea 
                      rows={3}
                      value={mission}
                      onChange={(e) => setMission(e.target.value)}
                      placeholder="What is your immediate mission?"
                      className="w-full p-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Vision Statement</label>
                    <textarea 
                      rows={3}
                      value={vision}
                      onChange={(e) => setVision(e.target.value)}
                      placeholder="Where do you see the future?"
                      className="w-full p-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all resize-none"
                    />
                  </div>
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
                  disabled={loading}
                  className="flex-1 h-11 rounded-full bg-ink hover:opacity-95 text-paper text-xs font-semibold transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 border border-[var(--brand)]/20 cursor-pointer"
                >
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  <span>Establish Organization</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
