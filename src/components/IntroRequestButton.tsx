"use client";

import { useState } from "react";
import { Handshake, X } from "lucide-react";
import { requestIntroduction } from "@/app/actions/intros";

export function IntroRequestButton({ targetId, disabled = false }: { targetId: string, disabled?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(disabled);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    try {
      await requestIntroduction(targetId, reason);
      setIsSuccess(true);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to request intro");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <button disabled className="rounded-full px-4 py-1.5 text-[13px] font-medium bg-g2 text-g5 border border-g3 flex items-center gap-1.5">
        <Handshake size={14} /> Requested
      </button>
    );
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="rounded-full px-4 py-1.5 text-[13px] font-medium transition-colors bg-brand/10 text-brand border border-brand/20 hover:bg-brand/20 flex items-center gap-1.5"
      >
        <Handshake size={14} /> Request Intro
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm p-4">
          <div className="bg-paper-card border border-g3 rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-g3 flex items-center justify-between bg-g1/30">
              <h3 className="font-semibold text-ink flex items-center gap-2">
                <Handshake size={16} className="text-brand" /> Request Warm Intro
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-g5 hover:text-ink transition-colors">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6">
              <p className="text-[13px] text-g5 mb-4">
                Send a brief message explaining why you'd like to connect. Be respectful of their time.
              </p>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Hi, I'm working on something similar and would love to chat..."
                className="w-full bg-g1 border border-g3 rounded-lg px-3 py-2 text-[14px] text-ink outline-none focus:border-brand/50 resize-none h-24 mb-4"
                required
              />
              <div className="flex items-center justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsOpen(false)}
                  className="text-[13px] font-medium text-g6 hover:text-ink transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting || !reason.trim()}
                  className="ink-button px-5 py-2 text-[13px] font-medium rounded-lg"
                >
                  {isSubmitting ? "Sending..." : "Send Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
