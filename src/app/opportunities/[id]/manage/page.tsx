import { notFound, redirect } from "next/navigation";
import { Shell } from "@/components/Shell";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { OppManageClient } from "./OppManageClient";

export const metadata = {
  title: "Manage Opportunity | Convoke",
};

export default async function OpportunityManagePage(props: { params?: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params?.id;
  if (!id) return notFound();

  const user = await requireUser();

  const opp = await prisma.opportunity.findUnique({
    where: { id },
    include: {
      organization: {
        include: { members: true }
      },
      space: {
        include: { members: true }
      },
      applications: {
        include: { user: true },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!opp) return notFound();

  let isAdmin = false;
  if (opp.organization) {
    isAdmin = opp.organization.members.some(m => m.userId === user.id && ["FOUNDER", "ADMIN", "LEAD"].includes(m.role));
  } else if (opp.space) {
    isAdmin = opp.space.members.some(m => m.userId === user.id && ["FOUNDER", "ADMIN", "LEAD", "ORGANIZER"].includes(m.role));
  }

  if (!isAdmin) {
    // Determine backlink
    const isHackathon = ["HACKATHON/CHALLENGE"].includes(opp.type);
    redirect(isHackathon ? `/challenges/${id}` : `/opportunities/${id}`);
  }

  return (
    <Shell wide>
      <div className="pt-[100px] px-5 sm:px-8 max-w-[1440px] mx-auto pb-10">
        <OppManageClient opp={opp} currentUserId={user.id} />
      </div>
    </Shell>
  );
}
