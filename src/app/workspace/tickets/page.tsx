import Link from "next/link";
import { CalendarCheck, Ticket } from "lucide-react";
import { AmbientGlow } from "@/components/AmbientGlow";
import { DigitalPass, TicketState } from "@/components/DigitalPass";
import { Shell } from "@/components/Shell";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

function passState(status: string): TicketState {
  if (status === "GOING" || status === "ACCEPTED") return "CONFIRMED";
  if (status === "WAITLISTED") return "WAITLISTED";
  if (status === "CHECKED_IN") return "CHECKED_IN";
  return "REGISTERED";
}

function passId(prefix: string, value: string) {
  return `${prefix}-${value.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export default async function MyTicketsPage() {
  const user = await requireUser();

  const [registrations, challengeApplications] = await Promise.all([
    prisma.eventAttendance.findMany({
      where: { userId: user.id },
      include: {
        event: {
          include: {
            space: {
              include: {
                organization: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.application.findMany({
      where: {
        userId: user.id,
        opportunity: {
          type: {
            in: ["HACKATHON", "CHALLENGE"],
          },
        },
      },
      include: {
        opportunity: {
          include: {
            organization: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const eventPasses = registrations.map((registration, index) => {
    const event = registration.event;

    return {
      ticketId: passId("EVT", registration.id),
      eventName: event.title,
      orgName: event.space.organization.name,
      date: new Date(event.startTime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: new Date(event.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      venue: event.venue || event.location || "Online",
      userName: user.name || "Convoke member",
      userAvatar: user.avatarUrl || "",
      seat: event.capacity ? `GEN-${String(index + 1).padStart(2, "0")}` : "OPEN",
      type: registration.status === "INTERESTED" ? "Interested" : "Event pass",
      state: passState(registration.status),
      bannerUrl: event.bannerUrl || undefined,
      orgLogo: event.space.organization.logoUrl || undefined,
    };
  });

  const challengePasses = challengeApplications.map((application, index) => {
    const opportunity = application.opportunity;

    return {
      ticketId: passId("CHL", application.id),
      eventName: opportunity.title,
      orgName: opportunity.organization.name,
      date: opportunity.deadline
        ? new Date(opportunity.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
        : "Rolling",
      time: "Submission window",
      venue: opportunity.location || "Online",
      userName: user.name || "Convoke member",
      userAvatar: user.avatarUrl || "",
      seat: `TEAM-${String(index + 1).padStart(2, "0")}`,
      type: opportunity.type === "HACKATHON" ? "Hackathon" : "Challenge",
      state: passState(application.status),
      bannerUrl: opportunity.bannerUrl || undefined,
      orgLogo: opportunity.organization.logoUrl || undefined,
    };
  });

  const passes = [...eventPasses, ...challengePasses];

  return (
    <Shell>
      <div className="relative mx-auto min-h-screen max-w-[1240px] px-5 py-12 sm:px-8">
        <AmbientGlow className="right-20 top-20 h-[34rem] w-[34rem] opacity-[0.05]" color="var(--brand)" />

        <section className="campus-frame premium-card p-7 md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="eyebrow">Workspace wallet</div>
              <h1 className="mt-3 serif text-5xl tracking-tight md:text-7xl">My Passes</h1>
              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-g5">
                Event RSVPs and challenge registrations become scannable passes tied to your Convoke identity.
              </p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-g3 bg-g1/70 px-4 py-2 mono text-[12px] uppercase tracking-[0.16em] text-g5">
              <Ticket size={14} className="text-[var(--brand)]" />
              {passes.length} Pass{passes.length === 1 ? "" : "es"}
            </div>
          </div>
        </section>

        {passes.length === 0 ? (
          <section className="mt-8 premium-card p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-g3 bg-g1 text-[var(--brand)]">
              <CalendarCheck size={26} />
            </div>
            <h2 className="mt-6 serif text-3xl">No passes yet</h2>
            <p className="mx-auto mt-3 max-w-[42ch] text-[15px] leading-7 text-g5">
              Register for an event or join a challenge to generate your first Convoke pass.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/events" className="ink-button px-5 text-[14px] font-medium">
                Browse events
              </Link>
              <Link href="/challenges" className="ghost-button px-5 text-[14px] font-medium">
                Browse challenges
              </Link>
            </div>
          </section>
        ) : (
          <section className="relative z-10 mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {passes.map((pass) => (
              <DigitalPass key={pass.ticketId} {...pass} />
            ))}
          </section>
        )}
      </div>
    </Shell>
  );
}
