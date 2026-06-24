"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, Award, FileText, Layout } from "lucide-react";

export function ProfileTabsClient({
  projects,
  research,
  meetAttendance,
  applications,
  certificates,
  experiences,
  educations,
  achievements,
  activityDates,
  Heat
}: {
  projects: any[];
  research: any[];
  meetAttendance?: any[];
  applications?: any[];
  certificates?: any[];
  experiences?: any[];
  educations?: any[];
  achievements?: any[];
  activityDates: Date[];
  Heat: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "resume", label: "Resume" },
    { id: "projects", label: "Projects" },
    { id: "research", label: "Research" },
    { id: "meets", label: "Meets" },
    { id: "opportunities", label: "Opportunities" },
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

        {activeTab === "resume" && (
          <div className="space-y-12 animate-in fade-in duration-300">
            {(!experiences?.length && !educations?.length && !achievements?.length) ? (
              <div className="py-12 text-center text-g5 text-[14px] border border-dashed border-g3 rounded-xl flex flex-col items-center">
                <FileText size={24} className="text-g4 mb-3" />
                <p>No resume information added yet.</p>
              </div>
            ) : (
              <>
                {experiences && experiences.length > 0 && (
                  <div>
                    <div className="eyebrow mb-6">Experience</div>
                    <div className="space-y-8">
                      {experiences.map(exp => (
                        <div key={exp.id} className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] gap-4">
                          <div className="text-[13px] text-g5 mt-0.5">
                            {new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })} — 
                            {exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : " Present"}
                          </div>
                          <div>
                            <h3 className="text-ink font-medium text-[16px]">{exp.role}</h3>
                            <div className="text-g6 text-[14px] mb-2">{exp.company} <span className="text-g4 mx-1">·</span> {exp.type}</div>
                            {exp.description && <p className="text-[14px] text-g5 leading-relaxed">{exp.description}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {educations && educations.length > 0 && (
                  <div>
                    <div className="eyebrow mb-6">Education</div>
                    <div className="space-y-8">
                      {educations.map(edu => (
                        <div key={edu.id} className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] gap-4">
                          <div className="text-[13px] text-g5 mt-0.5">
                            {edu.startDate ? new Date(edu.startDate).getFullYear() : ""} — 
                            {edu.endDate ? new Date(edu.endDate).getFullYear() : " Present"}
                          </div>
                          <div>
                            <h3 className="text-ink font-medium text-[16px]">{edu.school}</h3>
                            <div className="text-g6 text-[14px] mb-2">{edu.degree} {edu.field && `in ${edu.field}`} {edu.grade && <span className="text-g5 ml-2">({edu.grade})</span>}</div>
                            {edu.achievements && <p className="text-[14px] text-g5 leading-relaxed">{edu.achievements}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {achievements && achievements.length > 0 && (
                  <div>
                    <div className="eyebrow mb-6">Honors & Awards</div>
                    <div className="space-y-6">
                      {achievements.map(ach => (
                        <div key={ach.id} className="grid grid-cols-[100px_1fr] md:grid-cols-[140px_1fr] gap-4">
                          <div className="text-[13px] text-g5 mt-0.5">
                            {ach.date ? new Date(ach.date).getFullYear() : ""}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-ink font-medium text-[16px]">{ach.title}</h3>
                              {ach.url && (
                                <a href={ach.url} target="_blank" rel="noreferrer" className="text-g4 hover:text-[var(--brand)]">
                                  <ExternalLink size={14} />
                                </a>
                              )}
                            </div>
                            <div className="text-g5 text-[14px] mb-1">{ach.type}</div>
                            {ach.description && <p className="text-[14px] text-g5 leading-relaxed mt-1">{ach.description}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
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

        {activeTab === "meets" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {meetAttendance && meetAttendance.length > 0 ? (
              <div className="grid gap-4">
                {meetAttendance.map((m: any) => (
                  <Link key={m.id} href={`/meets/${m.meet.id}`} className="premium-card p-5 group hover:border-[var(--brand)]/30 transition-colors">
                    <h3 className="text-[16px] text-ink font-medium mb-1">{m.meet.title}</h3>
                    <p className="text-[13px] text-g5">
                      Attended on {new Date(m.meet.startTime).toLocaleDateString()}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-g5 text-[14px] border border-dashed border-g3 rounded-xl flex flex-col items-center">
                <Layout size={24} className="text-g4 mb-3" />
                <p>No meets attended yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "opportunities" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {applications && applications.length > 0 ? (
              <div className="grid gap-4">
                {applications.map((app: any) => (
                  <Link key={app.id} href={app.opportunity.type.includes("CHALLENGE") ? `/challenges/${app.opportunity.id}` : `/opportunities/${app.opportunity.id}`} className="premium-card p-5 group hover:border-[var(--brand)]/30 transition-colors">
                    <h3 className="text-[16px] text-ink font-medium mb-1">{app.opportunity.title}</h3>
                    <p className="text-[13px] text-g5 uppercase tracking-wider mono text-[11px] mb-2">{app.opportunity.type}</p>
                    <span className="inline-block px-2 py-1 bg-g2 text-ink text-[12px] rounded border border-g3">Status: {app.status}</span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-g5 text-[14px] border border-dashed border-g3 rounded-xl flex flex-col items-center">
                <Layout size={24} className="text-g4 mb-3" />
                <p>No applications yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "certificates" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {certificates && certificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map((c: any) => (
                  <div key={c.id} className="premium-card p-5 group flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Award size={18} className="text-[var(--brand)]" />
                        <span className="mono text-[11px] text-g5 uppercase tracking-wider">{c.issuer}</span>
                      </div>
                      <h3 className="text-[16px] text-ink font-medium mb-1">{c.title}</h3>
                      <p className="text-[12px] text-g5 mb-4">Issued: {new Date(c.issueDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-3">
                      {c.fileUrl && (
                        <a href={c.fileUrl} target="_blank" rel="noopener noreferrer" className="ink-button px-3 py-1.5 text-[12px] h-auto rounded border border-g3 hover:border-g4 transition-colors bg-g1 flex items-center gap-1.5 text-ink w-fit">
                          <FileText size={13} />
                          Download
                        </a>
                      )}
                      {c.url && (
                        <a href={c.url} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-[12px] flex items-center gap-1.5 text-g5 hover:text-ink transition-colors w-fit">
                          <ExternalLink size={13} />
                          Verify
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-16 text-center text-g5 text-[14px] border border-dashed border-g3 rounded-xl flex flex-col items-center bg-g1/20">
                <Award size={32} className="text-[var(--brand)] mb-4" />
                <p className="font-medium text-ink mb-1 text-[16px]">Verified Credentials</p>
                <p className="max-w-[40ch]">Meet participation certificates and digital badges will appear here once issued by organizers.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
