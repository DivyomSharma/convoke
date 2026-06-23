"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Settings, Users, CheckCircle2, XCircle, FileText, Trophy } from "lucide-react";
import { Avatar } from "@/components/Avatar";

export function OppManageClient({ opp, currentUserId }: { opp: any; currentUserId: string }) {
  const isHackathon = opp.type === "HACKATHON/CHALLENGE";
  const [activeTab, setActiveTab] = useState("applicants");

  const tabs = [
    { id: "applicants", label: isHackathon ? "Hackers / Participants" : "Applicants", icon: <Users size={16} /> },
    ...(isHackathon ? [{ id: "submissions", label: "Project Submissions", icon: <Trophy size={16} /> }] : []),
    { id: "settings", label: "Settings", icon: <Settings size={16} /> },
  ];

  return (
    <div className="mx-auto max-w-[1240px] mt-8 mb-16">
      
      <div className="mb-8 flex items-center gap-4">
        <Link href={isHackathon ? `/challenges/${opp.id}` : `/opportunities/${opp.id}`} className="p-2 rounded-full hover:bg-g2 text-g5 hover:text-ink transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="serif text-3xl text-ink">Manage {opp.title}</h1>
          <p className="text-[14px] text-g5 mt-1">Host dashboard for applications and logistics.</p>
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
          
          {activeTab === "applicants" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-ink mb-1">{isHackathon ? "Registered Hackers" : "Applicants"}</h2>
                  <p className="text-[14px] text-g5">Review candidates and application data.</p>
                </div>
                <div className="text-[13px] font-medium text-g5">
                  Total: <span className="text-ink">{opp.applications.length}</span>
                </div>
              </div>

              {opp.applications.length === 0 ? (
                <div className="py-12 text-center text-g5 italic rounded-md bg-g1/30 text-[14px]">
                  No one has applied yet.
                </div>
              ) : (
                <div className="grid gap-4">
                  {opp.applications.map((app: any) => (
                    <div key={app.id} className="border border-g3 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <Avatar src={app.user.avatarUrl || ""} name={app.user.name || "User"} size={48} />
                        <div>
                          <Link href={`/${app.user.handle || app.user.username}`} className="font-medium text-ink text-[15px] hover:underline">
                            {app.user.name || "User"}
                          </Link>
                          <div className="text-[13px] text-g5">@{app.user.handle || app.user.username}</div>
                          <div className="text-[12px] text-g5 mt-1">
                            Applied {new Date(app.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button className="text-[13px] font-medium text-[var(--brand)] hover:underline border border-[var(--brand)]/30 rounded-md px-4 py-2">
                          View Profile
                        </button>
                        <select className="bg-g1 border border-g3 rounded-md px-3 py-2 text-[13px] text-ink outline-none">
                          <option>Applied</option>
                          <option>Reviewing</option>
                          <option>Interview</option>
                          <option>Offer</option>
                          <option>Rejected</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {(activeTab === "settings" || activeTab === "submissions") && (
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
