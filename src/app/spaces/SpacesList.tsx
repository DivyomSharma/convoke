"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Hash, MessageCircle, Users, Plus, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createSpace } from "@/app/actions/workspace";

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
      <div className="flex items-end justify-between hairline-b pb-6 relative z-10">
        <div>
          <h1 className="serif text-5xl md:text-6xl tracking-tight">Spaces</h1>
          <p className="text-g5 mt-3 text-lg">Gather with your tribe. Discussion, voice, and collaboration.</p>
        </div>
        <button 
          onClick={() => setDrawerOpen(true)}
          className="flex items-center justify-center gap-2 bg-ink text-paper px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-ink-2 transition-all active:scale-95 border border-[var(--brand)]/25 shadow-md cursor-pointer"
        >
          <Plus size={16} />
          <span>Create Space</span>
        </button>
      </div>

      {spaces.length === 0 ? (
        <div className="py-32 text-center relative z-10 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center text-g5 mb-6">
            <Hash size={28} className="text-[var(--brand)]" />
          </div>
          <h3 className="serif text-3xl text-ink mb-2">No spaces yet</h3>
          <p className="text-g5 text-[15px] max-w-[40ch] leading-relaxed mb-8">
            Start a builder space.
          </p>
          <button 
            onClick={() => setDrawerOpen(true)}
            className="bg-ink text-paper px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-ink-2 transition-all active:scale-95 border border-[var(--brand)]/20 shadow-md cursor-pointer"
          >
            Create Space
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 relative z-10">
          {spaces.map((space) => (
            <Link key={space.id} href={`/spaces/${space.id}`} className="premium-card p-8 flex flex-col group">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-g1 flex items-center justify-center text-g5 group-hover:bg-[var(--brand)] group-hover:text-white transition-colors duration-300">
                  <Hash size={24} />
                </div>
                <div>
                  <h3 className="serif text-3xl group-hover:italic transition-all duration-300">{space.name}</h3>
                  <span className="mono text-[11px] text-[var(--brand)] uppercase tracking-wider">{space.organization.name}</span>
                </div>
              </div>
              <p className="text-g5 text-[15px] mt-4 leading-relaxed max-w-[50ch] flex-1">{space.description || "No description provided."}</p>
              
              <div className="mt-8 flex items-center gap-6 text-[13px] text-g6 border-t border-g3 pt-4">
                <div className="flex items-center gap-1.5"><Users size={16} className="text-g4" /> {space.organization.members.length} members</div>
                <div className="flex items-center gap-1.5"><MessageCircle size={16} className="text-g4" /> {space._count.messages} messages</div>
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
