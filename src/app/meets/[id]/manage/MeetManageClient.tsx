"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Settings, Users, QrCode, CheckCircle2, XCircle, Award } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { approveMeetApplication } from "@/app/actions/meet";

export function MeetManageClient({ meet, currentUserId }: { meet: any; currentUserId: string }) {
  const [activeTab, setActiveTab] = useState("applications");
  const [isProcessing, setIsProcessing] = useState(false);

  const tabs = [
    { id: "applications", label: "Applications", icon: <Users size={16} /> },
    { id: "attendance", label: "Attendance & Check-in", icon: <QrCode size={16} /> },
    { id: "certificates", label: "Certificates", icon: <Award size={16} /> },
    { id: "settings", label: "Event Settings", icon: <Settings size={16} /> },
  ];

  const handleApprove = async (appId: string) => {
    setIsProcessing(true);
    await approveMeetApplication(appId);
    setIsProcessing(false);
  };

  const pendingApps = meet.applications.filter((a: any) => a.status === "PENDING");
  const approvedApps = meet.applications.filter((a: any) => a.status === "APPROVED");

  return (
    <div className="mx-auto max-w-[1240px] mt-8 mb-16">
      
      <div className="mb-8 flex items-center gap-4">
        <Link href={`/meets/${meet.id}`} className="p-2 rounded-full hover:bg-g2 text-g5 hover:text-ink transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="serif text-3xl text-ink">Manage {meet.title}</h1>
          <p className="text-[14px] text-g5 mt-1">Host dashboard for applications and event operations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Sidebar Nav */}
        <aside className="col-span-12 md:col-span-3">
          <nav className="flex flex-col gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium transition-colors ${
                  activeTab === tab.id ? "bg-g2 text-ink" : "text-g5 hover:bg-g1/50 hover:text-ink"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="col-span-12 md:col-span-9 bg-paper-card border border-g3 rounded-xl p-8 min-h-[500px]">
          
          {activeTab === "applications" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-ink mb-1">Meet Applications</h2>
                  <p className="text-[14px] text-g5">Review and approve attendee requests.</p>
                </div>
                <div className="flex gap-4 text-[13px] font-medium">
                  <div className="text-g5">Pending: <span className="text-ink">{pendingApps.length}</span></div>
                  <div className="text-g5">Approved: <span className="text-ink">{approvedApps.length}</span></div>
                </div>
              </div>

              {pendingApps.length === 0 ? (
                <div className="py-12 text-center text-g5 italic rounded-md bg-g1/30 text-[14px]">
                  No pending applications.
                </div>
              ) : (
                <div className="grid gap-4">
                  {pendingApps.map((app: any) => (
                    <div key={app.id} className="border border-g3 rounded-xl p-5 flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <Avatar src={app.user.avatarUrl || ""} name={app.user.name || "User"} size={48} />
                        <div>
                          <div className="font-medium text-ink text-[15px]">{app.user.name || "User"}</div>
                          <div className="text-[13px] text-g5 mb-3">@{app.user.handle || app.user.username}</div>
                          <div className="bg-g1 rounded-md p-3 text-[13px] text-ink max-w-[500px]">
                            <span className="text-g5 font-medium block mb-1">Response:</span>
                            {app.answers || "No response provided."}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 md:flex-col md:items-end">
                        <button 
                          onClick={() => handleApprove(app.id)}
                          disabled={isProcessing}
                          className="ink-button px-4 py-2 text-[13px] font-medium flex items-center gap-2"
                        >
                          <CheckCircle2 size={16} /> Approve
                        </button>
                        <button className="text-[13px] font-medium text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                          <XCircle size={16} /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "attendance" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-ink mb-1">Attendance & Check-in</h2>
                  <p className="text-[14px] text-g5">Track who actually showed up.</p>
                </div>
                <button className="ink-button px-4 py-2 text-[13px] font-medium flex items-center gap-2">
                  <QrCode size={16} /> Scan QR
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-[14px] text-left">
                  <thead className="text-[12px] text-g5 uppercase tracking-wider border-b border-g3 bg-g1/30">
                    <tr>
                      <th className="px-4 py-3 font-medium rounded-tl-lg">Attendee</th>
                      <th className="px-4 py-3 font-medium">Role</th>
                      <th className="px-4 py-3 font-medium">RSVP Status</th>
                      <th className="px-4 py-3 font-medium text-right rounded-tr-lg">Check-in</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-g3">
                    {meet.attendance.map((a: any) => (
                      <tr key={a.id} className="hover:bg-g1/20 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar src={a.user.avatarUrl || ""} name={a.user.name || "User"} size={32} />
                            <div>
                              <div className="font-medium text-ink">{a.user.name || "User"}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[12px] font-medium px-2 py-1 bg-g2 text-ink rounded-md">
                            {a.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[13px] text-g5">
                          {a.status}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="text-[13px] font-medium text-[var(--brand)] hover:underline">
                            Mark Present
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(activeTab === "settings" || activeTab === "certificates") && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 rounded-full bg-g1 flex items-center justify-center mb-6">
                <Settings size={24} className="text-g4" />
              </div>
              <p className="font-medium text-ink mb-2 text-lg capitalize">{activeTab} Offline</p>
              <p className="text-[14px] text-g5 max-w-[40ch] leading-relaxed">
                This module is currently being upgraded. Please use the core features for now.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
