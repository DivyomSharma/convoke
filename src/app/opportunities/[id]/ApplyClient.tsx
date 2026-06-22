"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { applyToOpportunity } from "@/app/actions/workspace";
import { toggleBookmark } from "@/app/actions/bookmark";
import { useShare } from "@/hooks/useShare";
import { Check, Loader2, Bookmark, Share2, X, Briefcase, FileText } from "lucide-react";

export function ApplyClient({ 
  opportunityId, 
  initialApplied,
  initialBookmarked,
  deadlineStr,
  type
}: { 
  opportunityId: string; 
  initialApplied: boolean;
  initialBookmarked: boolean;
  deadlineStr: string;
  type: string;
}) {
  const [applied, setApplied] = useState(initialApplied);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pitch, setPitch] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const { share, copied } = useShare();

  const handleApplyClick = () => {
    if (!isSignedIn) {
      router.push("/auth");
      return;
    }
    setModalOpen(true);
  };

  const submitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) return;

    setLoading(true);
    try {
      const res = await applyToOpportunity({ opportunityId, pitch, resumeUrl });
      if (res.success) {
        setApplied(true);
        setModalOpen(false);
        router.refresh();
      } else {
        alert(res.error || "Failed to apply right now.");
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Unable to apply right now.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    try {
      setBookmarked(!bookmarked);
      await toggleBookmark(opportunityId, "OPPORTUNITY");
    } catch (err) {
      setBookmarked(bookmarked);
      alert("Authentication required to bookmark.");
    }
  };

  const handleShare = () => {
    share("Check out this opportunity on Convoke", window.location.href);
  };

  const ctaText = type === "GRANT" ? "Apply for Grant" : 
                 type === "FELLOWSHIP" ? "Apply for Fellowship" : 
                 "Submit Application";

  return (
    <>
      <div className="premium-card p-6 shadow-2xl border-[var(--brand)]/20">
        <div className="mb-6">
          <span className="mono text-[11px] uppercase tracking-wider text-g5 font-medium">Application Deadline</span>
          <div className="serif text-2xl mt-1 text-ink">{deadlineStr}</div>
        </div>
        
        {applied ? (
          <div className="w-full py-3.5 bg-[var(--brand)]/10 border border-[var(--brand)]/20 text-[var(--brand)] rounded-full text-[15px] font-medium flex items-center justify-center gap-2 shadow-sm">
            <Check size={16} />
            <span>Applied Successfully</span>
          </div>
        ) : (
          <button 
            onClick={handleApplyClick}
            disabled={loading}
            className="w-full py-3.5 bg-[var(--brand)] text-white rounded-full text-[15px] font-medium transition-all shadow-lg flex items-center justify-center gap-2 hover:opacity-90 hover:-translate-y-0.5 active:scale-95"
          >
            <span>{ctaText}</span>
          </button>
        )}

        <div className="mt-4 flex items-center justify-center gap-4 border-t border-g3 pt-4">
          <button onClick={handleShare} className="flex items-center gap-2 text-[13px] text-g5 hover:text-ink transition-colors">
            {copied ? <Check size={14} className="text-green-500" /> : <Share2 size={14} />} 
            {copied ? "Copied" : "Share"}
          </button>
          <button onClick={handleBookmark} className={`flex items-center gap-2 text-[13px] transition-colors ${bookmarked ? "text-[var(--brand)]" : "text-g5 hover:text-ink"}`}>
            <Bookmark size={14} fill={bookmarked ? "currentColor" : "none"} /> 
            {bookmarked ? "Saved" : "Watchlist"}
          </button>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-[600px] overflow-hidden rounded-[24px] border border-g3 bg-paper shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-g3 px-6 py-4 bg-paper-card">
              <div className="flex items-center gap-2">
                <Briefcase size={18} className="text-[var(--brand)]" />
                <span className="serif text-xl">Apply Studio</span>
              </div>
              <button onClick={() => setModalOpen(false)} className="text-g4 hover:text-ink transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={submitApplication} className="p-6">
              <div className="mb-6 flex items-center gap-4 rounded-xl border border-g3 bg-g1/30 p-4">
                <img src={user?.imageUrl} alt="" className="h-12 w-12 rounded-full object-cover border border-g3" />
                <div>
                  <div className="font-medium text-ink text-[15px]">{user?.fullName}</div>
                  <div className="text-[13px] text-g5 font-mono">Profile will be attached automatically</div>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-[13px] font-medium text-ink">Why are you a good fit? (Pitch)</label>
                  <textarea
                    value={pitch}
                    onChange={(e) => setPitch(e.target.value)}
                    placeholder="Tell the organization why they should pick you in 2-3 sentences..."
                    className="w-full rounded-xl border border-g3 bg-transparent px-4 py-3 text-[14px] outline-none transition-colors focus:border-[var(--brand)] min-h-[100px] resize-y"
                    required
                  />
                </div>
                
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-[13px] font-medium text-ink">
                    <FileText size={14} /> Resume URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    placeholder="https://your-drive-link-or-portfolio"
                    className="w-full rounded-xl border border-g3 bg-transparent px-4 py-3 text-[14px] outline-none transition-colors focus:border-[var(--brand)]"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 border-t border-g3 pt-5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full px-5 py-2.5 text-[14px] font-medium text-g5 hover:bg-g1 hover:text-ink transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-full bg-[var(--brand)] px-6 py-2.5 text-[14px] font-medium text-white transition-transform hover:-translate-y-0.5 shadow-md active:scale-95 disabled:opacity-70 disabled:cursor-wait"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  <span>Submit Application</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
