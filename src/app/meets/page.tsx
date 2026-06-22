import { Shell } from "@/components/Shell";
import { AmbientGlow } from "@/components/AmbientGlow";
import { prisma } from "@/lib/prisma";
import { MeetsList } from "./MeetsList";

export const revalidate = 0; // Fresh listing upon meet creations

import { auth } from "@clerk/nextjs/server";

export default async function EventsPage() {
  const meets = await prisma.meet.findMany({
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

  const { userId } = await auth();

  // Query spaces to allow hosting meets in them
  const spaces = userId ? await prisma.space.findMany({
    where: {
      organization: {
        members: {
          some: {
            userId,
            role: { in: ["ADMIN", "FOUNDER"] }
          }
        }
      }
    },
    include: {
      organization: true,
    },
  }).catch(() => []) : [];

  return (
    <Shell>
      <div className="relative mx-auto min-h-screen max-w-[1240px] px-5 py-12 sm:px-8">
        <AmbientGlow className="top-8 right-0 h-[28rem] w-[28rem] opacity-[0.05]" color="var(--brand)" />

        <MeetsList initialEvents={meets} spaces={spaces} />
      </div>
    </Shell>
  );
}
