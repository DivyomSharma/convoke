"use client";

import { useState } from "react";
import { Users, Search, Plus, Check, X, ShieldAlert } from "lucide-react";
import { createTeam, requestToJoinTeam, respondToTeamRequest } from "@/app/actions/team";

type User = { id: string; name: string | null; handle: string | null; avatarUrl: string | null };
type TeamMember = { id: string; role: string | null; user: User };
type TeamRequest = { id: string; status: string; message: string | null; user: User };
type Team = { id: string; name: string; about: string | null; leaderId: string; members: TeamMember[] };

export function ChallengeTeamHub({
  opportunityId,
  userId,
  teams,
  myTeam,
  incomingRequests,
}: {
  opportunityId: string;
  userId: string;
  teams: Team[];
  myTeam: Team | null;
  incomingRequests: TeamRequest[];
}) {
  const [activeTab, setActiveTab] = useState<"FIND" | "MY_TEAM" | "REQUESTS">("FIND");
  const [isCreating, setIsCreating] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamAbout, setNewTeamAbout] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCreateTeam = async () => {
    if (!newTeamName.trim() || submitting) return;
    setSubmitting(true);
    const res = await createTeam(opportunityId, newTeamName, newTeamAbout);
    if (res.success) {
      setIsCreating(false);
      setActiveTab("MY_TEAM");
    } else {
      alert(res.error);
    }
    setSubmitting(false);
  };

  const handleRequestJoin = async (teamId: string) => {
    if (!userId) {
      alert("Please sign in to join a team.");
      return;
    }
    if (myTeam) {
      alert("You are already in a team.");
      return;
    }
    const message = prompt("Why do you want to join this team?");
    if (message === null) return;

    const res = await requestToJoinTeam(teamId, message);
    if (res.success) {
      alert("Request sent!");
    } else {
      alert(res.error || "Failed to send request.");
    }
  };

  const handleRequestResponse = async (requestId: string, status: "ACCEPTED" | "REJECTED") => {
    const res = await respondToTeamRequest(requestId, status);
    if (res.success) {
      alert(`Request ${status.toLowerCase()}`);
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="rounded-xl border border-g3 bg-paper-card overflow-hidden">
      <div className="flex items-center gap-1 border-b border-g3 bg-g1/30 px-4 pt-3 overflow-x-auto">
        <button 
          onClick={() => setActiveTab("FIND")}
          className={`px-4 py-2 text-[13px] font-medium border-b-2 transition-colors ${activeTab === "FIND" ? "border-brand text-brand" : "border-transparent text-g5 hover:text-ink"}`}
        >
          Find Team
        </button>
        <button 
          onClick={() => setActiveTab("MY_TEAM")}
          className={`px-4 py-2 text-[13px] font-medium border-b-2 transition-colors ${activeTab === "MY_TEAM" ? "border-brand text-brand" : "border-transparent text-g5 hover:text-ink"}`}
        >
          My Team
        </button>
        <button 
          onClick={() => setActiveTab("REQUESTS")}
          className={`px-4 py-2 text-[13px] font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === "REQUESTS" ? "border-brand text-brand" : "border-transparent text-g5 hover:text-ink"}`}
        >
          Team Requests
          {incomingRequests.length > 0 && (
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
              {incomingRequests.length}
            </span>
          )}
        </button>
      </div>

      <div className="p-6">
        {activeTab === "FIND" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-g4" />
                <input 
                  type="text" 
                  placeholder="Search teams by skill or name..." 
                  className="w-full rounded-full border border-g3 bg-g1/30 pl-9 pr-4 py-1.5 text-[13px] text-ink outline-none focus:border-brand/50 transition-colors"
                />
              </div>
              {!myTeam && userId && (
                <button 
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-[12px] font-medium text-paper transition-colors hover:bg-ink-2"
                >
                  <Plus size={14} /> Create Team
                </button>
              )}
            </div>

            {isCreating && (
              <div className="p-4 rounded-lg border border-g3 bg-paper-elevated space-y-3 mb-6">
                <h3 className="font-semibold text-[14px]">Create a new team</h3>
                <input 
                  type="text" 
                  placeholder="Team Name" 
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full rounded-md border border-g3 bg-paper px-3 py-2 text-[13px] outline-none focus:border-brand"
                />
                <textarea 
                  placeholder="What are you building? What skills do you need?" 
                  value={newTeamAbout}
                  onChange={(e) => setNewTeamAbout(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-g3 bg-paper px-3 py-2 text-[13px] outline-none focus:border-brand"
                />
                <div className="flex gap-2 justify-end">
                  <button onClick={() => setIsCreating(false)} className="px-3 py-1.5 text-[13px] text-g5 hover:text-ink">Cancel</button>
                  <button 
                    onClick={handleCreateTeam} 
                    disabled={submitting}
                    className="px-4 py-1.5 bg-brand text-white rounded-md text-[13px] font-medium"
                  >
                    {submitting ? "Creating..." : "Create Team"}
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teams.length > 0 ? teams.map(team => (
                <div key={team.id} className="rounded-lg border border-g3/60 p-4 transition hover:border-brand/30">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-[15px]">{team.name}</h4>
                    <span className="text-[11px] font-medium bg-g2 text-g6 px-2 py-0.5 rounded">{team.members.length} Members</span>
                  </div>
                  <p className="text-[13px] text-g5 line-clamp-2 min-h-[40px] mb-4">
                    {team.about || "No description provided."}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex -space-x-2">
                      {team.members.slice(0, 3).map(m => (
                        <div key={m.id} className="h-7 w-7 rounded-full bg-g1 border-2 border-paper-card overflow-hidden">
                          {m.user.avatarUrl ? <img src={m.user.avatarUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[10px] font-medium text-g5 bg-g2">{(m.user.name || "U").charAt(0)}</div>}
                        </div>
                      ))}
                      {team.members.length > 3 && (
                        <div className="h-7 w-7 rounded-full bg-g2 border-2 border-paper-card flex items-center justify-center text-[10px] font-medium text-g5">
                          +{team.members.length - 3}
                        </div>
                      )}
                    </div>
                    {myTeam?.id !== team.id && !myTeam && (
                      <button 
                        onClick={() => handleRequestJoin(team.id)}
                        className="text-[12px] font-medium text-brand hover:underline"
                      >
                        Request to Join
                      </button>
                    )}
                  </div>
                </div>
              )) : (
                <div className="col-span-2 text-center py-10 text-g5 text-[14px]">
                  No teams found. Be the first to create one!
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "MY_TEAM" && (
          <div className="space-y-6">
            {myTeam ? (
              <>
                <div>
                  <h3 className="serif text-2xl">{myTeam.name}</h3>
                  <p className="text-[14px] text-g6 mt-2">{myTeam.about}</p>
                </div>
                <div>
                  <h4 className="text-[11px] uppercase tracking-wider text-g5 font-medium mb-3">Team Members ({myTeam.members.length})</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {myTeam.members.map(member => (
                      <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg border border-g3/50 bg-g1/20">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-g2">
                          {member.user.avatarUrl ? <img src={member.user.avatarUrl} alt="" className="w-full h-full object-cover" /> : null}
                        </div>
                        <div>
                          <div className="text-[14px] font-medium">{member.user.name} <span className="text-g4 text-[13px]">@{member.user.handle}</span></div>
                          <div className="text-[12px] text-brand font-medium mt-0.5">{member.role || "Member"}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <Users size={32} className="mx-auto text-g4 mb-4" />
                <h3 className="font-semibold text-ink text-[16px]">You are not in a team</h3>
                <p className="text-[14px] text-g5 mt-2 mb-6">Find an existing team or create your own to participate.</p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setActiveTab("FIND")} className="px-4 py-2 rounded-md border border-g3 text-[13px] font-medium hover:bg-g1 transition-colors">Find a Team</button>
                  <button onClick={() => { setActiveTab("FIND"); setIsCreating(true); }} className="px-4 py-2 rounded-md bg-ink text-paper text-[13px] font-medium hover:bg-ink-2 transition-colors">Create Team</button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "REQUESTS" && (
          <div className="space-y-4">
            {!myTeam ? (
              <div className="text-center py-10 text-[14px] text-g5">You need to be a team leader to view requests.</div>
            ) : myTeam.leaderId !== userId ? (
              <div className="text-center py-10 text-[14px] text-g5">Only the team leader can manage requests.</div>
            ) : (
              <>
                <h4 className="text-[11px] uppercase tracking-wider text-g5 font-medium mb-2">Pending Requests</h4>
                {incomingRequests.length > 0 ? incomingRequests.map(req => (
                  <div key={req.id} className="flex items-start justify-between p-4 rounded-lg border border-brand/20 bg-brand/5">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-g2 shrink-0">
                        {req.user.avatarUrl ? <img src={req.user.avatarUrl} alt="" className="w-full h-full object-cover" /> : null}
                      </div>
                      <div>
                        <div className="text-[14px] font-medium">{req.user.name} <span className="text-g4 text-[13px]">@{req.user.handle}</span> wants to join</div>
                        <p className="text-[13px] text-g6 mt-1 p-2 rounded bg-paper-card border border-g3/50 italic">"{req.message}"</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => handleRequestResponse(req.id, "ACCEPTED")} className="h-8 w-8 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center hover:bg-green-500/20"><Check size={16} /></button>
                      <button onClick={() => handleRequestResponse(req.id, "REJECTED")} className="h-8 w-8 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center hover:bg-red-500/20"><X size={16} /></button>
                    </div>
                  </div>
                )) : (
                  <div className="text-[13px] text-g5 italic">No pending requests to join your team.</div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
