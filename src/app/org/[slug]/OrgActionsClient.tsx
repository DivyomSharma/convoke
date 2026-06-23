"use client";

import { useState } from "react";
import { Share, Bookmark, Check } from "lucide-react";
import { useShare } from "@/hooks/useShare";
import { toggleBookmark } from "@/app/actions/bookmark";
import { useRouter } from "next/navigation";
import { FollowButton } from "@/components/FollowButton";

export function OrgActionsClient({ 
  orgId, 
  initialBookmarked,
  initialFollowing,
  isMember
}: { 
  orgId: string; 
  initialBookmarked: boolean;
  initialFollowing: boolean;
  isMember: boolean;
}) {
  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const { share, copied } = useShare();
  const router = useRouter();

  const handleShare = () => {
    share("Check out this organization on Convoke", window.location.href);
  };

  const handleBookmark = async () => {
    try {
      setBookmarked(!bookmarked);
      await toggleBookmark(orgId, "ORGANIZATION");
    } catch (err) {
      setBookmarked(bookmarked);
      alert("Authentication required to bookmark.");
    }
  };

  return (
    <div className="flex items-center gap-3 pb-2">
      <button onClick={handleShare} className="w-10 h-10 flex items-center justify-center rounded-full border border-g3 text-g5 hover:text-ink hover:bg-g1 transition-colors shadow-sm">
        {copied ? <Check size={16} className="text-green-500" /> : <Share size={16} />}
      </button>
      <button onClick={handleBookmark} className={`w-10 h-10 flex items-center justify-center rounded-full border border-g3 transition-colors shadow-sm ${bookmarked ? "text-[var(--brand)] bg-[var(--brand)]/10 border-[var(--brand)]/20" : "text-g5 hover:text-ink hover:bg-g1"}`}>
        <Bookmark size={16} fill={bookmarked ? "currentColor" : "none"} />
      </button>
      <FollowButton 
        targetId={orgId} 
        targetType="ORGANIZATION" 
        initialFollowing={initialFollowing} 
        className="py-2.5 px-6 rounded-full"
      />
      {isMember ? (
        <button disabled className="bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]/20 px-8 py-2.5 rounded-full text-[14px] font-medium flex items-center gap-2">
          <Check size={16} /> Member
        </button>
      ) : (
        <button onClick={() => router.push(`/spaces`)} className="bg-ink text-paper px-8 py-2.5 rounded-full text-[14px] font-medium hover:bg-ink-2 transition-all active:scale-95 border border-[var(--brand)]/20">
          Explore Spaces
        </button>
      )}
    </div>
  );
}
