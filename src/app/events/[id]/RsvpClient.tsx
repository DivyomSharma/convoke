"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { rsvpToEvent } from "@/app/actions/workspace";
import { Check, Loader2, Users, AlertCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export function RsvpClient({ 
  eventId, 
  initialStatus, 
  isFull,
  price,
  attendeesCount,
  capacity,
  userId
}: { 
  eventId: string; 
  initialStatus: string | null; 
  isFull: boolean;
  price: string;
  attendeesCount: number;
  capacity: number | null;
  userId?: string;
}) {
  const [status, setStatus] = useState<string | null>(initialStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRsvp = async () => {
    if (!userId) {
      alert("Authentication required to register.");
      router.push("/auth");
      return;
    }
    
    setLoading(true);
    try {
      const res = await rsvpToEvent(eventId, "GOING");
      if (res.success) {
        setStatus(res.status || "GOING");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Failed to register.");
    } finally {
      setLoading(false);
    }
  };

  const getTicketUrl = () => {
    if (typeof window !== "undefined" && userId) {
      return `${window.location.origin}/events/${eventId}/scanner?u=${userId}`;
    }
    return "";
  };

  return (
    <div className="border border-g3 rounded-sm p-6 bg-paper-card">
      <div className="flex items-center justify-between mb-6">
        <span className="serif text-2xl font-light text-ink">{price}</span>
        <div className="flex items-center gap-1.5 text-[11px] mono uppercase tracking-wider text-brand">
          <Users size={12} /> 
          <span>
            {attendeesCount} {capacity ? `/ ${capacity}` : "registered"}
          </span>
        </div>
      </div>
      
      {status === "GOING" || status === "CHECKED_IN" ? (
        <div className="space-y-6">
          <div className="w-full py-3 bg-brand/10 border border-brand/20 text-brand rounded-sm text-[13px] mono uppercase tracking-wider flex items-center justify-center gap-2">
            <Check size={14} />
            <span>{status === "CHECKED_IN" ? "Checked In" : "You're attending"}</span>
          </div>

          {userId && (
            <div className="flex flex-col items-center justify-center p-4 border border-g3/60 rounded-sm bg-white text-black">
              <div className="mb-3 mono text-[9px] uppercase tracking-widest text-g5">Check-in Ticket Pass</div>
              <QRCodeSVG 
                value={getTicketUrl()}
                size={140}
                bgColor="#ffffff"
                fgColor="#000000"
                level="M"
              />
              <div className="mt-3 text-[10px] mono text-g4 uppercase">Scan at door to check in</div>
            </div>
          )}
        </div>
      ) : status === "WAITLISTED" ? (
        <div className="space-y-4">
          <div className="w-full py-3 bg-accent/15 border border-accent/30 text-accent rounded-sm text-[13px] mono uppercase tracking-wider flex items-center justify-center gap-2">
            <AlertCircle size={14} />
            <span>Waitlisted</span>
          </div>
          <p className="text-[13px] text-g5 text-center leading-relaxed">
            Capacity reached. Organizers will promote you if seats open.
          </p>
        </div>
      ) : (
        <button 
          onClick={handleRsvp}
          disabled={loading}
          className="w-full py-3 rounded-full text-[14px] font-medium transition-all flex items-center justify-center gap-2 bg-ink text-paper dark:bg-white dark:text-black hover:opacity-85 cursor-pointer"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {isFull ? "Join Waitlist" : "Register Now"}
        </button>
      )}
    </div>
  );
}
