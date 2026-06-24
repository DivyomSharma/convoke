"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Settings, Users, CalendarDays, Hash, Briefcase, CreditCard, Activity, Trophy, Handshake, Box, FileText, ChevronRight } from "lucide-react";
import { Avatar } from "@/components/Avatar";
import { updateOrganization } from "@/app/actions/organization";

export function OrgManageClient({ org, currentUserId }: { org: any; currentUserId: string }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSaving, setIsSaving] = useState(false);

  const tabs = [
    { id: "overview", label: "Overview", icon: <Activity size={16} /> },
    { id: "members", label: "Members", icon: <Users size={16} /> },
    { id: "spaces", label: "Spaces", icon: <Hash size={16} /> },
    { id: "meets", label: "Meets", icon: <CalendarDays size={16} /> },
    { id: "challenges", label: "Challenges", icon: <Trophy size={16} /> },
    { id: "opportunities", label: "Opportunities", icon: <Briefcase size={16} /> },
    { id: "sponsorships", label: "Sponsorships", icon: <CreditCard size={16} /> },
    { id: "collaborations", label: "Collaborations", icon: <Handshake size={16} /> },
    { id: "merchandise", label: "Merchandise", icon: <Box size={16} /> },
    { id: "resources", label: "Resources", icon: <FileText size={16} /> },
    { id: "analytics", label: "Analytics", icon: <Activity size={16} /> },
    { id: "settings", label: "Settings", icon: <Settings size={16} /> },
  ];

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    await updateOrganization(org.id, formData);
    setIsSaving(false);
  };

  const getApprovalBadge = () => {
    switch(org.approvalStatus) {
      case "APPROVED": return <span className="bg-green-500/10 text-green-500 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">Approved</span>;
      case "VERIFIED": return <span className="bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">Verified</span>;
      case "SUBMITTED": return <span className="bg-orange-500/10 text-orange-500 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">In Review</span>;
      default: return <span className="bg-g3 text-ink px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">Draft</span>;
    }
  };

  return (
    <div className="mx-auto max-w-[1240px] mt-8 mb-16">
      
      {org.approvalStatus === "DRAFT" && (
        <div className="mb-6 bg-[var(--brand)]/10 border border-[var(--brand)]/30 rounded-lg p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-4">
          <div>
            <h3 className="text-[14px] font-semibold text-[var(--brand)]">Your Organization is not public yet.</h3>
            <p className="text-[13px] text-g5 mt-1">Submit your organization for verification to appear in searches and the Sponsor Directory.</p>
          </div>
          <button className="px-4 py-2 bg-[var(--brand)] text-paper text-[13px] font-semibold rounded-md hover:opacity-90 transition-opacity">
            Submit for Verification
          </button>
        </div>
      )}

      <div className="mb-8 flex items-center gap-4">
        <Link href={`/organizations/${org.id}`} className="p-2 rounded-full hover:bg-g2 text-g5 hover:text-ink transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="serif text-3xl text-ink">Manage {org.name}</h1>
            {getApprovalBadge()}
          </div>
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
        <div className="col-span-12 md:col-span-9 bg-paper-card border border-g3 rounded-xl p-8 min-h-[600px]">
          
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <h2 className="text-lg font-semibold text-ink mb-1">Organization Overview</h2>
                <p className="text-[14px] text-g5">High-level statistics and upcoming ecosystem activities.</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Members", value: org.members?.length || 1 },
                  { label: "Spaces", value: org.spaces?.length || 0 },
                  { label: "Meets Hosted", value: 0 },
                  { label: "Challenges", value: org.challenges?.length || 0 },
                  { label: "Sponsorships", value: org.sponsorshipRequests?.filter((r:any) => r.status === "WON").length || 0 },
                  { label: "Certificates", value: 0 },
                ].map((stat, i) => (
                  <div key={i} className="border border-g3 rounded-lg p-4 bg-g1/30">
                    <p className="text-[12px] text-g5 uppercase tracking-wider font-semibold">{stat.label}</p>
                    <p className="text-3xl font-bold text-ink mt-2">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-g3 rounded-xl p-5">
                  <h3 className="font-semibold text-ink mb-4">Pending Requests</h3>
                  {org.sponsorshipRequests?.filter((r:any) => r.status === "NEW").length > 0 ? (
                    <div className="space-y-3">
                      {org.sponsorshipRequests.filter((r:any) => r.status === "NEW").map((r:any) => (
                        <div key={r.id} className="flex items-center justify-between p-3 bg-g2 rounded-lg">
                          <span className="text-[13px] font-medium text-ink">Sponsorship Request from {r.requester?.name}</span>
                          <ChevronRight size={16} className="text-g4" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-[13px] text-g5 italic">No pending requests right now.</div>
                  )}
                </div>
                <div className="border border-g3 rounded-xl p-5">
                  <h3 className="font-semibold text-ink mb-4">Upcoming Meets</h3>
                  <div className="text-[13px] text-g5 italic">No meets scheduled.</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "settings" && (
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
                          {new Date(m.createdAt).toLocaleDateString()}
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
                {org.spaces.length === 0 && (
                  <div className="col-span-full py-8 text-center text-g5 italic">No spaces created yet.</div>
                )}
              </div>
            </div>
          )}

          {activeTab === "sponsorships" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-ink mb-1">Sponsorship Desk</h2>
                  <p className="text-[14px] text-g5">Accept sponsorship requests and manage active deals.</p>
                </div>
              </div>

              <div className="p-5 border border-g3 rounded-xl bg-g1/30 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-ink">Become a Sponsor</h3>
                  <p className="text-[13px] text-g5 mt-1">Allow builders to send you sponsorship requests for their meets and challenges.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked={org.isSponsorshipEnabled} />
                  <div className="w-11 h-6 bg-g3 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--brand)]"></div>
                </label>
              </div>

              <div className="mt-8">
                <h3 className="font-medium text-ink mb-4">Sponsor Inbox</h3>
                <div className="flex gap-4 border-b border-g3 overflow-x-auto pb-2">
                  {["NEW", "VIEWED", "INTERESTED", "MEETING", "WON", "LOST"].map((stage) => (
                    <button key={stage} className={`text-[12px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md ${stage === "NEW" ? "bg-g2 text-ink" : "text-g5 hover:bg-g2"}`}>
                      {stage}
                    </button>
                  ))}
                </div>
                
                <div className="mt-6">
                  {org.sponsorshipRequests?.length > 0 ? (
                    <div className="space-y-3">
                      {org.sponsorshipRequests.map((r:any) => (
                        <div key={r.id} className="premium-card p-5">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="bg-[var(--brand)]/20 text-[var(--brand)] px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider">
                                  {r.status}
                                </span>
                                <span className="text-[13px] text-g5">Requested on {new Date(r.createdAt).toLocaleDateString()}</span>
                              </div>
                              <h4 className="font-medium text-ink text-lg">Request for {r.meet?.title || r.challenge?.name || "Event"}</h4>
                              <p className="text-[14px] text-g5 mt-1">By {r.requester?.name}</p>
                            </div>
                            <div className="text-right">
                              <span className="block text-xl font-bold text-ink">{r.budget}</span>
                              <span className="text-[12px] text-g5 uppercase tracking-wider">Requested Budget</span>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-g3 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-[12px] text-g5 uppercase tracking-wider mb-1">Audience</p>
                              <p className="text-[14px] font-medium text-ink">{r.audienceSize}</p>
                            </div>
                            <div>
                              <p className="text-[12px] text-g5 uppercase tracking-wider mb-1">College</p>
                              <p className="text-[14px] font-medium text-ink">{r.college}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-12 text-center border border-dashed border-g3 rounded-xl bg-g1/20">
                      <CreditCard size={32} className="mx-auto text-g4 mb-3" />
                      <p className="text-ink font-medium">Inbox Zero</p>
                      <p className="text-g5 text-[14px]">You have no sponsorship requests in this stage.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "merchandise" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-ink mb-1">PlotArmour Merchandise</h2>
                  <p className="text-[14px] text-g5">Order premium custom swag, certificates, and event kits for your community.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: "Premium Event Kit", desc: "Includes 50 custom hoodies, 100 stickers, and 2 banners.", price: "₹25,000" },
                  { title: "Gold Certificates", desc: "100 physically printed gold-foiled certificates.", price: "₹4,999" },
                  { title: "Custom Hoodies", desc: "Premium 350 GSM hoodies with embroidered logo.", price: "₹899/piece" },
                  { title: "Swag Bags", desc: "Tote bag with notebook, pen, and sticker pack.", price: "₹349/bag" },
                ].map((item, i) => (
                  <div key={i} className="premium-card overflow-hidden flex flex-col group cursor-pointer">
                    <div className="h-40 bg-g2 w-full overflow-hidden relative">
                      {/* Placeholder for merch image */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-g2 to-g3 mix-blend-overlay z-10" />
                      <Box size={32} className="absolute inset-0 m-auto text-g4 z-0 opacity-20" />
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-ink">{item.title}</h3>
                        <span className="text-[13px] font-bold text-[var(--brand)]">{item.price}</span>
                      </div>
                      <p className="text-[13px] text-g5 leading-relaxed mb-4">{item.desc}</p>
                      <button className="w-full py-2 bg-g2 hover:bg-g3 transition-colors text-ink text-[13px] font-semibold rounded-md">
                        Order Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {["meets", "opportunities", "challenges", "collaborations", "resources", "analytics"].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 min-h-[400px]">
              <div className="w-16 h-16 rounded-full bg-g1 border border-g3 flex items-center justify-center mb-6">
                <Settings size={24} className="text-g4" />
              </div>
              <p className="font-medium text-ink mb-2 text-lg capitalize">{activeTab} Module Setup</p>
              <p className="text-[14px] text-g5 max-w-[40ch] leading-relaxed mb-6">
                Connect and manage your {activeTab} directly from this unified dashboard. Configuration options are loading.
              </p>
              <button className="px-5 py-2 bg-ink text-paper text-[13px] font-semibold rounded-md hover:bg-ink-2 transition-colors">
                Initialize Module
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
