"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Award, FileText, Layout } from "lucide-react";

export function ProfileTabsClient({
  projects,
  research,
  activityDates,
  Heat
}: {
  projects: any[];
  research: any[];
  activityDates: Date[];
  Heat: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "projects", label: "Projects" },
    { id: "research", label: "Research" },
    { id: "certificates", label: "Certificates" }
  ];

  return (
    <div className="mt-12">
      <div className="flex items-center gap-6 border-b border-g3/60 mb-8 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 text-[14px] transition-colors whitespace-nowrap relative ${
              activeTab === tab.id ? "text-ink font-medium" : "text-g5 hover:text-ink"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[var(--brand)]" />
            )}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === "overview" && (
          <div className="space-y-12 animate-in fade-in duration-300">
            <div>
              <div className="eyebrow mb-4">Momentum · last 24 weeks</div>
              {Heat}
            </div>
            
            <div>
              <div className="eyebrow mb-4 flex items-center justify-between">
                <span>Selected work</span>
                {projects.length > 3 && (
                  <button onClick={() => setActiveTab("projects")} className="text-g4 hover:text-ink transition-colors lowercase">view all</button>
                )}
              </div>
              {projects.length > 0 ? (
                <ul className="divide-y divide-g3">
                  {projects.slice(0, 3).map((w) => (
                    <li key={w.id} className="grid grid-cols-[60px_1fr_auto] gap-4 py-4 text-[15px]">
                      <span className="mono text-[12px] text-g5">{new Date(w.createdAt).getFullYear()}</span>
                      <Link href={`/projects/${w.id}`} className="hover:text-[var(--brand)] transition-colors">{w.title}</Link>
                      <span className="mono text-[11px] font-medium uppercase text-[var(--brand)]">shipped</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-[14px] text-g5">No selected work to show yet.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === "projects" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.length > 0 ? (
                projects.map((p) => (
                  <Link key={p.id} href={`/projects/${p.id}`} className="premium-card p-5 group hover:border-[var(--brand)]/30 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-g1 flex items-center justify-center text-[var(--brand)] font-semibold text-[14px]">
                        {p.title.substring(0, 2).toUpperCase()}
                      </div>
                      <ExternalLink size={14} className="text-g4 group-hover:text-[var(--brand)] transition-colors" />
                    </div>
                    <div className="font-medium text-ink mb-1">{p.title}</div>
                    {p.description && <div className="text-[13px] text-g5 line-clamp-2">{p.description}</div>}
                  </Link>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-g5 text-[14px] border border-dashed border-g3 rounded-xl flex flex-col items-center">
                  <Layout size={24} className="text-g4 mb-3" />
                  <p>No projects published yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "research" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {research && research.length > 0 ? (
              <div className="grid gap-4">
                {research.map((r) => (
                  <div key={r.id} className="premium-card p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-2">
                      <span className="mono text-[11px] text-g5">{new Date(r.createdAt).toLocaleDateString()}</span>
                      {r.url && (
                        <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-[var(--brand)] hover:underline flex items-center gap-1 text-[12px]">
                          <FileText size={12} /> View Paper
                        </a>
                      )}
                    </div>
                    <h3 className="text-[16px] text-ink font-medium mb-2">{r.title}</h3>
                    {r.abstract && <p className="text-[13px] text-g6 line-clamp-3 leading-relaxed">{r.abstract}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-g5 text-[14px] border border-dashed border-g3 rounded-xl flex flex-col items-center">
                <FileText size={24} className="text-g4 mb-3" />
                <p>No research published yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "certificates" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="py-16 text-center text-g5 text-[14px] border border-dashed border-g3 rounded-xl flex flex-col items-center bg-g1/20">
              <Award size={32} className="text-[var(--brand)] mb-4" />
              <p className="font-medium text-ink mb-1 text-[16px]">Verified Credentials</p>
              <p className="max-w-[40ch]">Event participation certificates and digital badges will appear here once issued by organizers.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
