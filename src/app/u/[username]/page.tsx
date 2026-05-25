import { SiteHeader } from "@/components/marketing/site-header";
import { Footer } from "@/components/marketing/footer";
import { getProfilePageData } from "@/lib/platform-service";
import { notFound } from "next/navigation";
import { MapPin, CalendarDays, Link as LinkIcon, BadgeCheck, Zap } from "lucide-react";
import Link from "next/link";
import { ActivityGraph } from "@/components/profile/activity-graph";

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const profile = await getProfilePageData(username);

  if (!profile) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen bg-background px-5 pb-24 pt-32 md:px-8">
        <div className="mx-auto max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-1000">
          
          {/* Header & Identity */}
          <div className="relative overflow-hidden rounded-3xl border border-line bg-black/40 p-8 backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-bronze/5 opacity-50" />
            
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
              <div className="h-32 w-32 shrink-0 rounded-full bg-gradient-to-tr from-emerald-500 to-bronze p-[2px]">
                <div className="h-full w-full rounded-full bg-black flex items-center justify-center text-4xl overflow-hidden">
                  {profile.avatarFallback}
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-4xl font-semibold tracking-tight">{profile.name}</h1>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                    {profile.role}
                  </span>
                </div>
                <p className="mt-2 text-xl text-foreground/90">{profile.headline}</p>
                
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted">
                  {profile.location && (
                    <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {profile.location}</span>
                  )}
                  <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4" /> Joined {profile.memberSince}</span>
                  <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-amber-400" /> {profile.reputation} Reputation</span>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {profile.socials.map((social) => (
                    <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-full border border-line bg-white/5 px-4 py-1.5 text-sm transition-colors hover:bg-white/10 hover:text-foreground">
                      <LinkIcon className="h-3.5 w-3.5" /> {social.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-[1fr_300px]">
            {/* Main Content Column */}
            <div className="space-y-6">
              
              {/* About & Activity Graph Bento */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-3xl border border-line bg-black/20 p-6 flex flex-col justify-between">
                  <div>
                    <h2 className="text-lg font-medium text-foreground">About</h2>
                    <p className="mt-3 text-muted leading-relaxed">{profile.bio}</p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span key={skill} className="rounded-md bg-white/5 px-2 py-1 text-xs text-muted ring-1 ring-inset ring-white/10">{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-line bg-black/20 p-6 flex flex-col justify-between group overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-duration-500" />
                  <h2 className="text-lg font-medium text-foreground relative z-10">Ecosystem Momentum</h2>
                  <div className="mt-4 relative z-10">
                    <ActivityGraph activities={profile.activityTimeline || []} />
                  </div>
                </div>
              </div>

              {/* Experience Timeline */}
              <div className="rounded-3xl border border-line bg-black/20 p-6">
                <h2 className="text-lg font-medium text-foreground mb-6">Experience</h2>
                <div className="space-y-6">
                  {profile.experiences.length > 0 ? profile.experiences.map((exp) => (
                    <div key={exp.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:h-full before:w-[1px] before:bg-line last:before:hidden">
                      <div className="absolute left-[-4px] top-2 h-2 w-2 rounded-full bg-emerald-500 ring-4 ring-black/20" />
                      <h3 className="font-medium text-foreground">{exp.title}</h3>
                      <p className="text-sm text-emerald-400 mt-0.5">{exp.org}</p>
                      <p className="text-xs text-muted mt-1">{exp.period}</p>
                      {exp.description && <p className="text-sm text-muted mt-2">{exp.description}</p>}
                    </div>
                  )) : (
                    <p className="text-sm text-muted">Building their experience graph.</p>
                  )}
                </div>
              </div>
              
              {/* Projects */}
              {profile.projects.length > 0 && (
                <div className="rounded-3xl border border-line bg-black/20 p-6">
                  <h2 className="text-lg font-medium text-foreground mb-6">Built Projects</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {profile.projects.map((project) => (
                      <div key={project.id} className="rounded-xl border border-line bg-black/40 p-4 transition-colors hover:bg-white/5">
                        <h3 className="font-medium">{project.name}</h3>
                        <p className="text-sm text-muted mt-1">{project.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              {/* Communities */}
              <div className="rounded-3xl border border-line bg-black/20 p-6">
                <h2 className="text-lg font-medium text-foreground mb-4">Communities</h2>
                <div className="space-y-3">
                  {profile.communities.length > 0 ? profile.communities.map((comm) => (
                    <Link key={comm.id} href={`/communities/${comm.slug}`} className="flex items-center justify-between rounded-lg p-2 hover:bg-white/5 transition-colors">
                      <span className="text-sm font-medium">{comm.name}</span>
                      <span className="text-xs text-muted">{comm.role}</span>
                    </Link>
                  )) : (
                    <p className="text-sm text-muted">Not participating yet.</p>
                  )}
                </div>
              </div>

              {/* Certificates */}
              <div className="rounded-3xl border border-line bg-black/20 p-6">
                <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                  <BadgeCheck className="h-5 w-5 text-emerald-400" /> Verified Credentials
                </h2>
                <div className="space-y-3">
                  {profile.certificates.length > 0 ? profile.certificates.map((cert) => (
                    <div key={cert.id} className="rounded-lg border border-line bg-black/40 p-3">
                      <p className="text-sm font-medium">{cert.title}</p>
                      <p className="text-xs text-muted mt-1">{cert.issuedAt}</p>
                    </div>
                  )) : (
                    <p className="text-sm text-muted">No verified credentials.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </main>
      <Footer />
    </>
  );
}
