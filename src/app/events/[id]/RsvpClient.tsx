"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { rsvpToEvent } from "@/app/actions/workspace";
import { Check, Loader2, Users } from "lucide-react";

export function RsvpClient({ 
  eventId, 
  initialRegistered, 
  isFull,
  price,
  attendeesCount,
  capacity
}: { 
  eventId: string; 
  initialRegistered: boolean; 
  isFull: boolean;
  price: string;
  attendeesCount: number;
  capacity: number | null;
}) {
  const [registered, setRegistered] = useState(initialRegistered);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRsvp = async () => {
    setLoading(true);
    try {
      const res = await rsvpToEvent(eventId, "GOING");
      if (res.success) {
        setRegistered(true);
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Authentication required to RSVP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="premium-card p-6 shadow-2xl border-[var(--brand)]/20">
      <div className="flex items-center justify-between mb-6">
        <span className="serif text-2xl">{price}</span>
        <div className="flex items-center gap-1.5 text-[13px] text-[var(--brand)] font-medium bg-[var(--brand)]/10 px-2.5 py-1 rounded-md">
          <Users size={14} /> 
          <span>
            {attendeesCount} {capacity ? `/ ${capacity}` : "registered"}
          </span>
        </div>
      </div>
      
      {registered ? (
        <div className="w-full py-3.5 bg-[var(--brand)]/10 border border-[var(--brand)]/20 text-[var(--brand)] rounded-full text-[15px] font-medium flex items-center justify-center gap-2 shadow-sm">
          <Check size={16} />
          <span>You're attending</span>
        </div>
      ) : (
        <button 
          onClick={handleRsvp}
          disabled={loading || isFull}
          className={`w-full py-3.5 rounded-full text-[15px] font-medium transition-all shadow-lg flex items-center justify-center gap-2 ${
            isFull 
              ? "bg-g2 text-g5 cursor-not-allowed" 
              : "bg-[var(--brand)] text-white hover:opacity-90 hover:-translate-y-0.5 active:scale-95"
          }`}
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {isFull ? "Event Full" : "Register Now"}
        </button>
      )}
    </div>
  );
}
