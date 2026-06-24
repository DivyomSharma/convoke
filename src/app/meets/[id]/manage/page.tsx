import { notFound, redirect } from "next/navigation";
import { Shell } from "@/components/Shell";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { MeetManageClient } from "./MeetManageClient";

export const metadata = {
  title: "Manage Meet | Convoke",
};

export default async function MeetManagePage(props: { params?: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params?.id;
  if (!id) return notFound();

  const user = await requireUser();

  const meet = await prisma.meet.findUnique({
    where: { id },
    include: {
      space: {
        include: {
          organization: true,
          members: true
        }
      },
      applications: {
        include: { user: true },
        orderBy: { createdAt: "desc" }
      },
      attendance: {
        include: { user: true },
        orderBy: { createdAt: "asc" }
      },
      sponsorshipRequests: {
        include: { sponsor: true },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!meet) return notFound();

  const isSpaceAdmin = meet.space.members.some(m => 
    m.userId === user.id && ["FOUNDER", "LEAD", "ORGANIZER"].includes(m.role)
  );

  if (!isSpaceAdmin) {
    redirect(`/meets/${id}`);
  }

  return (
    <Shell wide>
      <div className="pt-[100px] px-5 sm:px-8 max-w-[1440px] mx-auto pb-10">
        <MeetManageClient meet={meet} currentUserId={user.id} />
      </div>
    </Shell>
  );
}
