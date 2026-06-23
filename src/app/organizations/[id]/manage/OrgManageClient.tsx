"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Settings, Users, CalendarDays, Hash, Briefcase, CreditCard, Activity, ShieldCheck } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { updateOrganization } from "@/app/actions/organization";

export function OrgManageClient({ org, currentUserId }: { org: any; currentUserId: string }) {
  const [activeTab, setActiveTab] = useState("about");
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: "about", label: "About & Settings", icon: <Settings size={16} /> },
    { id: "members", label: "Members", icon: <Users size={16} /> },
    { id: "spaces", label: "Spaces", icon: <Hash size={16} /> },
    { id: "meets", label: "Meets", icon: <CalendarDays size={16} /> },
    { id: "opportunities", label: "Opportunities", icon: <Briefcase size={16} /> },
    { id: "billing", label: "Billing", icon: <CreditCard size={16} /> },
    { id: "analytics", label: "Analytics", icon: <Activity size={16} /> },
    { id: "integrity", label: "Integrity & Domains", icon: <ShieldCheck size={16} /> },
  ];

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    await updateOrganization(org.id, formData);
    setIsSaving(false);
  };

  return (
    <div className="mx-auto max-w-[1240px] mt-8 mb-16">
      
      <div className="mb-8 flex items-center gap-4">
        <Link href={`/organizations/${org.id}`} className="p-2 rounded-full hover:bg-g2 text-g5 hover:text-ink transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="serif text-3xl text-ink">Manage {org.name}</h1>
          <p className="text-[14px] text-g5 mt-1">Configure global organization settings and resources.</p>
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
                <p className="text-[14px] text-g5">Update your organization's public profile.</p>
              </div>

              <form onSubmit={handleUpdate} className="space-y-4 max-w-xl">
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-ink block">Organization Name</label>
                  <input 
                    type="text" 
                    name="name"
                    defaultValue={org.name}
                    required
                    className="w-full bg-g1 border border-g3 rounded px-3 py-2 text-[14px] text-ink outline-none focus:border-g4 transition-colors" 
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-[13px] font-medium text-ink block">Description</label>
                  <textarea 
                    name="description"
                    rows={4}
                    defaultValue={org.description || ""}
                    className="w-full bg-g1 border border-g3 rounded px-3 py-2 text-[14px] text-ink outline-none focus:border-g4 transition-colors resize-none" 
                  />
                </div>
                
                <div className="pt-2">
                  <button type="submit" disabled={isSaving} className="ink-button px-5 py-2 text-[13px] font-semibold disabled:opacity-50">
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "members" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-ink mb-1">Members</h2>
                  <p className="text-[14px] text-g5">Manage people across the organization.</p>
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
                    {org.members.map((m: any) => (
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
                            <option value="ADMIN">Admin</option>
                            <option value="LEAD">Lead</option>
                            <option value="RECRUITER">Recruiter</option>
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

          {activeTab === "spaces" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-ink mb-1">Spaces Hierarchy</h2>
                  <p className="text-[14px] text-g5">Manage all sub-communities within this organization.</p>
                </div>
                <Link href="/spaces/create" className="text-[13px] font-medium text-paper bg-ink hover:bg-ink-2 px-4 py-2 rounded-lg transition-colors">
                  Create Space
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {org.spaces.map((s: any) => (
                  <div key={s.id} className="border border-g3 rounded-xl p-4 flex flex-col items-center text-center bg-g1/30">
                    <div className="w-12 h-12 bg-g2 rounded-lg flex items-center justify-center text-xl font-bold mb-3">{s.name[0]}</div>
                    <h3 className="font-medium text-ink truncate w-full">{s.name}</h3>
                    <p className="text-[12px] text-g5 mt-1">{s.type}</p>
                    <Link href={`/spaces/${s.id}/manage`} className="mt-4 text-[12px] font-medium text-[var(--brand)] hover:underline">
                      Manage Space
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {["meets", "opportunities", "billing", "analytics", "integrity"].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-16 h-16 rounded-full bg-g1 flex items-center justify-center mb-6">
                <Settings size={24} className="text-g4" />
              </div>
              <p className="font-medium text-ink mb-2 text-lg capitalize">{activeTab} Module Offline</p>
              <p className="text-[14px] text-g5 max-w-[40ch] leading-relaxed">
                This enterprise module is currently being upgraded. Please use the individual Creation Studios to manage {activeTab}.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
