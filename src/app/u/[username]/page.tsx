import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Award, Briefcase, Link2, Users, Workflow, Calendar, Activity, Zap } from "lucide-react";
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
        <div className="mx-auto max-w-7xl">
          <Panel className="overflow-hidden">
            <div className="h-56 bg-[radial-gradient(circle_at_25%_20%,rgba(198,161,111,0.28),transparent_32%),linear-gradient(135deg,#111,#050505)]" />
            <div className="p-6 md:p-8">
              <div className="-mt-20 size-32 rounded-[8px] border border-bronze/50 bg-gradient-to-br from-bronze via-rust to-steel p-1">
                <div className="grid size-full place-items-center rounded-[6px] bg-black text-5xl font-semibold">
                  {profile.avatarFallback}
                </div>
              </div>
              <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_320px]">
                <div>
                  <h1 className="text-5xl font-semibold tracking-[-0.04em]">{profile.name}</h1>
                  <p className="mt-2 text-muted">@{profile.username}</p>
                  <p className="mt-4 text-xl text-bronze">{profile.headline}</p>
                  <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">{profile.bio}</p>
                  
                  {/* Badges Section */}
                  {profile.badges && profile.badges.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-3">
                      {profile.badges.map((badge) => (
                        <div key={badge} className="flex items-center gap-1.5 rounded-full bg-bronze/10 px-3 py-1.5 text-xs font-medium text-bronze border border-bronze/20">
                          <Zap className="size-3.5" />
                          {badge}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Skills Section */}
                  {profile.skills && profile.skills.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <span key={skill} className="rounded-[4px] bg-white/[0.05] px-2.5 py-1 text-xs text-muted border border-white/[0.05]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-7 flex flex-wrap gap-3">
                    {profile.socials.map((social) => (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-muted transition hover:border-bronze/50 hover:text-foreground"
                      >
                        <Link2 className="size-4" />
                        {social.label}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="grid gap-3 content-start">
                  {profile.stats.map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between rounded-[8px] border border-line bg-black/35 px-4 py-3">
                      <span className="text-sm text-muted">{stat.label}</span>
                      <span className="font-mono text-bronze">{stat.value}</span>
                    </div>
                  ))}
                  {profile.memberSince && (
                    <div className="mt-2 text-center text-xs text-muted">
                      Member since {profile.memberSince}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Panel>

          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {/* Experience Panel */}
            {profile.experiences.length > 0 && (
              <Panel className="p-5 lg:col-span-2">
                <div className="flex items-center gap-2 text-2xl font-medium">
                  <Briefcase className="size-5 text-rust" />
                  Experience
                </div>
                <div className="mt-5 space-y-4">
                  {profile.experiences.map((experience) => (
                    <div key={experience.id} className="border-l-2 border-bronze/20 pl-4">
                      <p className="text-sm text-muted">{experience.period}</p>
                      <h2 className="mt-1 text-lg font-medium">{experience.title}</h2>
                      <p className="text-sm text-muted">{experience.org}</p>
                      {experience.description ? (
                        <p className="mt-2 text-sm leading-6 text-muted">{experience.description}</p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {/* Communities Panel */}
            {profile.communities.length > 0 && (
              <Panel className="p-5">
                <div className="flex items-center gap-2 text-2xl font-medium">
                  <Users className="size-5 text-rust" />
                  Communities
                </div>
                <div className="mt-5 space-y-3">
                  {profile.communities.map((community) => (
                    <Link
                      key={community.id}
                      href={`/communities/${community.slug}`}
                      className="flex items-center justify-between rounded-[8px] border border-line bg-black/30 px-4 py-3 text-sm transition hover:border-bronze/50"
                    >
                      <span>{community.name}</span>
                      <span className="text-muted">{community.role}</span>
                    </Link>
                  ))}
                </div>
              </Panel>
            )}

            {/* Projects Panel */}
            {profile.projects.length > 0 && (
              <Panel className="p-5 lg:col-span-2">
                <div className="flex items-center gap-2 text-2xl font-medium">
                  <Workflow className="size-5 text-rust" />
                  Projects
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {profile.projects.map((project) => (
                    <div key={project.id} className="rounded-[8px] border border-line bg-black/30 p-4">
                      <h2 className="text-lg font-medium">{project.name}</h2>
                      <p className="mt-2 text-sm leading-6 text-muted">{project.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.technologies.map((technology) => (
                          <span key={technology} className="rounded-full bg-white/[0.06] px-3 py-1 text-xs text-muted">
                            {technology}
                          </span>
                        ))}
                      </div>
                      {project.url ? (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex items-center gap-2 text-sm text-bronze"
                        >
                          View project
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {/* Recent Events Panel */}
            {profile.recentEvents.length > 0 && (
              <Panel className="p-5">
                <div className="flex items-center gap-2 text-2xl font-medium">
                  <Calendar className="size-5 text-rust" />
                  Recent Events
                </div>
                <div className="mt-5 space-y-3">
                  {profile.recentEvents.map((event) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.slug}`}
                      className="block rounded-[8px] border border-line bg-black/30 p-4 transition hover:border-bronze/50"
                    >
                      <p className="font-medium">{event.title}</p>
                      <p className="mt-1 text-sm text-muted">{event.role}</p>
                    </Link>
                  ))}
                </div>
              </Panel>
            )}

            {/* Activity Timeline Panel */}
            {profile.activityTimeline && profile.activityTimeline.length > 0 && (
              <Panel className="p-5 lg:col-span-2">
                <div className="flex items-center gap-2 text-2xl font-medium">
                  <Activity className="size-5 text-rust" />
                  Activity Timeline
                </div>
                <div className="mt-5 space-y-4">
                  {profile.activityTimeline.map((activity) => (
                    <div key={activity.id} className="flex gap-4">
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-bronze" />
                      <div>
                        <p className="text-sm text-muted">{activity.date}</p>
                        <p className="mt-1 font-medium">{activity.description}</p>
                        <p className="text-sm text-muted">{activity.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            {/* Certificates Panel */}
            {profile.certificates.length > 0 && (
              <Panel className="p-5">
                <div className="flex items-center gap-2 text-2xl font-medium">
                  <Award className="size-5 text-rust" />
                  Certificates
                </div>
                <div className="mt-5 space-y-3">
                  {profile.certificates.map((certificate) => (
                    <div key={certificate.id} className="rounded-[8px] border border-line bg-black/30 p-4">
                      <p className="font-medium">{certificate.title}</p>
                      <p className="mt-1 text-sm text-muted">{certificate.type}</p>
                      <p className="mt-2 text-xs text-bronze">{certificate.issuedAt}</p>
                    </div>
                  ))}
                </div>
              </Panel>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
