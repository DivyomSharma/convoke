"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { CheckCircle2, CircleDashed, Calendar, MapPin, Clock } from "lucide-react";
import { Avatar } from "./Avatar";

export type TicketState = "REGISTERED" | "CONFIRMED" | "WAITLISTED" | "CHECKED_IN";

interface DigitalPassProps {
  ticketId: string;
  eventName: string;
  orgName: string;
  date: string;
  time: string;
  venue: string;
  userName: string;
  userAvatar: string;
  seat: string;
  type: string;
  state: TicketState;
  bannerUrl?: string;
  orgLogo?: string;
}

export function DigitalPass({
  ticketId,
  eventName,
  orgName,
  date,
  time,
  venue,
  userName,
  userAvatar,
  seat,
  type,
  state,
  bannerUrl,
  orgLogo
}: DigitalPassProps) {
  
  // Status Colors
  const stateConfig = {
    REGISTERED: { color: "text-blue-500", bg: "bg-blue-500/10", icon: CircleDashed, label: "Registered" },
    CONFIRMED: { color: "text-green-500", bg: "bg-green-500/10", icon: CheckCircle2, label: "Confirmed" },
    WAITLISTED: { color: "text-orange-500", bg: "bg-orange-500/10", icon: CircleDashed, label: "Waitlisted" },
    CHECKED_IN: { color: "text-g5", bg: "bg-g2", icon: CheckCircle2, label: "Checked In" },
  };

  const { color, bg, icon: StatusIcon, label } = stateConfig[state] || stateConfig.REGISTERED;
  const qrPayload = JSON.stringify({ t: ticketId, e: eventName });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[400px] mx-auto bg-paper rounded-[24px] shadow-2xl border border-g3 overflow-hidden flex flex-col"
      style={{ boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
    >
      {/* Top Banner Section */}
      <div className="relative h-32 w-full bg-g1 flex-shrink-0">
        {bannerUrl ? (
          <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-90" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-g2 to-g1" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-paper to-transparent" />
        
        <div className="absolute top-4 right-4 bg-paper/80 backdrop-blur-md px-3 py-1 rounded-full border border-g3 flex items-center gap-1.5 shadow-sm">
          <StatusIcon size={14} className={color} />
          <span className="mono text-[11px] font-medium tracking-wider uppercase">{label}</span>
        </div>
      </div>

      {/* Identity Overlap */}
      <div className="px-6 relative -mt-6 flex justify-between items-end z-10 flex-shrink-0">
        <div className="w-14 h-14 rounded-xl bg-paper p-1 shadow-sm border border-g3">
          <div className="w-full h-full rounded-lg bg-g1 overflow-hidden">
            {orgLogo && <img src={orgLogo} alt={orgName} className="w-full h-full object-cover" />}
          </div>
        </div>
        <div className="flex flex-col items-end pb-1">
          <span className="mono text-[10px] text-g5 uppercase tracking-widest">{orgName}</span>
          <span className="mono text-[11px] font-medium text-ink bg-g1 px-2 py-0.5 rounded-sm mt-1">{type}</span>
        </div>
      </div>

      {/* Main Info */}
      <div className="px-6 pt-5 pb-6 flex-shrink-0">
        <h2 className="serif text-2xl leading-tight text-ink tracking-tight line-clamp-2">{eventName}</h2>
        
        <div className="mt-6 space-y-4">
          <div className="flex items-start gap-3">
            <Calendar size={16} className="text-g4 mt-0.5 shrink-0" />
            <div>
              <div className="text-[13px] font-medium text-ink">{date}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock size={16} className="text-g4 mt-0.5 shrink-0" />
            <div>
              <div className="text-[13px] font-medium text-ink">{time}</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={16} className="text-g4 mt-0.5 shrink-0" />
            <div>
              <div className="text-[13px] font-medium text-ink line-clamp-2">{venue}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tear Line */}
      <div className="relative w-full h-8 flex items-center flex-shrink-0">
        <div className="absolute -left-4 w-8 h-8 rounded-full bg-g1 border-r border-g3" style={{ background: 'var(--background)' }} />
        <div className="w-full border-t-2 border-dashed border-g2 mx-4" />
        <div className="absolute -right-4 w-8 h-8 rounded-full bg-g1 border-l border-g3" style={{ background: 'var(--background)' }} />
      </div>

      {/* Ticket Meta & QR */}
      <div className="px-6 pt-4 pb-8 bg-paper flex-shrink-0 flex items-center justify-between">
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-[10px] mono text-g5 uppercase tracking-widest mb-1">Attendee</div>
            <div className="flex items-center gap-2">
              <Avatar src={userAvatar} name={userName} size={24} />
              <div className="text-[14px] font-medium text-ink">{userName}</div>
            </div>
          </div>
          
          <div className="flex gap-6 mt-2">
            <div>
              <div className="text-[10px] mono text-g5 uppercase tracking-widest mb-1">Seat</div>
              <div className="text-[15px] serif text-ink">{seat}</div>
            </div>
            <div>
              <div className="text-[10px] mono text-g5 uppercase tracking-widest mb-1">Ticket ID</div>
              <div className="text-[13px] mono text-ink uppercase">{ticketId.substring(0, 8)}</div>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="p-2 bg-white rounded-xl border border-g2 shadow-sm shrink-0">
          <QRCodeSVG 
            value={qrPayload} 
            size={80}
            level="H"
            includeMargin={false}
            fgColor="#000000"
            bgColor="#ffffff"
          />
        </div>
      </div>
    </motion.div>
  );
}
