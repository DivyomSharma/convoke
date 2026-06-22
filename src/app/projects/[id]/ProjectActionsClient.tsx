"use client";

import { Share2, Check } from "lucide-react";
import { useShare } from "@/hooks/useShare";

export function ProjectActionsClient({
  projectId
}: {
  projectId: string;
}) {
  const { share, copied } = useShare();

  const handleShare = () => {
    share("Check out this project on Convoke", window.location.href);
  };

  return (
    <button onClick={handleShare} className="w-10 h-10 flex items-center justify-center rounded-full border border-g3 text-g5 hover:text-ink hover:bg-g1 transition-colors shadow-sm">
      {copied ? <Check size={16} className="text-green-500" /> : <Share2 size={16} />}
    </button>
  );
}
