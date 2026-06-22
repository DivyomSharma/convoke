"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { applyToOpportunity } from "@/app/actions/workspace";
import { toggleBookmark } from "@/app/actions/bookmark";
import { useShare } from "@/hooks/useShare";
import { Check, Loader2, Bookmark, Share2 } from "lucide-react";

export function RegisterClient({ 
  challengeId, 
  initialRegistered,
  initialBookmarked,
  deadlineStr
}: { 
  challengeId: string; 
  initialRegistered: boolean;
  initialBookmarked: boolean;
  deadlineStr: string;
}) {
  const [registered, setRegistered] = useState(initialRegistered);
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { share, copied } = useShare();

  const handleRegister = async () => {
    setLoading(true);
    try {
      const res = await applyToOpportunity({ opportunityId: challengeId });
      if (res.success) {
        setRegistered(true);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Authentication required to register.");
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    try {
      // Optimistic update
      setBookmarked(!bookmarked);
      await toggleBookmark(challengeId, "OPPORTUNITY");
    } catch (err) {
      setBookmarked(bookmarked);
      alert("Authentication required to bookmark.");
    }
  };

  const handleShare = () => {
    share("Check out this challenge on Convoke", window.location.href);
  };

  return (
    <div className="premium-card p-6 shadow-2xl border-[var(--brand)]/20">
      <div className="mb-6">
        <span className="mono text-[11px] uppercase tracking-wider text-g5 font-medium">Registration Deadline</span>
        <div className="serif text-2xl mt-1 text-ink">{deadlineStr}</div>
      </div>
      
      {registered ? (
        <div className="w-full py-3.5 bg-[var(--brand)]/10 border border-[var(--brand)]/20 text-[var(--brand)] rounded-full text-[15px] font-medium flex items-center justify-center gap-2 shadow-sm">
          <Check size={16} />
          <span>Registered</span>
        </div>
      ) : (
        <button 
          onClick={handleRegister}
          disabled={loading}
          className="w-full py-3.5 bg-[var(--brand)] text-white rounded-full text-[15px] font-medium transition-all shadow-lg flex items-center justify-center gap-2 hover:opacity-90 hover:-translate-y-0.5 active:scale-95"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          <span>Register for Challenge</span>
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
  );
}
