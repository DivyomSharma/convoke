"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { applyToOpportunity } from "@/app/actions/workspace";
import { Check, Loader2, Bookmark, Share2 } from "lucide-react";

export function ApplyClient({ 
  opportunityId, 
  initialApplied,
  deadlineStr
}: { 
  opportunityId: string; 
  initialApplied: boolean;
  deadlineStr: string;
}) {
  const [applied, setApplied] = useState(initialApplied);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleApply = async () => {
    setLoading(true);
    try {
      const res = await applyToOpportunity(opportunityId);
      if (res.success) {
        setApplied(true);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Authentication required to apply.");
    } finally {
      setLoading(false);
    }
  };

  return (
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
          onClick={handleApply}
          disabled={loading}
          className="w-full py-3.5 bg-[var(--brand)] text-white rounded-full text-[15px] font-medium transition-all shadow-lg flex items-center justify-center gap-2 hover:opacity-90 hover:-translate-y-0.5 active:scale-95"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          <span>Apply Now</span>
        </button>
      )}

      <div className="mt-4 flex items-center justify-center gap-4 border-t border-g3 pt-4">
        <button className="flex items-center gap-2 text-[13px] text-g5 hover:text-ink transition-colors">
          <Share2 size={14} /> Share
        </button>
        <button className="flex items-center gap-2 text-[13px] text-g5 hover:text-ink transition-colors">
          <Bookmark size={14} /> Bookmark
        </button>
      </div>
    </div>
  );
}
