"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trophy, Code, MapPin, Users, Plus, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createOpportunity } from "@/app/actions/workspace";

interface ChallengeWithDetails {
  id: string;
  title: string;
  type: string;
  description: string | null;
  location: string | null;
  compensation: string | null;
  deadline: Date | null;
  bannerUrl: string | null;
  organization: {
    name: string;
    logoUrl: string | null;
  };
  applications: any[];
}

interface OrganizationOption {
  id: string;
  name: string;
}

export function ChallengesList({ 
  initialChallenges, 
  organizations 
}: { 
  initialChallenges: ChallengeWithDetails[];
  organizations: OrganizationOption[];
}) {
  const router = useRouter();
  const [challenges, setChallenges] = useState<ChallengeWithDetails[]>(initialChallenges);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [type, setType] = useState("HACKATHON");
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id || "");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("ONLINE");
  const [compensation, setCompensation] = useState(""); // Prize pool
  const [bannerUrl, setBannerUrl] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !organizationId) {
      setError("Title and organization are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await createOpportunity({
        title,
        type, // HACKATHON or CHALLENGE
        organizationId,
        description: description || undefined,
        location: location || undefined,
        compensation: compensation || undefined, // maps to compensation field in Prisma
        bannerUrl: bannerUrl || undefined,
        deadline: deadline || undefined,
      });

      if (res.success && res.opportunity) {
        setDrawerOpen(false);
        setTitle("");
        setType("HACKATHON");
        setDescription("");
        setLocation("ONLINE");
        setCompensation("");
        setBannerUrl("");
        setDeadline("");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Failed to host challenge.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-end justify-between hairline-b pb-6 relative z-10">
        <div>
          <h1 className="serif text-5xl md:text-6xl tracking-tight">Challenges</h1>
          <p className="text-g5 mt-3 text-lg">Build the future. Win prizes. Push your limits.</p>
        </div>
        <button 
          onClick={() => setDrawerOpen(true)}
          className="flex items-center justify-center gap-2 bg-ink text-paper px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-ink-2 transition-all active:scale-95 border border-[var(--brand)]/25 cursor-pointer"
        >
          <Plus size={16} />
          <span>Host a Challenge</span>
        </button>
      </div>

      {challenges.length === 0 ? (
        <div className="py-32 text-center relative z-10 flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center text-g5 mb-6">
            <Trophy size={28} className="text-[var(--brand)]" />
          </div>
          <h3 className="serif text-3xl text-ink mb-2">No challenges open</h3>
          <p className="text-g5 text-[15px] max-w-[40ch] leading-relaxed mb-8">
            Host a challenge to gather campus builders.
          </p>
          <button 
            onClick={() => setDrawerOpen(true)}
            className="bg-ink text-paper px-6 py-2.5 rounded-full text-[14px] font-medium hover:bg-ink-2 transition-all active:scale-95 border border-[var(--brand)]/20 cursor-pointer"
          >
            Host Challenge
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 relative z-10">
          {challenges.map((challenge) => (
            <Link key={challenge.id} href={`/challenges/${challenge.id}`} className="premium-card overflow-hidden group flex flex-col">
              <div className="h-32 relative overflow-hidden bg-g1 flex items-center justify-center border-b border-g3">
                {challenge.bannerUrl ? (
                  <img src={challenge.bannerUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : challenge.organization.logoUrl ? (
                  <div className="w-16 h-16 rounded-md overflow-hidden border border-g3/80">
                    <img src={challenge.organization.logoUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <Code size={40} className="text-g3 group-hover:scale-110 transition-transform duration-500" />
                )}
                <div className="absolute top-4 right-4 bg-paper text-[var(--brand)] border border-[var(--brand)]/20 px-3 py-1 rounded-full text-[11px] font-medium uppercase tracking-wide shadow-sm">
                  {challenge.type}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="serif text-2xl group-hover:text-[var(--brand)] transition-colors">{challenge.title}</h3>
                <p className="text-g5 text-[14px] mt-1">by {challenge.organization.name}</p>
                
                <div className="mt-6 flex-1 flex flex-col justify-end gap-3 text-[13px] text-g6">
                  <div className="flex items-center gap-2">
                    <Trophy size={14} className="text-[var(--brand)]" /> 
                    <span className="font-medium text-ink">{challenge.compensation || "Awards & Prizes"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-g4" /> 
                    {challenge.applications.length} builders registered
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-g4" /> 
                    {challenge.location || "Online"} · {challenge.deadline ? new Date(challenge.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Ongoing"}
                  </div>
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
                  <h2 className="serif text-2xl text-ink">Host a Challenge</h2>
                  <p className="text-xs text-g5 mt-0.5">Publish a hackathon or technical building challenge.</p>
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
                  <label className="text-ink font-medium text-xs mb-1.5 block">Challenge Title <span className="text-red-500">*</span></label>
                  <input 
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="E.g. India Web3 Buildathon 2026"
                    className="w-full h-11 px-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Challenge Type <span className="text-red-500">*</span></label>
                    <select 
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full h-11 px-4 rounded-md border border-g3 bg-paper text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                    >
                      <option value="HACKATHON">Hackathon</option>
                      <option value="CHALLENGE">Technical Challenge</option>
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
                        className="w-full h-11 px-4 rounded-md border border-g3 bg-paper text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
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
                    <label className="text-ink font-medium text-xs mb-1.5 block">Awards & Prize Pool</label>
                    <input 
                      type="text"
                      value={compensation}
                      onChange={(e) => setCompensation(e.target.value)}
                      placeholder="E.g. $10,000 in grants"
                      className="w-full h-11 px-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Submission Deadline</label>
                    <input 
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full h-11 px-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
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
                      placeholder="E.g. Online, IIT Delhi"
                      className="w-full h-11 px-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-ink font-medium text-xs mb-1.5 block">Banner Image URL</label>
                    <input 
                      type="url"
                      value={bannerUrl}
                      onChange={(e) => setBannerUrl(e.target.value)}
                      placeholder="https://unsplash.com/... or direct image link"
                      className="w-full h-11 px-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-ink font-medium text-xs mb-1.5 block">Challenge Description & Rules</label>
                  <textarea 
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a detailed brief, track details, rules, judging criteria, and schedules..."
                    className="w-full p-4 rounded-md border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all resize-none"
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
                  className="flex-1 h-11 rounded-full bg-ink hover:opacity-95 text-paper text-xs font-semibold transition-all active:scale-98 flex items-center justify-center gap-2 border border-[var(--brand)]/20 cursor-pointer"
                >
                  {loading && <Loader2 size={14} className="animate-spin" />}
                  <span>Publish Challenge</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
