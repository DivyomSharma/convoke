"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { updateIntroRequestStatus } from "@/app/actions/intros";

export function IntroResponseClient({ requestId }: { requestId: string }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpdate = async (status: "ACCEPTED" | "DECLINED") => {
    setIsProcessing(true);
    try {
      await updateIntroRequestStatus(requestId, status);
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => handleUpdate("ACCEPTED")}
        disabled={isProcessing}
        className="ink-button px-4 py-1.5 text-[12px] font-medium flex items-center gap-1.5"
      >
        <CheckCircle2 size={14} /> Accept & Intro
      </button>
      <button 
        onClick={() => handleUpdate("DECLINED")}
        disabled={isProcessing}
        className="text-[12px] font-medium text-red-500 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
      >
        <XCircle size={14} /> Decline
      </button>
    </>
  );
}
