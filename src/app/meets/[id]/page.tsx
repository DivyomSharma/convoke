import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import {
  Building2,
  Calendar,
  ChevronDown,
  Clock3,
  FileText,
  MapPin,
  Navigation,
} from "lucide-react";
import { AmbientGlow } from "@/components/AmbientGlow";
import { Avatar } from "@/components/Avatar";
import { Shell } from "@/components/Shell";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { RsvpClient } from "./RsvpClient";

export const revalidate = 60;

export async function generateMetadata(props: { params?: Promise<{ id: string }> }): Promise<Metadata> {
  const params = await props.params;
  const id = params?.id;
  if (!id) return { title: "Meet not found" };

  const meet = await prisma.meet.findUnique({
    where: { id },
    include: {
      space: {
        include: {
          organization: true,
        },
      },
    },
  }).catch(() => null);

  if (!meet) return { title: "Meet not found" };

  const title = `${meet.title} | Convoke Meet`;
  const description = meet.description || `Join ${meet.title} on Convoke.`;
  const image = meet.bannerUrl || "https://convoke.xyz/og-image.jpg";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [image],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: `https://convoke.xyz/meets/${id}`,
    },
  };
}

export default async function EventDetailPage(props: { params?: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params?.id;
  if (!id) return notFound();

  const meet = await prisma.meet.findUnique({
    where: { id },
    include: {
      space: {
        include: {
          organization: {
            include: {
              members: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      },
      attendance: {
        include: {
          user: true
        }
      },
      faqs: true,
      sponsors: true,
      resources: true,
    },
  }).catch(() => null);

  if (!meet) return notFound();

  const viewer = await requireUser().catch(() => null);
  const myAttendance = viewer ? meet.attendance.find((entry) => entry.userId === viewer.id) : null;
  const initialStatus = myAttendance ? myAttendance.status : null;
  
  const isOrganizer = viewer ? meet.space.organization?.members.some(
    (m) => m.userId === viewer.id && (m.role === "ADMIN" || m.role === "FOUNDER")
  ) : false;

  const isFull = Boolean(meet.capacity && meet.attendance.filter(a => a.status === "GOING" || a.status === "CHECKED_IN").length >= meet.capacity);
  const price = "Free";

  const attendeesCount = meet.attendance.filter(a => a.status === "GOING" || a.status === "CHECKED_IN").length;

  return (
    <Shell wide>
      <div className="relative min-h-screen pb-20 text-ink">
        {/* Banner area */}
        <div className="relative h-[220px] w-full overflow-hidden border-b border-g3 bg-g1 md:h-[300px]">
          {meet.bannerUrl ? (
            <img src={meet.bannerUrl} alt={meet.title} className="h-full w-full object-cover opacity-80" />
          ) : (
            <div className="h-full w-full bg-[#0A0A0A] border-b border-g3 flex items-center justify-center">
              <span className="serif text-8xl text-g2 select-none">C.</span>
            </div>
          )}
        </div>

        <div className="relative z-20 mx-auto -mt-16 max-w-[1080px] px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-8">
              {/* Meet briefing */}
              <section className="border border-g3 rounded-sm p-6 md:p-8 bg-paper-card">
                <div className="mono text-[10px] uppercase tracking-wider text-brand mb-4">
                  (Gathering)
                </div>
                <h1 className="serif text-4xl leading-tight md:text-5xl font-light">{meet.title}</h1>
                <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-g5">
                  {meet.description || "No public overview has been published yet."}
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="border border-g3 rounded-sm p-4">
                    <div className="eyebrow">Date</div>
                    <div className="mt-2 text-[14px] text-ink font-medium">
                      {new Date(meet.startTime).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </div>
                  </div>
                  <div className="border border-g3 rounded-sm p-4">
                    <div className="eyebrow">Time</div>
                    <div className="mt-2 text-[14px] text-ink font-medium">
                      {new Date(meet.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <div className="border border-g3 rounded-sm p-4">
                    <div className="eyebrow">Location</div>
                    <div className="mt-2 text-[14px] text-ink font-medium">
                      {meet.location || "Online"}
                    </div>
                  </div>
                  <div className="border border-g3 rounded-sm p-4">
                    <div className="eyebrow">Capacity</div>
                    <div className="mt-2 text-[14px] text-ink font-medium">
                      {meet.capacity ? `${meet.capacity} seats` : "Open RSVP"}
                    </div>
                  </div>
                </div>
              </section>

              {/* Host & Venue */}
              <section className="grid gap-6 md:grid-cols-2">
                <div className="border border-g3 rounded-sm p-6 bg-paper-card">
                  <div className="eyebrow">Host</div>
                  <Link href={meet.space.organization?.slug ? `/org/${meet.space.organization.slug}` : "#"} className="mt-4 flex items-center gap-4 group">
                    <div className="flex h-12 w-12 items-center justify-center rounded-sm border border-g3 bg-g1 overflow-hidden">
                      {meet.space.organization?.logoUrl ? (
                        <img src={meet.space.organization.logoUrl} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <Building2 size={16} className="text-brand" />
                      )}
                    </div>
                    <div>
                      <div className="serif text-xl group-hover:underline">{meet.space.organization?.name || meet.space.name}</div>
                      <div className="text-[11px] mono uppercase text-g4">{meet.space.name}</div>
                    </div>
                  </Link>
                  <p className="mt-4 text-[13px] leading-relaxed text-g5">
                    {meet.space.organization?.description || "Collective space updates are synced here."}
                  </p>
                </div>

                <div className="border border-g3 rounded-sm p-6 bg-paper-card">
                  <div className="eyebrow">Venue Notes</div>
                  <div className="mt-4 space-y-2 text-[13px] text-g5">
                    <div className="text-ink font-medium">{meet.venue || "TBA"}</div>
                    <div>{meet.location || "Details drop before start."}</div>
                    {meet.requirements && <div className="mt-2 pt-2 border-t border-g1">{meet.requirements}</div>}
                  </div>
                </div>
              </section>

              {/* SVG Attendance Certificate for Checked-In Users */}
              {initialStatus === "CHECKED_IN" && (
                <div className="border border-g3 rounded-sm p-6 bg-paper-card text-ink">
                  <div className="mono text-[10px] uppercase tracking-[0.2em] text-brand mb-4">Credentials Verification</div>
                  <div className="border border-ink/15 p-6 rounded-sm bg-black text-[#EAEAEA] relative overflow-hidden flex flex-col justify-between aspect-[1.6/1]">
                    <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
                      <span className="serif text-[120px] font-bold">C.</span>
                    </div>
                    <div>
                      <div className="mono text-[9px] tracking-widest text-g4 uppercase">Convoke Passport</div>
                      <h4 className="serif text-2xl mt-4 font-light tracking-tight text-brand">Certificate of Attendance</h4>
                    </div>
                    <div className="mt-4 space-y-1">
                      <p className="text-[13px] text-g5 font-light">
                        This certifies that <span className="text-[#EAEAEA] font-medium">{viewer?.name || "Builder"}</span> checked in and participated in
                      </p>
                      <p className="serif text-xl italic text-white leading-tight">{meet.title}</p>
                    </div>
                    <div className="mt-6 flex items-center justify-between text-[9px] mono uppercase tracking-wider text-g4 border-t border-g4/20 pt-4">
                      <span>Verified MMXXVI</span>
                      <span>Record: {myAttendance?.id.slice(0, 8)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Organizer Link */}
              {isOrganizer && (
                <div className="border border-g3 rounded-sm p-6 bg-paper-card text-center">
                  <div className="text-xl serif text-ink mb-2">Organizer Access</div>
                  <p className="text-[14px] text-g5 mb-4">View applications, track attendance, and manage event settings.</p>
                  <Link href={`/meets/${meet.id}/manage`} className="ink-button inline-flex px-6 py-2.5 text-[13px] font-semibold">
                    Manage Event
                  </Link>
                </div>
              )}

              {/* FAQs */}
              {meet.faqs.length > 0 && (
                <section className="space-y-4">
                  <div className="eyebrow">FAQs</div>
                  <div className="space-y-3">
                    {meet.faqs.map((faq) => (
                      <details key={faq.id} className="border border-g3 rounded-sm p-4 bg-paper-card group">
                        <summary className="flex cursor-pointer items-center justify-between text-[14px] font-medium text-ink outline-none list-none">
                          <span>{faq.question}</span>
                          <ChevronDown size={14} className="text-g4 transition-transform group-open:rotate-180" />
                        </summary>
                        <p className="mt-3 border-t border-g1 pt-3 text-[13px] leading-relaxed text-g5">
                          {faq.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar RSVP widget */}
            <div className="space-y-6">
              <div className="sticky top-20 space-y-6">
                <RsvpClient
                  meetId={meet.id}
                  initialStatus={initialStatus}
                  isFull={isFull}
                  price={price}
                  attendeesCount={attendeesCount}
                  capacity={meet.capacity}
                  userId={viewer?.id}
                />

                <div className="border border-g3 rounded-sm p-6 bg-paper-card">
                  <div className="eyebrow mb-4">Attendees</div>
                  <div className="flex flex-wrap gap-2">
                    {meet.attendance.filter(a => a.status === "GOING" || a.status === "CHECKED_IN").length > 0 ? (
                      meet.attendance.filter(a => a.status === "GOING" || a.status === "CHECKED_IN").map((entry) => (
                        <div key={entry.id} className="flex items-center gap-2 rounded-sm border border-g3 bg-g1 px-2.5 py-1 text-[12px]">
                          <Avatar src={entry.user.avatarUrl || ""} name={entry.user.name || "Member"} size={20} />
                          <span className="text-ink font-medium">{entry.user.name || "Member"}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[13px] leading-relaxed text-g5">
                        First builders to RSVP will appear here.
                      </p>
                    )}
                  </div>
                </div>

                {meet.sponsors.length > 0 && (
                  <div className="border border-g3 rounded-sm p-6 bg-paper-card">
                    <div className="eyebrow">Sponsors</div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {meet.sponsors.map((sponsor) => (
                        <span key={sponsor.id} className="rounded-sm border border-g3 bg-g1 px-2.5 py-1 text-[12px] text-ink">
                          {sponsor.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {meet.resources.length > 0 && (
                  <div className="border border-g3 rounded-sm p-6 bg-paper-card">
                    <div className="eyebrow">Resources</div>
                    <div className="mt-4 space-y-2">
                      {meet.resources.map((resource) => (
                        <a
                          key={resource.id}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between rounded-sm border border-g3 bg-g1 px-3 py-2 text-[13px] text-g5 hover:text-ink hover:border-g4 transition-all"
                        >
                          <span className="truncate">{resource.name}</span>
                          <span className="text-[11px] opacity-70">→</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
