import { Shell } from "@/components/Shell";
import { AmbientGlow } from "@/components/AmbientGlow";
import { prisma } from "@/lib/prisma";
import { EventsList } from "./EventsList";

export const revalidate = 0; // Fresh listing upon event creations

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    include: {
      space: {
        include: {
          organization: true,
        },
      },
      _count: {
        select: {
          attendance: true,
        },
      },
    },
    orderBy: {
      startTime: "asc",
    },
  }).catch(() => []);

  // Query spaces to allow hosting events in them
  const spaces = await prisma.space.findMany({
    include: {
      organization: true,
    },
  }).catch(() => []);

  return (
    <Shell>
      <div className="relative mx-auto min-h-screen max-w-[1240px] px-5 py-12 sm:px-8">
        <AmbientGlow className="top-8 right-0 h-[28rem] w-[28rem] opacity-[0.05]" color="var(--brand)" />

        <EventsList initialEvents={events} spaces={spaces} />
      </div>
    </Shell>
  );
}
