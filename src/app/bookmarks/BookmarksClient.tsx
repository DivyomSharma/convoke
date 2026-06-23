"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, CalendarDays, Sparkles, FolderKanban, UsersRound } from "lucide-react";

export function BookmarksClient({
  meets,
  opportunities,
  challenges,
  projects,
  research
}: {
  meets: any[];
  opportunities: any[];
  challenges: any[];
  projects: any[];
  research: any[];
}) {
  const [activeTab, setActiveTab] = useState("opportunities");

  const tabs = [
    { id: "opportunities", label: `Opportunities (${opportunities.length})`, icon: <UsersRound size={14} /> },
    { id: "challenges", label: `Challenges (${challenges.length})`, icon: <Sparkles size={14} /> },
    { id: "meets", label: `Meets (${meets.length})`, icon: <CalendarDays size={14} /> },
    { id: "projects", label: `Projects (${projects.length})`, icon: <FolderKanban size={14} /> },
    { id: "research", label: `Research (${research.length})`, icon: <Sparkles size={14} /> },
  ];

  const getItems = () => {
    switch(activeTab) {
      case "opportunities": return opportunities;
      case "challenges": return challenges;
      case "meets": return meets;
      case "projects": return projects;
      case "research": return research;
      default: return [];
    }
  };

  const items = getItems();

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      
      {/* Sidebar Navigation */}
      <aside className="col-span-12 md:col-span-3">
        <nav className="flex flex-col gap-1 sticky top-24">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] font-medium transition-colors ${
                activeTab === tab.id ? "bg-g2 text-ink" : "text-g5 hover:bg-g1/50 hover:text-ink"
              }`}
            >
              <span className={activeTab === tab.id ? "text-[var(--brand)]" : "text-g4"}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="col-span-12 md:col-span-9 bg-paper-card border border-g3 rounded-xl p-8 min-h-[500px]">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-g1 flex items-center justify-center mb-6">
              <Bookmark size={24} className="text-g4" />
            </div>
            <p className="font-medium text-ink mb-2 text-lg">No saved {activeTab}</p>
            <p className="text-[14px] text-g5 max-w-[40ch] leading-relaxed">
              Items you bookmark will appear here so you can easily find them later.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 animate-in fade-in duration-300">
            {items.map(({ bookmark, item }: any) => {
              
              let href = "#";
              let title = "";
              let subtitle = "";

              if (activeTab === "meets") {
                href = `/meets/${item.id}`;
                title = item.title;
                subtitle = `Starts ${new Date(item.startTime).toLocaleDateString()}`;
              } else if (activeTab === "opportunities" || activeTab === "challenges") {
                href = activeTab === "challenges" ? `/challenges/${item.id}` : `/opportunities/${item.id}`;
                title = item.title;
                subtitle = `${item.organization?.name || "Community"} · ${item.location || "Remote"}`;
              } else if (activeTab === "projects") {
                href = `/projects/${item.id}`;
                title = item.title;
                subtitle = `By ${item.user.name}`;
              } else if (activeTab === "research") {
                href = `/research/${item.id}`;
                title = item.title;
                subtitle = `Published ${new Date(item.createdAt).toLocaleDateString()}`;
              }

              return (
                <div key={bookmark.id} className="border border-g3 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-g4 transition-colors group bg-paper">
                  <div>
                    <Link href={href} className="font-medium text-ink text-[16px] group-hover:text-[var(--brand)] transition-colors mb-1 inline-block">
                      {title}
                    </Link>
                    <div className="text-[13px] text-g5">{subtitle}</div>
                    <div className="text-[12px] text-g4 mt-2 font-mono">Saved {new Date(bookmark.createdAt).toLocaleDateString()}</div>
                  </div>
                  <button className="text-[13px] font-medium text-g5 hover:text-red-400 transition-colors">
                    Remove
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
