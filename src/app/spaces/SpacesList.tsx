"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Hash, MessageCircle, Users, Plus, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createSpace } from "@/app/actions/workspace";
import { getFallbackPhoto } from "@/lib/photos";
import { CardRing } from "@/components/ui/card-ring";
import { ImageUploadField } from "@/components/forms/ImageUploadField";

interface SpaceWithDetails {
  id: string;
  name: string;
  description: string | null;
  bannerUrl: string | null;
  organization: {
    name: string;
    members: any[];
  };
  _count: {
    messages: number;
  };
}

interface OrganizationOption {
  id: string;
  name: string;
}

export function SpacesList({ 
  initialSpaces, 
  organizations 
}: { 
  initialSpaces: SpaceWithDetails[];
  organizations: OrganizationOption[];
}) {
  const router = useRouter();
  const [spaces, setSpaces] = useState<SpaceWithDetails[]>(initialSpaces);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [name, setName] = useState("");
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id || "");
  const [description, setDescription] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerFileName, setBannerFileName] = useState("");
  const [rules, setRules] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !organizationId) {
      setError("Space name and organization are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await createSpace({
        name,
        organizationId,
        description: description || undefined,
        bannerUrl: bannerUrl || undefined,
        rules: rules || undefined,
      });

      if (res.success && res.space) {
        setDrawerOpen(false);
        setName("");
        setDescription("");
        setBannerUrl("");
        setBannerFileName("");
        setRules("");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Failed to create space.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-g3 pb-8 relative z-10">
        <div>
          <div className="mono text-[11px] tracking-[0.2em] uppercase text-g5">
            (02) Spaces & Circles
          </div>
          <h1 className="serif text-5xl md:text-7xl mt-4 tracking-tight">Communities</h1>
          <p className="text-g5 mt-4 text-[16px] max-w-[50ch] leading-relaxed">
            The rooms you didn't know you were missing. Weekly conversations and quarterly meetups.
          </p>
        </div>
        <button 
          onClick={() => setDrawerOpen(true)}
          className="ink-button px-5 text-[14px] font-medium flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus size={15} />
          <span>Create Space</span>
        </button>
      </div>

      {spaces.length === 0 ? (
        <div className="py-24 text-center relative z-10 flex flex-col items-center justify-center">
          <h3 className="serif text-4xl text-ink font-light">No communities active</h3>
          <p className="text-g5 text-[15px] max-w-[36ch] leading-relaxed mt-4 mb-8">
            Define the rhythm. Establish the first community space.
          </p>
          <button 
            onClick={() => setDrawerOpen(true)}
            className="ink-button px-5 text-[14px] font-medium cursor-pointer"
          >
            Create Space
          </button>
        </div>
      ) : (
        <div className="mt-12 flex flex-col gap-20 relative z-10">
          {spaces.map((space, index) => {
            const banner = space.bannerUrl || getFallbackPhoto(space.id, 'space');
            return (
              <div key={space.id} className="group grid gap-0 lg:grid-cols-12 lg:items-stretch premium-card campus-frame overflow-hidden relative border border-[#1a1a1a] hover:border-[#2f2f2f] transition-all duration-700 hover:-translate-y-[2px] ease-[cubic-bezier(0.22,0.61,0.36,1)]">
                {/* Space Card Ring */}
                <div className="absolute -right-[15%] top-1/2 -translate-y-1/2 opacity-8 group-hover:opacity-25 transition-opacity duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] hidden md:block">
                  <CardRing size={600} text="SPACE • CIRCLE • COMMUNITY • SPACE • " />
                </div>

                {/* Large Photography */}
                <div className="lg:col-span-5 relative z-10">
                  <Link href={`/spaces/${space.id}`} className="block overflow-hidden bg-g1 aspect-[3/2] h-full relative">
                    <img 
                      src={banner} 
                      alt={space.name} 
                      className="w-full h-full object-cover" 
                    />
                  </Link>
                </div>

                {/* Feature Content */}
                <div className="lg:col-span-7 flex flex-col justify-center p-6 md:p-10 relative z-10">
                  <div className="flex items-center gap-3 mono text-[11px] uppercase tracking-[0.25em] font-medium text-[var(--brand)] mb-4">
                    <span>(0{index + 1})</span>
                    <span>•</span>
                    <span>{space.organization.name}</span>
                  </div>

                  <Link href={`/spaces/${space.id}`} className="block mt-2">
                    <h3 className="serif text-4xl md:text-5xl leading-tight text-ink group-hover:text-g5 transition-colors font-light">
                      {space.name}
                    </h3>
                  </Link>

                  <p className="text-g5 text-[15px] mt-5 leading-[1.6] max-w-[48ch] font-sans">
                    {space.description || "A collaborative circle gathered on the Convoke digital campus."}
                  </p>

                  <div className="mt-8 flex items-center gap-6 text-[13px] font-sans text-g5">
                    <span>{space.organization.members.length} Builders</span>
                    <span>•</span>
                    <span>{space._count.messages} Dispatches</span>
                  </div>

                  <div className="mt-8">
                    <Link 
                      href={`/spaces/${space.id}`}
                      className="text-[13px] font-medium text-ink hover:underline underline-offset-4 inline-flex items-center gap-2"
                    >
                      <span>Build With Them</span>
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
                  <h2 className="serif text-2xl text-ink">New Builder Space</h2>
                  <p className="text-xs text-g5 mt-0.5">Build a channel for discussion and collab.</p>
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
                  <label className="text-ink font-medium text-xs mb-1.5 block">Space Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. #general, #ai-research"
                    className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="text-ink font-medium text-xs mb-1.5 block">Host Organization <span className="text-red-500">*</span></label>
                  {organizations.length === 0 ? (
                    <div className="text-xs text-amber-500 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                      You must create or join an organization first before you can launch a space.
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

                <ImageUploadField
                  label="Space banner"
                  value={bannerUrl}
                  fileName={bannerFileName}
                  onChange={setBannerUrl}
                  onFileNameChange={setBannerFileName}
                  onError={setError}
                />

                <div>
                  <label className="text-ink font-medium text-xs mb-1.5 block">Space Rules & Description</label>
                  <textarea 
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a brief description of the purpose of this space..."
                    className="w-full p-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="text-ink font-medium text-xs mb-1.5 block">Access Guidelines / Specific Rules</label>
                  <textarea 
                    rows={4}
                    value={rules}
                    onChange={(e) => setRules(e.target.value)}
                    placeholder="What are the rules of participation in this space?"
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
                  <span>Launch Space</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
