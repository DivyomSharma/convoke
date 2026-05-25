"use client";

import { useState, useTransition } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { joinCommunity } from "@/app/actions";
import { cn } from "@/lib/utils";

type JoinCommunityButtonProps = {
  communityId: string;
  initialJoined?: boolean;
  className?: string;
};

export function JoinCommunityButton({
  communityId,
  initialJoined = false,
  className,
}: JoinCommunityButtonProps) {
  const [joined, setJoined] = useState(initialJoined);
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={joined || isPending}
      onClick={() => {
        if (joined) return;
        startTransition(async () => {
          try {
            const result = await joinCommunity({ communityId });
            setJoined(result.joined);
          } catch {
            setJoined(false);
          }
        });
      }}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium transition duration-300",
        joined
          ? "border border-bronze/30 bg-bronze/20 text-bronze"
          : "bg-foreground text-background shadow-[0_0_36px_rgba(198,161,111,0.18)] hover:bg-bronze hover:text-black",
        className,
      )}
    >
      {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
      {!isPending && joined ? <Check className="size-4" /> : null}
      {!isPending && !joined ? <ArrowRight className="size-4" /> : null}
      <span>
        {isPending ? "Joining..." : joined ? "Joined" : "Join community"}
      </span>
    </button>
  );
}
