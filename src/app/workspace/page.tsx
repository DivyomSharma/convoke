import { updateOpportunityApplicationStatus } from "@/app/actions";
import Link from "next/link";
import { Bell, Briefcase, CalendarDays, FileBadge2, Megaphone, Shirt, Sparkles, Users } from "lucide-react";
import { Footer } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { ButtonLink } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { getDashboardData } from "@/lib/platform-service";

const statusStyles: Record<string, string> = {
  Approved: "bg-emerald-500/12 text-emerald-300",
  Pending: "bg-amber-500/12 text-amber-300",
  Waitlisted: "bg-white/10 text-white/70",
  Applied: "bg-steel/15 text-steel",
  Reviewing: "bg-bronze/15 text-bronze",
  Shortlisted: "bg-emerald-500/12 text-emerald-300",
  Interview: "bg-rust/15 text-rust",
  Accepted: "bg-emerald-500/12 text-emerald-300",
  Rejected: "bg-red-500/12 text-red-300",
  Contacted: "bg-steel/15 text-steel",
  Negotiating: "bg-bronze/15 text-bronze",
  Confirmed: "bg-emerald-500/12 text-emerald-300",
};

function statusClass(status: string) {
  return statusStyles[status] ?? "bg-white/10 text-white/70";
}

