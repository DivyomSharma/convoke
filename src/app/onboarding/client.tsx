"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { UserRole } from "@prisma/client";
import { completeOnboarding, extractProfileAI } from "@/app/actions/onboarding";
import { Button } from "@/components/ui/button";

export function OnboardingClient({ user }: { user: any }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resumeText, setResumeText] = useState("");
  
  const [formData, setFormData] = useState({
    displayName: user.displayName || "",
    username: user.username || "",
    headline: user.headline || "",
    role: "STUDENT" as UserRole,
    interests: [] as string[],
    skills: [] as string[],
    bio: user.bio || "",
    tags: [] as string[],
  });

  const handleAIParse = async () => {
    if (!resumeText) return;
    setLoading(true);
    try {
      const extracted = await extractProfileAI(resumeText);
      setFormData(prev => ({
        ...prev,
        ...extracted,
      }));
      setStep(3);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await completeOnboarding(formData);
      router.push("/workspace");
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030304] text-foreground flex flex-col items-center justify-center p-5">
      <div className="w-full max-w-xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight">Welcome to Convoke</div>
          <div className="text-sm text-muted">Step {step} of 3</div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 bg-surface p-8 rounded-2xl border border-line"
            >
              <div>
                <h2 className="text-xl font-semibold">Basic Identity</h2>
                <p className="text-sm text-muted mt-1">How you'll appear in the ecosystem.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Display Name</label>
                  <input 
                    type="text" 
                    value={formData.displayName}
                    onChange={e => setFormData({...formData, displayName: e.target.value})}
                    className="w-full mt-1.5 bg-black/50 border border-line rounded-lg px-4 py-2.5 text-sm outline-none focus:border-bronze transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Username</label>
                  <input 
                    type="text" 
                    value={formData.username}
                    onChange={e => setFormData({...formData, username: e.target.value})}
                    className="w-full mt-1.5 bg-black/50 border border-line rounded-lg px-4 py-2.5 text-sm outline-none focus:border-bronze transition"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Headline</label>
                  <input 
                    type="text" 
                    value={formData.headline}
                    onChange={e => setFormData({...formData, headline: e.target.value})}
                    placeholder="e.g. Building startup ecosystems"
                    className="w-full mt-1.5 bg-black/50 border border-line rounded-lg px-4 py-2.5 text-sm outline-none focus:border-bronze transition"
                  />
                </div>
              </div>
              <Button onClick={() => setStep(2)} className="w-full">Continue</Button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 bg-surface p-8 rounded-2xl border border-line"
            >
              <div>
                <h2 className="text-xl font-semibold">Profile Enrichment</h2>
                <p className="text-sm text-muted mt-1">Paste your LinkedIn about/experience or resume text to let AI build your profile.</p>
              </div>
              <textarea 
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                placeholder="Paste LinkedIn experience or resume text here..."
                className="w-full h-40 bg-black/50 border border-line rounded-lg px-4 py-3 text-sm outline-none focus:border-bronze transition resize-none"
              />
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep(3)} className="flex-1">Skip</Button>
                <Button onClick={handleAIParse} disabled={!resumeText || loading} className="flex-1">
                  {loading ? "Parsing..." : "Auto-generate"}
                </Button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 bg-surface p-8 rounded-2xl border border-line"
            >
              <div>
                <h2 className="text-xl font-semibold">Role Selection</h2>
                <p className="text-sm text-muted mt-1">What brings you to Convoke?</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {["STUDENT", "ORGANIZER", "FOUNDER", "CREATOR", "VOLUNTEER", "DEVELOPER", "DESIGNER"].map(role => (
                  <button
                    key={role}
                    onClick={() => setFormData({...formData, role: role as UserRole})}
                    className={`px-4 py-3 rounded-xl border text-sm font-medium transition ${formData.role === role ? 'border-bronze bg-bronze/10 text-bronze' : 'border-line bg-black/30 hover:border-bronze/50'}`}
                  >
                    {role.charAt(0) + role.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
              <Button onClick={handleComplete} disabled={loading} className="w-full">
                {loading ? "Setting up..." : "Enter Workspace"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
