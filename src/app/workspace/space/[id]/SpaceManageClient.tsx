"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Settings, Users, CalendarDays, Award, Image as ImageIcon } from "lucide-react";
import { Avatar } from "@/components/Avatar";

export function SpaceManageClient({ space, currentUserId }: { space: any; currentUserId: string }) {
  const [activeTab, setActiveTab] = useState("about");

  const tabs = [
    { id: "about", label: "About & Settings", icon: <Settings size={16} /> },
    { id: "members", label: "Members & Roles", icon: <Users size={16} /> },
    { id: "meets", label: "Meets", icon: <CalendarDays size={16} /> },
    { id: "challenges", label: "Challenges", icon: <Award size={16} /> },
    { id: "gallery", label: "Gallery", icon: <ImageIcon size={16} /> },
  ];

  return (
    <div className="mx-auto max-w-[1240px] mt-8 mb-16">
      
      <div className="mb-8 flex items-center gap-4">
        <Link href={`/spaces/${space.id}`} className="p-2 rounded-full hover:bg-g2 text-g5 hover:text-ink transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="serif text-3xl text-ink">Manage {space.name}</h1>
          <p className="text-[14px] text-g5 mt-1">Configure space settings, members, and content.</p>
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
          
          {activeTab === "about" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <h2 className="text-lg font-semibold text-ink mb-1">General Settings</h2>
                <p className="text-[14px] text-g5">Update your space&apos;s profile and basic information.</p>
              </div>

              <div className="space-y-4 max-w-xl">
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-ink block">Space Name</label>
                  <input 
                    type="text" 
                    defaultValue={space.name}
                    className="w-full bg-g1 border border-g3 rounded px-3 py-2 text-[14px] text-ink outline-none focus:border-g4 transition-colors" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-ink block">Description</label>
                  <textarea 
                    rows={4}
                    defaultValue={space.description || ""}
                    className="w-full bg-g1 border border-g3 rounded px-3 py-2 text-[14px] text-ink outline-none focus:border-g4 transition-colors resize-none" 
                  />
                </div>
                
                <div className="pt-2">
                  <button className="ink-button px-5 py-2 text-[13px] font-semibold">Save Changes</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "members" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-ink mb-1">Members & Roles</h2>
                  <p className="text-[14px] text-g5">Manage people and their permissions.</p>
                </div>
                <button className="text-[13px] font-medium text-ink bg-g2 hover:bg-g3 px-4 py-2 rounded-lg transition-colors">
                  Invite Member
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-[14px] text-left">
                  <thead className="text-[12px] text-g5 uppercase tracking-wider border-b border-g3 bg-g1/30">
                    <tr>
                      <th className="px-4 py-3 font-medium rounded-tl-lg">User</th>
                      <th className="px-4 py-3 font-medium">Role</th>
                      <th className="px-4 py-3 font-medium">Joined</th>
                      <th className="px-4 py-3 font-medium text-right rounded-tr-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-g3">
                    {space.members.map((m: any) => (
                      <tr key={m.id} className="hover:bg-g1/20 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar src={m.user.avatarUrl || ""} name={m.user.name || "User"} size={32} />
                            <div>
                              <div className="font-medium text-ink">{m.user.name || "User"}</div>
                              <div className="text-[12px] text-g5">@{m.user.handle || m.user.username}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <select 
                            defaultValue={m.role}
                            className="bg-transparent text-[13px] font-medium text-ink outline-none cursor-pointer hover:bg-g2 px-2 py-1 rounded transition-colors"
                          >
                            <option value="FOUNDER">Founder</option>
                            <option value="LEAD">Lead</option>
                            <option value="ORGANIZER">Organizer</option>
                            <option value="CORE_TEAM">Core Team</option>
                            <option value="MEMBER">Member</option>
                            <option value="ALUMNI">Alumni</option>
                          </select>
                        </td>
                        <td className="px-4 py-3 text-[13px] text-g5">
                          {new Date(m.joinedAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button className="text-[13px] text-red-500 hover:underline">Remove</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {(activeTab === "meets" || activeTab === "challenges" || activeTab === "gallery") && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 rounded-full bg-g1 flex items-center justify-center mb-6">
                <Settings size={24} className="text-g4" />
              </div>
              <p className="font-medium text-ink mb-2 text-lg">Module Settings Offline</p>
              <p className="text-[14px] text-g5 max-w-[40ch] leading-relaxed">
                This management module is currently being upgraded. Please use the individual Creation Studios to publish {activeTab}.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
