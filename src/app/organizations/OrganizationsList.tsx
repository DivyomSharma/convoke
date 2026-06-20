"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Users, MapPin, Plus, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createOrganization } from "@/app/actions/workspace";

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
  const [bannerUrl, setBannerUrl] = useState("");
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
        setBannerUrl("");
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
      <div className="flex items-end justify-between hairline-b pb-6 relative z-10">
        <div>
          <h1 className="serif text-5xl md:text-6xl tracking-tight">Organizations</h1>
          <p className="text-g5 mt-3 text-lg">Discover communities, startups, and college clubs.</p>
        </div>
        <button 
          onClick={() => setDrawerOpen(true)}
          className="flex items-center justify-center gap-2 bg-ink text-paper px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-ink-2 transition-all active:scale-95 border border-[var(--brand)]/25 shadow-md cursor-pointer"
        >
          <Plus size={16} />
          <span>Create Organization</span>
        </button>
      </div>

      {orgs.length === 0 ? (
        <div className="py-32 text-center relative z-10 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center text-g5 mb-6">
            <Building2 size={28} />
          </div>
          <h3 className="serif text-3xl text-ink mb-2">No organizations yet</h3>
          <p className="text-g5 text-[15px] max-w-[40ch] leading-relaxed mb-8">
            Start a builder community, startup hub, or university club to bring people together.
          </p>
          <button 
            onClick={() => setDrawerOpen(true)}
            className="bg-ink text-paper px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-ink-2 transition-all active:scale-95 border border-[var(--brand)]/20 shadow-md cursor-pointer"
          >
            Start a builder community
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 relative z-10">
          {orgs.map((org) => (
            <Link key={org.id} href={`/org/${org.slug}`} className="premium-card p-6 flex flex-col group">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-g1 border border-g3 overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                  {org.logoUrl ? (
                    <img src={org.logoUrl} alt={org.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-g4 bg-g2">
                      <Building2 size={24} />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="serif text-2xl group-hover:text-[var(--brand)] transition-colors">{org.name}</h3>
                  <span className="mono text-[11px] text-g5 uppercase tracking-wider">{org.industry || "Ecosystem Hub"}</span>
                </div>
              </div>
              <div className="mt-8 flex items-center justify-between text-g5 text-[13px]">
                <div className="flex items-center gap-1.5">
                  <Users size={14} /> {org.members.length} members
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} /> {org.location || "Remote"}
                </div>
              </div>
            </Link>
          ))}
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
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-g4 text-xs font-mono">theconvoke.xyz/org/</span>
                    <input 
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                      placeholder="delhi-hacker-club"
                      className="w-full h-11 pl-[135px] pr-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none font-mono focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
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

                <div>
                  <label className="text-ink font-medium text-xs mb-1.5 block">Logo Image URL</label>
                  <input 
                    type="url"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://unsplash.com/... or direct image link"
                    className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                  />
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
