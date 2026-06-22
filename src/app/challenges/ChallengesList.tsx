"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trophy, Code, MapPin, Users, Plus, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createOpportunity } from "@/app/actions/workspace";
import { CardRing } from "@/components/ui/card-ring";
import { ImageUploadField } from "@/components/forms/ImageUploadField";
import { FileUploadField } from "@/components/forms/FileUploadField";

import { LocationAutocomplete } from "@/components/forms/LocationAutocomplete";

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
  const [discord, setDiscord] = useState("");
  const [instagram, setInstagram] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [twitter, setTwitter] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [mode, setMode] = useState("ONLINE");
  const [brochureUrl, setBrochureUrl] = useState("");
  const [brochureFileName, setBrochureFileName] = useState("");
  const [currentTab, setCurrentTab] = useState(0);
  const TABS = ["Basic Info", "Details", "Links"];

  // Form states
  const [title, setTitle] = useState("");
  const [type, setType] = useState("HACKATHON");
  const [organizationId, setOrganizationId] = useState(organizations[0]?.id || "");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("ONLINE");
  const [compensation, setCompensation] = useState(""); // Prize pool
  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerFileName, setBannerFileName] = useState("");
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
      discord: discord || undefined,
        instagram: instagram || undefined,
        whatsapp: whatsapp || undefined,
        twitter: twitter || undefined,
        linkedin: linkedin || undefined,
        mode: mode || undefined,
        brochureUrl: brochureUrl || undefined,
        });

      if (res.success && res.opportunity) {
        setDrawerOpen(false);
        setTitle("");
        setType("HACKATHON");
        setDescription("");
        setLocation("ONLINE");
        setCompensation("");
        setBannerUrl("");
        setBannerFileName("");
        setBrochureUrl("");
        setBrochureFileName("");
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
            Host a challenge to gather builders in the network.
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
            <Link key={challenge.id} href={`/challenges/${challenge.id}`} className="premium-card campus-frame overflow-hidden group flex flex-col relative border border-[#1a1a1a] hover:border-[#2f2f2f] transition-all duration-700 hover:-translate-y-[2px] ease-[cubic-bezier(0.22,0.61,0.36,1)]">
              {/* Challenge Card Ring */}
              <div className="absolute -right-[15%] top-1/2 -translate-y-1/2 opacity-8 group-hover:opacity-25 transition-opacity duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] hidden md:block z-0 pointer-events-none">
                <CardRing size={400} text="CHALLENGE • HACKATHON • CHALLENGE • " />
              </div>

              <div className="h-36 relative overflow-hidden bg-g1 flex items-center justify-center border-b border-g3 z-10">
                {challenge.bannerUrl ? (
                  <img src={challenge.bannerUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                ) : challenge.organization.logoUrl ? (
                  <div className="w-16 h-16 rounded-sm overflow-hidden border border-g3/80">
                    <img src={challenge.organization.logoUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <Code size={40} className="text-g3 group-hover:scale-110 transition-transform duration-500" />
                )}
                <div className="absolute top-4 right-4 bg-paper text-[var(--brand)] border border-[var(--brand)]/20 px-3 py-1 rounded-sm text-[10px] font-medium uppercase tracking-widest shadow-sm">
                  {challenge.type}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col z-10 relative">
                <h3 className="serif text-2xl group-hover:text-[var(--brand)] transition-colors font-light leading-tight">{challenge.title}</h3>
                <p className="text-g5 text-[13px] mt-2 font-sans">by {challenge.organization.name}</p>
                
                <div className="mt-8 flex-1 flex flex-col justify-end gap-3.5 text-[13px] text-g6 font-sans">
                  <div className="flex items-center gap-2.5">
                    <Trophy size={14} className="text-[var(--brand)]" /> 
                    <span className="font-medium text-ink">{challenge.compensation || "Awards & Prizes"}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Users size={14} className="text-g5" /> 
                    {challenge.applications.length} builders registered
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin size={14} className="text-g5" /> 
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
              <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                <div className="flex border-b border-g3/60 px-6 shrink-0">
                  {TABS.map((tab, idx) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setCurrentTab(idx)}
                      className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${currentTab === idx ? "border-brand text-ink" : "border-transparent text-g5 hover:text-ink hover:border-g3"}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-6">
                  {currentTab === 0 && (
                    <div className="space-y-5">
                      {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center">
                          {error}
                        </div>
                      )}

                      <div>
                        <label className="text-ink font-medium text-xs mb-1.5 block">Challenge Name <span className="text-red-500">*</span></label>
                        <input 
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="E.g. AI for Healthcare Hackathon"
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
                            <option value="HACKATHON">Hackathon</option>
                            <option value="IDEATHON">Ideathon</option>
                            <option value="CASE_STUDY">Case Study</option>
                            <option value="QUIZ">Quiz</option>
                            <option value="CODING_CHALLENGE">Coding Challenge</option>
                            <option value="HIRING_CHALLENGE">Hiring Challenge</option>
                            <option value="TREASURE_HUNT">Treasure Hunt</option>
                            <option value="BUSINESS_PITCH">Business Pitch</option>
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
                      
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <ImageUploadField
                          label="Challenge cover"
                          value={bannerUrl}
                          fileName={bannerFileName}
                          onChange={setBannerUrl}
                          onFileNameChange={setBannerFileName}
                          onError={setError}
                        />
                        <FileUploadField
                          label="Challenge Brochure (PDF)"
                          value={brochureUrl}
                          fileName={brochureFileName}
                          onChange={setBrochureUrl}
                          onFileNameChange={setBrochureFileName}
                          onError={setError}
                        />
                      </div>
                    </div>
                  )}

                  {currentTab === 1 && (
                    <div className="space-y-5 max-w-2xl mx-auto w-full">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-ink font-medium text-xs mb-1.5 block">Awards & Prize Pool</label>
                          <input 
                            type="text"
                            value={compensation}
                            onChange={(e) => setCompensation(e.target.value)}
                            placeholder="E.g. $10,000 in grants"
                            className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-ink font-medium text-xs mb-1.5 block">Submission Deadline</label>
                          <input 
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="text-ink font-medium text-xs mb-1.5 block">Mode</label>
                          <select 
                            value={mode}
                            onChange={(e) => setMode(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border border-g3 bg-paper text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                          >
                            <option value="ONLINE">Online</option>
                            <option value="OFFLINE">Offline</option>
                            <option value="HYBRID">Hybrid</option>
                          </select>
                        </div>
                        {mode !== "ONLINE" && (
                          <div>
                            <label className="text-ink font-medium text-xs mb-1.5 block">Location</label>
                            <LocationAutocomplete 
                              value={location}
                              onChange={(val) => setLocation(val)}
                              className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-ink font-medium text-xs mb-1.5 block">Challenge Description & Rules</label>
                        <textarea 
                          rows={6}
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Provide a detailed brief, track details, rules, judging criteria, and schedules..."
                          className="w-full p-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {currentTab === 2 && (
                    <div className="space-y-4 max-w-2xl mx-auto w-full">
                      <div>
                        <label className="text-ink font-medium text-xs mb-1.5 block">Discord</label>
                        <input type="text" value={discord} onChange={(e) => setDiscord(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all" placeholder="https://discord.gg/..." />
                      </div>
                      <div>
                        <label className="text-ink font-medium text-xs mb-1.5 block">Instagram</label>
                        <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all" placeholder="https://instagram.com/..." />
                      </div>
                      <div>
                        <label className="text-ink font-medium text-xs mb-1.5 block">WhatsApp Group</label>
                        <input type="text" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all" placeholder="https://chat.whatsapp.com/..." />
                      </div>
                      <div>
                        <label className="text-ink font-medium text-xs mb-1.5 block">Twitter</label>
                        <input type="text" value={twitter} onChange={(e) => setTwitter(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all" placeholder="https://twitter.com/..." />
                      </div>
                      <div>
                        <label className="text-ink font-medium text-xs mb-1.5 block">LinkedIn</label>
                        <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="w-full h-11 px-4 rounded-xl border border-g3 bg-transparent text-sm text-ink outline-none focus:border-[var(--brand)]/55 focus:ring-1 focus:ring-[var(--brand)]/20 transition-all" placeholder="https://linkedin.com/in/..." />
                      </div>
                    </div>
                  )}
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
