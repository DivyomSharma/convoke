import Link from "next/link";
import {
  Bell,
  Briefcase,
  CalendarDays,
  FileBadge2,
  Megaphone,
  Shirt,
  Users,
} from "lucide-react";
import { Footer } from "@/components/marketing/footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { ButtonLink } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { getDashboardData } from "@/lib/platform-service";

const statusStyles: Record<string, string> = {
  APPROVED: "bg-emerald-500/12 text-emerald-300",
  PENDING: "bg-amber-500/12 text-amber-300",
  WAITLISTED: "bg-white/10 text-white/70",
  APPLIED: "bg-steel/15 text-steel",
  REVIEWING: "bg-bronze/15 text-bronze",
  SHORTLISTED: "bg-emerald-500/12 text-emerald-300",
  REJECTED: "bg-red-500/12 text-red-300",
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
              <p className="text-sm uppercase tracking-[0.24em] text-bronze">
                Workspace
              </p>
              <h1 className="mt-4 text-5xl font-semibold tracking-[-0.05em] md:text-7xl">
                {dashboard.viewer.name}
              </h1>
              <p className="mt-3 text-lg text-foreground/90">
                {dashboard.viewer.headline}
              </p>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-muted">
                This is your active area for registrations, applications,
                communities, certificates, and the work you are organizing.
              </p>
            </div>

            <Panel className="p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[8px] border border-line bg-black/30 px-4 py-3">
                  <p className="text-xs text-muted">Role</p>
                  <p className="mt-2 text-lg font-medium">{dashboard.viewer.role}</p>
                </div>
                <div className="rounded-[8px] border border-line bg-black/30 px-4 py-3">
                  <p className="text-xs text-muted">Communities</p>
                  <p className="mt-2 text-lg font-medium">{dashboard.communities.length}</p>
                </div>
                <div className="rounded-[8px] border border-line bg-black/30 px-4 py-3">
                  <p className="text-xs text-muted">Registrations</p>
                  <p className="mt-2 text-lg font-medium">{dashboard.registrations.length}</p>
                </div>
                <div className="rounded-[8px] border border-line bg-black/30 px-4 py-3">
                  <p className="text-xs text-muted">Applications</p>
                  <p className="mt-2 text-lg font-medium">{dashboard.applications.length}</p>
                </div>
              </div>
            </Panel>
          </section>

          <section className="mt-12 grid gap-6 xl:grid-cols-[1fr_1fr_320px]">
            <div className="space-y-6">
              <Panel className="p-5">
                <div className="flex items-center gap-2 text-lg font-medium">
                  <CalendarDays className="size-5 text-bronze" />
                  Registered events
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
                          <p className="mt-1 text-xs text-muted">
                            {registration.ticketType ?? "Registration"} / {registration.createdAt}
                          </p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs ${statusClass(registration.status)}`}>
                          {registration.status}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-muted">
                      No registrations yet. Your event timeline starts once you join one.
                    </p>
                  )}
                </div>
              </Panel>

              <Panel className="p-5">
                <div className="flex items-center gap-2 text-lg font-medium">
                  <Briefcase className="size-5 text-bronze" />
                  Opportunity applications
                </div>
                <div className="mt-5 space-y-3">
                  {dashboard.applications.length ? (
                    dashboard.applications.map((application) => (
                      <div
                        key={application.id}
                        className="flex items-center justify-between gap-4 rounded-[8px] border border-line bg-black/30 px-4 py-4"
                      >
                        <div>
                          <p className="font-medium">{application.title}</p>
                          <p className="mt-1 text-xs text-muted">
                            {application.organization} / {application.appliedAt}
                          </p>
                        </div>
                        <span className={`rounded-full px-3 py-1 text-xs ${statusClass(application.status)}`}>
                          {application.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted">
                      You have not applied anywhere yet. Start from the opportunities directory.
                    </p>
                  )}
                </div>
                <ButtonLink href="/opportunities" variant="secondary" className="mt-5">
                  Browse opportunities
                </ButtonLink>
              </Panel>

              <Panel className="p-5">
                <div className="flex items-center gap-2 text-lg font-medium">
                  <Users className="size-5 text-bronze" />
                  Your communities
                </div>
                <div className="mt-5 grid gap-3">
                  {dashboard.communities.length ? (
                    dashboard.communities.map((community) => (
                      <Link
                        key={community.id}
                        href={`/communities/${community.slug}`}
                        className="flex items-center justify-between gap-3 rounded-[8px] border border-line bg-black/30 px-4 py-4 transition hover:border-bronze/40"
                      >
                        <div>
                          <p className="font-medium">{community.name}</p>
                          <p className="mt-1 text-xs text-muted">{community.role}</p>
                        </div>
                        <span className="text-xs text-bronze">Open</span>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-muted">
                      Join a community to keep events, roles, and updates attached to your identity.
                    </p>
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
                      <div
                        key={notification.id}
                        className="rounded-[8px] border border-line bg-black/30 px-4 py-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">{notification.title}</p>
                            <p className="mt-2 text-sm leading-6 text-muted">
                              {notification.message}
                            </p>
                          </div>
                          {notification.unread ? (
                            <span className="mt-1 size-2 rounded-full bg-bronze" />
                          ) : null}
                        </div>
                        <p className="mt-3 text-xs text-muted">{notification.createdAt}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted">
                      Notifications will appear when registrations, applications, or approvals move.
                    </p>
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
                      <div
                        key={certificate.id}
                        className="rounded-[8px] border border-line bg-black/30 px-4 py-4"
                      >
                        <p className="font-medium">{certificate.title}</p>
                        <p className="mt-1 text-xs text-muted">
                          {certificate.type} / {certificate.issuedAt}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted">
                      Certificates show up here once an event or community issues them.
                    </p>
                  )}
                </div>
              </Panel>

              <Panel className="p-5">
                <h3 className="text-lg font-medium">Saved for later</h3>
                <div className="mt-5 space-y-4 text-sm text-muted">
                  <p>{dashboard.bookmarks.events.length} saved events</p>
                  <p>{dashboard.bookmarks.opportunities.length} saved opportunities</p>
                  <p>{dashboard.bookmarks.communities.length} saved communities</p>
                </div>
                <ButtonLink href="/discover" variant="secondary" className="mt-5">
                  Keep discovering
                </ButtonLink>
              </Panel>
            </div>

            <div className="space-y-6">
              <Panel className="bg-gradient-to-br from-bronze/12 via-transparent to-rust/8 p-5">
                <h3 className="text-lg font-medium">Organize through the ecosystem</h3>
                <p className="mt-3 text-sm leading-6 text-muted">
                  Run events, recruit volunteers, post opportunities, request merch,
                  and move sponsor conversations without leaving your community graph.
                </p>
                <div className="mt-5 space-y-3">
                  <ButtonLink href="/events" className="w-full">
                    Open events
                  </ButtonLink>
                  <ButtonLink href="/merch" variant="secondary" className="w-full">
                    Start merch inquiry
                  </ButtonLink>
                </div>
              </Panel>

              {dashboard.organizerData ? (
                <>
                  <Panel className="p-5">
                    <div className="flex items-center gap-2 text-lg font-medium">
                      <Megaphone className="size-5 text-bronze" />
                      Sponsor pipeline
                    </div>
                    <div className="mt-5 space-y-3">
                      {dashboard.organizerData.sponsorLeads.length ? (
                        dashboard.organizerData.sponsorLeads.map((lead) => (
                          <div
                            key={lead.id}
                            className="rounded-[8px] border border-line bg-black/30 px-4 py-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-medium">{lead.companyName}</p>
                              <span className={`rounded-full px-3 py-1 text-xs ${statusClass(lead.stage)}`}>
                                {lead.stage}
                              </span>
                            </div>
                            <p className="mt-2 text-xs text-muted">
                              {lead.contactEmail}
                              {lead.eventTitle ? ` / ${lead.eventTitle}` : ""}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted">
                          Sponsor requests and outreach stages will collect here.
                        </p>
                      )}
                    </div>
                  </Panel>

                  <Panel className="p-5">
                    <div className="flex items-center gap-2 text-lg font-medium">
                      <Users className="size-5 text-bronze" />
                      Volunteer applications
                    </div>
                    <div className="mt-5 space-y-3">
                      {dashboard.organizerData.volunteerApplications.length ? (
                        dashboard.organizerData.volunteerApplications.map((application) => (
                          <div
                            key={application.id}
                            className="rounded-[8px] border border-line bg-black/30 px-4 py-4"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div>
                                <p className="font-medium">{application.userName}</p>
                                <p className="mt-1 text-xs text-muted">
                                  {application.eventTitle} / {application.role}
                                </p>
                              </div>
                              <span className={`rounded-full px-3 py-1 text-xs ${statusClass(application.status)}`}>
                                {application.status}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted">
                          Volunteer approvals will appear once applications start coming in.
                        </p>
                      )}
                    </div>
                  </Panel>

                  <Panel className="p-5">
                    <div className="flex items-center gap-2 text-lg font-medium">
                      <Shirt className="size-5 text-bronze" />
                      Organizer quick links
                    </div>
                    <div className="mt-5 space-y-3">
                      <ButtonLink href="/merch" variant="secondary" className="w-full">
                        Open merch flow
                      </ButtonLink>
                      <a
                        href="https://studio.theplotarmour.xyz/?utm_source=convoke"
                        className="inline-flex w-full items-center justify-center rounded-full border border-line bg-white/[0.03] px-5 py-3 text-sm text-foreground transition hover:border-bronze/40"
                      >
                        Request Studio support
                      </a>
                    </div>
                  </Panel>
                </>
              ) : null}
            </div>
          </section>

          {dashboard.organizerData ? (
            <section className="mt-16 space-y-6">
              <div>
                <h2 className="text-3xl font-semibold tracking-[-0.03em] md:text-4xl">
                  Organizer view
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted">
                  These sections are pulled from your organizations, live events,
                  registrations, volunteer applications, and opportunity entities.
                </p>
              </div>

              <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                <Panel className="p-5">
                  <h3 className="text-lg font-medium">Your events</h3>
                  <div className="mt-5 space-y-3">
                    {dashboard.organizerData.events.length ? (
                      dashboard.organizerData.events.map((event) => (
                        <Link
                          key={event.id}
                          href={`/events/${event.slug}`}
                          className="flex items-center justify-between rounded-[8px] border border-line bg-black/30 px-4 py-4 transition hover:border-bronze/40"
                        >
                          <div>
                            <p className="font-medium">{event.title}</p>
                            <p className="mt-1 text-xs text-muted">
                              {event.city} / {event.date}
                            </p>
                          </div>
                          <span className="text-xs text-bronze">
                            {event.attendees.toLocaleString("en-IN")} joined
                          </span>
                        </Link>
                      ))
                    ) : (
                      <p className="text-sm text-muted">
                        No event entities yet. Once you create one, it appears here.
                      </p>
                    )}
                  </div>
                </Panel>

                <Panel className="p-5">
                  <h3 className="text-lg font-medium">Incoming registrations</h3>
                  <div className="mt-5 space-y-3">
                    {dashboard.organizerData.registrations.length ? (
                      dashboard.organizerData.registrations.map((registration) => (
                        <div
                          key={registration.id}
                          className="flex items-center justify-between gap-4 rounded-[8px] border border-line bg-black/30 px-4 py-4"
                        >
                          <div>
                            <p className="font-medium">{registration.userName}</p>
                            <p className="mt-1 text-xs text-muted">
                              {registration.userEmail} / {registration.eventTitle}
                            </p>
                          </div>
                          <span className={`rounded-full px-3 py-1 text-xs ${statusClass(registration.status)}`}>
                            {registration.status}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted">
                        Registration approvals and waitlists appear here once people start joining.
                      </p>
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