export default async function WorkspacePage() {
  const dashboard = await getDashboardData();

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen px-5 pb-24 pt-28 md:px-8">
        <div className="mx-auto max-w-7xl">
          <section className="grid gap-6 lg:grid-cols-[1.06fr_0.94fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-bronze">Workspace</p>
              <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em] md:text-7xl">{dashboard.viewer.name}</h1>
              <p className="mt-3 text-lg text-foreground/90">{dashboard.viewer.headline}</p>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
                This is your operating layer for applications, registrations, community presence, certifications, and role-specific next actions.
              </p>
            </div>

            <Panel className="p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {dashboard.metrics.map((metric) => (
                  <div key={metric.label} className="rounded-[8px] border border-line bg-black/30 px-4 py-3">
                    <p className="text-xs text-muted">{metric.label}</p>
                    <p className="mt-2 text-lg font-medium">{metric.value}</p>
                    <p className="mt-2 text-xs text-muted">{metric.detail}</p>
                  </div>
                ))}
              </div>
            </Panel>
          </section>

          <section className="mt-12 grid gap-6 xl:grid-cols-[1fr_1fr_320px]">
            <div className="space-y-6">
              <Panel className="p-5">
                <div className="flex items-center gap-2 text-lg font-medium">
                  <CalendarDays className="size-5 text-bronze" />
                  Registrations
                </div>
                <div className="mt-5 space-y-3">
                  {dashboard.registrations.length ? (
                    dashboard.registrations.map((registration) => (
                      <Link
                        key={registration.id}
                        href={`/events/${registration.eventSlug}`}
                        className="flex items-center justify-between gap-4 rounded-[8px] border border-line bg-black/30 px-4 py-4 transition hover:border-bronze/40"
                      >
                        <div>
                          <p className="font-medium">{registration.eventTitle}</p>
                          <p className="mt-1 text-xs text-muted">{registration.ticketType ?? "Registration"} / {registration.createdAt}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs ${statusClass(registration.status)}`}>{registration.status}</span>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-muted">No registrations yet. Start by joining your first event.</p>
                  )}
                </div>
              </Panel>

              <Panel className="p-5">
                <div className="flex items-center gap-2 text-lg font-medium">
                  <Briefcase className="size-5 text-bronze" />
                  Applications
                </div>
                <div className="mt-5 space-y-3">
                  {dashboard.applications.length ? (
                    dashboard.applications.map((application) => (
                      <div key={application.id} className="flex items-center justify-between gap-4 rounded-[8px] border border-line bg-black/30 px-4 py-4">
                        <div>
                          <p className="font-medium">{application.title}</p>
                          <p className="mt-1 text-xs text-muted">{application.organization} / {application.appliedAt}</p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs ${statusClass(application.status)}`}>{application.status}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted">No applications yet. The opportunity layer is ready when you are.</p>
                  )}
                </div>
                <ButtonLink href="/opportunities" variant="secondary" className="mt-5">Browse opportunities</ButtonLink>
              </Panel>

              <Panel className="p-5">
                <div className="flex items-center gap-2 text-lg font-medium">
                  <Sparkles className="size-5 text-bronze" />
                  Activity around you
                </div>
                <div className="mt-5 space-y-3">
                  {dashboard.activity.length ? (
                    dashboard.activity.map((item) => (
                      <div key={item.id} className="rounded-[8px] border border-line bg-black/30 p-4">
                        <p className="font-medium">{item.actor} {item.action}</p>
                        <p className="mt-2 text-sm leading-6 text-muted">{item.detail}</p>
                        <p className="mt-2 text-xs text-bronze">{item.createdAt}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted">Activity appears here when the communities you belong to actually move.</p>
                  )}
                </div>
              </Panel>
            </div>

            <div className="space-y-6">
              <Panel className="p-5">
                <div className="flex items-center gap-2 text-lg font-medium">
                  <Bell className="size-5 text-bronze" />
                  Notifications
                </div>
                <div className="mt-5 space-y-3">
                  {dashboard.notifications.length ? (
                    dashboard.notifications.map((notification) => (
                      <div key={notification.id} className="rounded-[8px] border border-line bg-black/30 px-4 py-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">{notification.title}</p>
                            <p className="mt-2 text-sm leading-6 text-muted">{notification.message}</p>
                          </div>
                          {notification.unread ? <span className="mt-1 size-2 rounded-full bg-bronze" /> : null}
                        </div>
                        <p className="mt-3 text-xs text-muted">{notification.createdAt}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted">Notifications will show up once workflows begin moving.</p>
                  )}
                </div>
              </Panel>

              <Panel className="p-5">
                <div className="flex items-center gap-2 text-lg font-medium">
                  <FileBadge2 className="size-5 text-bronze" />
                  Certificates
                </div>
                <div className="mt-5 space-y-3">
                  {dashboard.certificates.length ? (
                    dashboard.certificates.map((certificate) => (
                      <div key={certificate.id} className="rounded-[8px] border border-line bg-black/30 px-4 py-4">
                        <p className="font-medium">{certificate.title}</p>
                        <p className="mt-1 text-xs text-muted">{certificate.type} / {certificate.issuedAt}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted">Certificates will appear once your participation produces them.</p>
                  )}
                </div>
              </Panel>

              <Panel className="p-5">
                <div className="flex items-center gap-2 text-lg font-medium">
                  <Users className="size-5 text-bronze" />
                  Communities
                </div>
                <div className="mt-5 space-y-3">
                  {dashboard.communities.length ? (
                    dashboard.communities.map((community) => (
                      <Link key={community.id} href={`/communities/${community.slug}`} className="flex items-center justify-between rounded-[8px] border border-line bg-black/30 px-4 py-4 transition hover:border-bronze/40">
                        <div>
                          <p className="font-medium">{community.name}</p>
                          <p className="mt-1 text-xs text-muted">{community.role}</p>
                        </div>
                        <span className="text-xs text-bronze">Open</span>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-muted">No community memberships yet.</p>
                  )}
                </div>
              </Panel>
            </div>

            <div className="space-y-6">
              <Panel className="bg-gradient-to-br from-bronze/12 via-transparent to-rust/8 p-5">
                <h3 className="text-lg font-medium">Role-aware next moves</h3>
                <div className="mt-5 space-y-3">
                  {dashboard.roleActions.map((action) => (
                    <Link key={action.href} href={action.href} className="block rounded-[8px] border border-line bg-black/30 px-4 py-4 transition hover:border-bronze/50">
                      <p className="font-medium">{action.title}</p>
                      <p className="mt-2 text-sm leading-6 text-muted">{action.copy}</p>
                    </Link>
                  ))}
                </div>
                <ButtonLink href="/workspace/organize" className="mt-5 w-full">
                  Open organizer console
                </ButtonLink>
              </Panel>

              <Panel className="p-5">
                <h3 className="text-lg font-medium">Saved for later</h3>
                <div className="mt-5 space-y-4 text-sm text-muted">
                  <p>{dashboard.bookmarks.events.length} saved events</p>
                  <p>{dashboard.bookmarks.opportunities.length} saved opportunities</p>
                  <p>{dashboard.bookmarks.communities.length} saved communities</p>
                </div>
                <ButtonLink href="/discover" variant="secondary" className="mt-5">Keep discovering</ButtonLink>
              </Panel>
            </div>
          </section>

          {dashboard.organizerData ? (
            <section className="mt-16 space-y-6">
              <div>
                <h2 className="text-3xl font-semibold tracking-[-0.03em] md:text-4xl">Organizer operations</h2>
                <p className="mt-3 text-sm leading-6 text-muted">
                  These sections now pull from real organizations, sponsor leads, volunteer applications, merch inquiries, and studio requests.
                </p>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                <Panel className="p-5">
                  <h3 className="text-lg font-medium">Published events</h3>
                  <div className="mt-5 space-y-3">
                    {dashboard.organizerData.events.length ? (
                      dashboard.organizerData.events.map((event) => (
                        <Link key={event.id} href={`/events/${event.slug}`} className="flex items-center justify-between rounded-[8px] border border-line bg-black/30 px-4 py-4 transition hover:border-bronze/40">
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <p className="mt-1 text-xs text-muted">{event.city} / {event.date}</p>
                          </div>
                          <span className="text-xs text-bronze">{event.attendees.toLocaleString("en-IN")} joined</span>
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-muted">No events published yet.</p>
                    )}
                  </div>
                </Panel>

                <Panel className="p-5">
                  <h3 className="text-lg font-medium">Published opportunities</h3>
                  <div className="mt-5 space-y-3">
                    {dashboard.organizerData.opportunities.length ? (
                      dashboard.organizerData.opportunities.map((opportunity) => (
                        <Link key={opportunity.id} href={`/opportunities/${opportunity.slug}`} className="flex items-center justify-between rounded-[8px] border border-line bg-black/30 px-4 py-4 transition hover:border-bronze/40">
                          <div>
                            <p className="font-medium">{opportunity.title}</p>
                            <p className="mt-1 text-xs text-muted">{opportunity.type} / {opportunity.location}</p>
                          </div>
                          <span className="text-xs text-bronze">{opportunity.applicants} applied</span>
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-muted">No opportunities published yet.</p>
                    )}
                  </div>
                </Panel>

                <Panel className="p-5">
                  <h3 className="text-lg font-medium">Sponsor pipeline</h3>
                  <div className="mt-5 space-y-3">
                    {dashboard.organizerData.sponsorLeads.length ? (
                      dashboard.organizerData.sponsorLeads.map((lead) => (
                        <div key={lead.id} className="rounded-[8px] border border-line bg-black/30 px-4 py-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-medium">{lead.companyName}</p>
                            <span className={`rounded-full px-3 py-1 text-xs ${statusClass(lead.stage)}`}>{lead.stage}</span>
                          </div>
                          <p className="mt-2 text-xs text-muted">{lead.contactEmail}{lead.eventTitle ? ` / ${lead.eventTitle}` : ""}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted">No sponsor leads yet.</p>
                    )}
                  </div>
                </Panel>

                <Panel className="p-5">
                  <h3 className="text-lg font-medium">Volunteer applications</h3>
                  <div className="mt-5 space-y-3">
                    {dashboard.organizerData.volunteerApplications.length ? (
                      dashboard.organizerData.volunteerApplications.map((application) => (
                        <div key={application.id} className="rounded-[8px] border border-line bg-black/30 px-4 py-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-medium">{application.userName}</p>
                              <p className="mt-1 text-xs text-muted">{application.eventTitle} / {application.role}</p>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-xs ${statusClass(application.status)}`}>{application.status}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted">No volunteer applications yet.</p>
                    )}
                  </div>
                </Panel>

                <Panel className="p-5">
                  <h3 className="text-lg font-medium">Opportunity applications</h3>
                  <div className="mt-5 space-y-3">
                    {dashboard.organizerData.applications.length ? (
                      dashboard.organizerData.applications.map((application) => (
                        <div key={application.id} className="rounded-[8px] border border-line bg-black/30 px-4 py-4">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="font-medium">{application.applicantName}</p>
                              <p className="mt-1 text-xs text-muted">
                                {application.opportunityTitle} / {application.applicantEmail}
                              </p>
                            </div>
                            <span className={`rounded-full px-3 py-1 text-xs ${statusClass(application.status)}`}>{application.status}</span>
                          </div>
                          <p className="mt-2 text-xs text-muted">{application.createdAt}</p>
                          {application.portfolioUrl ? (
                            <a href={application.portfolioUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs text-bronze">
                              Open portfolio
                            </a>
                          ) : null}
                          <form
                            action={async (formData) => {
                              "use server";
                              await updateOpportunityApplicationStatus({
                                applicationId: application.id,
                                status: String(formData.get("status") ?? "REVIEWING"),
                              });
                            }}
                            className="mt-4 flex flex-wrap gap-2"
                          >
                            <select
                              name="status"
                              defaultValue={application.status.toUpperCase().replace(/ /g, "_")}
                              className="h-10 rounded-full border border-line bg-black/40 px-4 text-xs text-foreground outline-none"
                            >
                              {["APPLIED", "REVIEWING", "SHORTLISTED", "INTERVIEW", "ACCEPTED", "REJECTED"].map((item) => (
                                <option key={item} value={item}>{item.replaceAll("_", " ")}</option>
                              ))}
                            </select>
                            <button type="submit" className="inline-flex h-10 items-center justify-center rounded-full border border-line px-4 text-xs text-muted transition hover:border-bronze/50 hover:text-foreground">
                              Update
                            </button>
                          </form>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted">No opportunity applications yet.</p>
                    )}
                  </div>
                </Panel>

                <Panel className="p-5">
                  <div className="flex items-center gap-2 text-lg font-medium">
                    <Shirt className="size-5 text-bronze" />
                    Merch requests
                  </div>
                  <div className="mt-5 space-y-3">
                    {dashboard.organizerData.merchInquiries.length ? (
                      dashboard.organizerData.merchInquiries.map((inquiry) => (
                        <div key={inquiry.id} className="rounded-[8px] border border-line bg-black/30 px-4 py-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="font-medium">{inquiry.apparelType}</p>
                            <span className={`rounded-full px-3 py-1 text-xs ${statusClass(inquiry.status)}`}>{inquiry.status}</span>
                          </div>
                          <p className="mt-2 text-xs text-muted">{inquiry.quantity} units / {inquiry.city}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted">No merch requests created yet.</p>
                    )}
                  </div>
                </Panel>

                <Panel className="p-5">
                  <div className="flex items-center gap-2 text-lg font-medium">
                    <Megaphone className="size-5 text-bronze" />
                    Studio support
                  </div>
                  <div className="mt-5 space-y-3">
                    {dashboard.organizerData.studioRequests.length ? (
                      dashboard.organizerData.studioRequests.map((request) => (
                        <div key={request.id} className="rounded-[8px] border border-line bg-black/30 px-4 py-4">
                          <p className="font-medium">{request.title}</p>
                          <p className="mt-2 text-xs text-muted">{request.type} / {request.status}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted">No studio requests yet.</p>
                    )}
                  </div>
                </Panel>
              </div>
            </section>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
