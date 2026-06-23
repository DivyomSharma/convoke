"use client";

import { useState } from "react";
import { UserPlus, UserCheck } from "lucide-react";
import { toggleFollow } from "@/app/actions/follow";
import { usePathname } from "next/navigation";

export function FollowButton({
  targetId,
  targetType,
  initialFollowing,
  className = "",
}: {
  targetId: string;
  targetType: "USER" | "SPACE" | "ORGANIZATION" | "PROJECT" | "RESEARCH";
  initialFollowing: boolean;
  className?: string;
}) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  const handleToggle = async () => {
    setIsLoading(true);
    const result = await toggleFollow(targetId, targetType, pathname);
    if (result.success) {
      setIsFollowing(result.isFollowing!);
    } else {
      alert(result.error);
    }
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors ${
        isFollowing
          ? "bg-g2 text-ink border border-g3 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30 group"
          : "bg-ink text-paper hover:bg-ink-2"
      } ${className}`}
    >
      {isFollowing ? (
        <>
          <UserCheck size={16} className="group-hover:hidden" />
          <span className="group-hover:hidden">Following</span>
          <span className="hidden group-hover:inline">Unfollow</span>
        </>
      ) : (
        <>
          <UserPlus size={16} />
          Follow
        </>
      )}
    </button>
  );
}
