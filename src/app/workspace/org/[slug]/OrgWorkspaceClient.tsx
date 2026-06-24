"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Megaphone, Mic2, Handshake, Plus, Search, CheckCircle2, XCircle, ArrowUpRight, Settings } from "lucide-react";
import { updateSponsorshipRequestStatus } from "@/app/actions/sponsorship";
import { Avatar } from "@/components/Avatar";

type Props = {
  organization: any;
  sponsorshipRequests: any[];
};

export function OrgWorkspaceClient({ organization, sponsorshipRequests }: Props) {
  const [activeTab, setActiveTab] = useState("sponsors");
  const [isProcessing, setIsProcessing] = useState(false);

  const operations = [
    { id: "crm", icon: <Users size={16} />, label: "People CRM", desc: "Members, Leads, Mentors" },
    { id: "outreach", icon: <Megaphone size={16} />, label: "Outreach", desc: "Cold DMs & Comm" },
    { id: "speakers", icon: <Mic2 size={16} />, label: "Speakers", desc: "Session management" },
    { id: "sponsors", icon: <Handshake size={16} />, label: "Sponsorships", desc: "Partner pipeline" },
  ];

  const handleUpdateStatus = async (id: string, status: string) => {
    setIsProcessing(true);
    await updateSponsorshipRequestStatus(id, status);
    setIsProcessing(false);
  };

  const pendingRequests = sponsorshipRequests.filter((r) => r.status === "PENDING" || r.status === "DRAFT");
  const activeRequests = sponsorshipRequests.filter((r) => r.status === "APPROVED");

  return (
    <div className="premium-card p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="serif text-2xl text-ink">Operations HQ</h2>
          <p className="mt-1 text-[13px] text-g5">Manage your entire ecosystem from one place.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-g4" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="h-9 w-64 rounded-full border border-g3 bg-g1/30 pl-9 pr-4 text-[13px] text-ink placeholder:text-g4 outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/50 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {operations.map(op => (
          <button 
            key={op.id} 
            onClick={() => setActiveTab(op.id)}
            className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
              activeTab === op.id 
                ? "border-brand/30 bg-brand/5 shadow-[0_0_15px_rgba(var(--brand-rgb),0.05)]" 
                : "border-g3/60 bg-paper-elevated/30 hover:border-g4 hover:bg-paper-card"
            }`}
          >
            <div className={`mt-0.5 rounded-lg p-2 ${activeTab === op.id ? "bg-brand/10 text-brand" : "bg-g2 text-g5"}`}>
              {op.icon}
            </div>
            <div>
              <div className={`font-semibold text-[14px] ${activeTab === op.id ? "text-brand" : "text-ink"}`}>
                {op.label}
              </div>
              <div className="mt-1 text-[12px] text-g5">{op.desc}</div>
            </div>
          </button>
        ))}
      </div>

      {activeTab === "sponsors" && (
        <div className="rounded-xl border border-g3 bg-paper-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-g3 bg-g1/30 px-4 py-3">
            <div className="flex items-center gap-4">
              <span className="text-[13px] font-medium text-ink">Inbox ({pendingRequests.length})</span>
              <span className="text-[13px] font-medium text-g5 hover:text-ink cursor-pointer">Active Partners ({activeRequests.length})</span>
            </div>
          </div>
          
          <div className="p-0">
            {pendingRequests.length === 0 ? (
              <div className="p-8 text-center">
                <Handshake size={32} className="mx-auto text-g4 mb-3" />
                <h3 className="text-[14px] font-medium text-ink">Sponsorship Inbox</h3>
                <p className="mt-1 max-w-md mx-auto text-[13px] text-g5 leading-relaxed">
                  When communities request sponsorship from {organization.name}, they will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-g3">
                {pendingRequests.map(req => (
                  <div key={req.id} className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-6 hover:bg-g1/10 transition-colors">
                    <div className="flex items-start gap-4">
                      {req.meet?.bannerUrl ? (
                        <img src={req.meet.bannerUrl} alt="Banner" className="w-16 h-16 rounded-md object-cover border border-g3 shrink-0" />
                      ) : (
                        <div className="w-16 h-16 rounded-md bg-g2 flex items-center justify-center shrink-0 border border-g3">
                          <Handshake size={20} className="text-g4" />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-[15px] text-ink">{req.meet?.title || req.title || "Sponsorship Request"}</h4>
                          {req.meet && (
                            <Link href={`/meets/${req.meet.id}`} target="_blank" className="text-brand hover:underline flex items-center gap-1 text-[11px] uppercase tracking-wider">
                              View Meet <ArrowUpRight size={10} />
                            </Link>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-[13px] text-g5 mb-3">
                          <div className="flex items-center gap-1.5">
                            <Avatar src={req.requester?.avatarUrl || ""} name={req.requester?.name || "User"} size={16} />
                            {req.requester?.name}
                          </div>
                          <span className="text-g3">•</span>
                          <span>Budget: <span className="text-ink font-medium">{req.budget || "N/A"}</span></span>
                          <span className="text-g3">•</span>
                          <span>Audience: <span className="text-ink font-medium">{req.audienceSize || "N/A"}</span></span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div className="bg-g1/50 rounded p-3">
                            <span className="block text-[11px] text-g5 uppercase tracking-wider mb-1">Deliverables requested</span>
                            <div className="text-[13px] text-ink">{req.deliverables}</div>
                          </div>
                          <div className="bg-g1/50 rounded p-3">
                            <span className="block text-[11px] text-g5 uppercase tracking-wider mb-1">Benefits offered</span>
                            <div className="text-[13px] text-ink">{req.benefits}</div>
                          </div>
                        </div>

                        {req.deckUrl && (
                          <a href={req.deckUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 text-[13px] text-brand hover:underline font-medium">
                            View Pitch Deck <ArrowUpRight size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 md:flex-col shrink-0">
                      <button 
                        disabled={isProcessing}
                        onClick={() => handleUpdateStatus(req.id, "APPROVED")}
                        className="ink-button px-4 py-2 w-full text-[13px] font-medium flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={16} /> Accept
                      </button>
                      <button 
                        disabled={isProcessing}
                        onClick={() => handleUpdateStatus(req.id, "REJECTED")}
                        className="text-[13px] w-full font-medium text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle size={16} /> Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab !== "sponsors" && (
        <div className="rounded-xl border border-g3 bg-paper-card overflow-hidden">
          <div className="p-8 text-center">
            <Settings size={32} className="mx-auto text-g4 mb-3" />
            <h3 className="text-[14px] font-medium text-ink capitalize">{activeTab} Module Offline</h3>
            <p className="mt-1 max-w-md mx-auto text-[13px] text-g5 leading-relaxed">
              This module is currently being integrated into the Workspace layer.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
