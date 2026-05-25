import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Award, Briefcase, Link2, Users, Workflow, Calendar, Activity, Zap, MapPin, Map, CheckCircle2 } from "lucide-react";
import { Footer } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { Panel } from "@/components/ui/panel";
import { getProfilePageData } from "@/lib/platform-service";

type PageProps = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { username } = await params;
  const profile = await getProfilePageData(username);

  return {
    title: profile ? `${profile.name}` : "Profile",
    description: profile?.bio || "Portfolio-first ecosystem profile on Convoke.",
  };
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;
  const profile = await getProfilePageData(username);

  if (!profile) {
    notFound();
  }

  return (
    <>
      <SiteHeader />
      <main className="px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-[1100px]">
          
          {/* Identity Hero */}
          <div className="group relative overflow-hidden rounded-[24px] border border-line bg-black shadow-[0_8px_40px_rgba(0,0,0,0.4)] transition duration-500 hover:border-bronze/30">
            {/* Banner Glows */}
            <div className="absolute -inset-x-20 -top-20 h-64 bg-[radial-gradient(ellipse_at_center,rgba(198,161,111,0.15),transparent_60%)] opacity-70 transition duration-1000 group-hover:opacity-100" />
            <div className="absolute right-0 top-0 h-40 w-96 bg-[radial-gradient(ellipse_at_top_right,rgba(138,90,59,0.2),transparent_70%)]" />
            
            <div className="relative p-8 md:p-12">
              <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
                
                {/* Avatar & Core Identity */}
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
                  <div className="relative size-32 shrink-0 rounded-full border border-white/[0.08] bg-black/50 p-1 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                    <div className="grid size-full place-items-center rounded-full bg-gradient-to-br from-bronze to-rust text-5xl font-semibold text-black">
                      {profile.avatarFallback}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{profile.name}</h1>
                      {profile.reputation > 50 && (
                        <div className="flex items-center gap-1 rounded-full border border-bronze/20 bg-bronze/10 px-2 py-1 text-xs font-medium text-bronze">
                          <Zap className="size-3" />
                          Top 5%
                        </div>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-muted">
                      <p className="font-medium text-foreground/80">@{profile.username}</p>
                      <div className="h-1 w-1 rounded-full bg-line" />
                      <p className="flex items-center gap-1.5"><MapPin className="size-4" /> {profile.location || "Remote"}</p>
                      <div className="h-1 w-1 rounded-full bg-line" />
                      <p className="flex items-center gap-1.5"><CheckCircle2 className="size-4" /> Member since {profile.memberSince}</p>
                    </div>
                    <p className="mt-4 max-w-2xl text-lg font-medium text-bronze">{profile.headline}</p>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex shrink-0 gap-4 rounded-2xl border border-white/[0.04] bg-white/[0.02] p-4 backdrop-blur-md">
                  {profile.stats.slice(0, 3).map((stat) => (
                    <div key={stat.label} className="text-center px-4">
                      <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                      <p className="text-xs font-medium text-muted">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Badges & Tags */}
              <div className="mt-8 flex flex-wrap gap-2">
                {profile.badges?.map((badge) => (
                  <div key={badge} className="flex items-center gap-1.5 rounded-full border border-bronze/30 bg-bronze/10 px-3 py-1.5 text-xs font-medium text-bronze shadow-[0_0_10px_rgba(198,161,111,0.1)]">
                    <Award className="size-3.5" />
                    {badge}
                  </div>
                ))}
                {profile.skills?.map((skill) => (
                  <div key={skill} className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-foreground/80">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
            
            {/* Main Column */}
            <div className="space-y-6">
              
              {/* About Section */}
              {profile.bio && (
                <Panel className="p-8 group hover:border-bronze/20 transition duration-300">
                  <h2 className="text-sm font-medium uppercase tracking-[0.2em] text-muted">About</h2>
                  <p className="mt-4 text-lg leading-relaxed text-foreground/90">{profile.bio}</p>
                  
                  {/* Social Links inside About */}
                  {profile.socials.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      {profile.socials.map((social) => (
                        <a
                          key={social.label}
                          href={social.href}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.02] px-4 py-2 text-sm font-medium text-foreground/80 transition hover:border-bronze/50 hover:bg-white/[0.04] hover:text-foreground"
                        >
                          <Link2 className="size-4" />
                          {social.label}
                        </a>
                      ))}
                    </div>
                  )}
                </Panel>
              )}

              {/* Projects Bento */}
              {profile.projects.length > 0 && (
                <Panel className="p-8 group hover:border-bronze/20 transition duration-300">
                  <div className="flex items-center gap-3">
                    <Workflow className="size-5 text-bronze" />
                    <h2 className="text-xl font-semibold">Featured Work</h2>
                  </div>
                  <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {profile.projects.map((project) => (
                      <div key={project.id} className="group/project rounded-[16px] border border-white/[0.05] bg-white/[0.02] p-5 transition hover:bg-white/[0.04]">
                        <h3 className="text-lg font-medium">{project.name}</h3>
                        <p className="mt-2 text-sm leading-6 text-muted">{project.description}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {project.technologies.map((tech) => (
                            <span key={tech} className="rounded-md bg-white/[0.06] px-2 py-1 text-[11px] font-medium text-muted">
                              {tech}
                            </span>
                          ))}
                        </div>
                        {project.url && (
                          <a href={project.url} target="_blank" rel="noreferrer" className="mt-4 inline-block text-sm font-medium text-bronze opacity-0 transition group-hover/project:opacity-100">
                            Visit project →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </Panel>
              )}

              {/* Experience Timeline */}
              {profile.experiences.length > 0 && (
                <Panel className="p-8 group hover:border-bronze/20 transition duration-300">
                  <div className="flex items-center gap-3">
                    <Briefcase className="size-5 text-bronze" />
                    <h2 className="text-xl font-semibold">Experience</h2>
                  </div>
                  <div className="mt-8 space-y-8">
                    {profile.experiences.map((exp, i) => (
                      <div key={exp.id} className="relative flex gap-6">
                        {/* Timeline Line */}
                        {i !== profile.experiences.length - 1 && (
                          <div className="absolute bottom-0 left-[11px] top-8 w-px bg-line" />
                        )}
                        <div className="relative mt-1.5 h-6 w-6 shrink-0 rounded-full border-4 border-black bg-bronze/50" />
                        
                        <div>
                          <p className="text-sm font-medium text-bronze">{exp.period}</p>
                          <h3 className="mt-1 text-lg font-medium">{exp.title}</h3>
                          <p className="text-muted">{exp.org}</p>
                          {exp.description && (
                            <p className="mt-2 text-sm leading-relaxed text-foreground/80">{exp.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              )}

            </div>

            {/* Sidebar Column */}
            <div className="space-y-6">
              
              {/* Communities */}
              {profile.communities.length > 0 && (
                <Panel className="p-6">
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-bronze" />
                    <h2 className="font-semibold">Communities</h2>
                  </div>
                  <div className="mt-4 space-y-3">
                    {profile.communities.map((community) => (
                      <Link
                        key={community.id}
                        href={`/communities/${community.slug}`}
                        className="group flex items-center justify-between rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 transition hover:border-bronze/30 hover:bg-white/[0.04]"
                      >
                        <span className="font-medium">{community.name}</span>
                        <span className="text-xs text-muted group-hover:text-bronze">{community.role}</span>
                      </Link>
                    ))}
                  </div>
                </Panel>
              )}

              {/* Recent Events */}
              {profile.recentEvents.length > 0 && (
                <Panel className="p-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-bronze" />
                    <h2 className="font-semibold">Recent Events</h2>
                  </div>
                  <div className="mt-4 space-y-3">
                    {profile.recentEvents.map((event) => (
                      <Link
                        key={event.id}
                        href={`/events/${event.slug}`}
                        className="group block rounded-xl border border-white/[0.04] bg-white/[0.02] p-3 transition hover:border-bronze/30 hover:bg-white/[0.04]"
                      >
                        <p className="font-medium line-clamp-1">{event.title}</p>
                        <p className="mt-1 text-xs text-muted">{event.role}</p>
                      </Link>
                    ))}
                  </div>
                </Panel>
              )}

              {/* Activity Feed */}
              {profile.activityTimeline && profile.activityTimeline.length > 0 && (
                <Panel className="p-6">
                  <div className="flex items-center gap-2">
                    <Activity className="size-4 text-bronze" />
                    <h2 className="font-semibold">Live Activity</h2>
                  </div>
                  <div className="mt-5 space-y-4">
                    {profile.activityTimeline.slice(0, 5).map((activity) => (
                      <div key={activity.id} className="flex gap-3 text-sm">
                        <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-bronze/50" />
                        <div>
                          <p className="text-foreground/80">{activity.description} <span className="font-medium text-foreground">{activity.title}</span></p>
                          <p className="mt-0.5 text-xs text-muted">{activity.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              )}
              
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
