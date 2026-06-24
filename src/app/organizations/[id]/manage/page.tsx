import { notFound, redirect } from "next/navigation";
import { Shell } from "@/components/Shell";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { OrgManageClient } from "./OrgManageClient";

export const metadata = {
  title: "Manage Organization | Convoke",
};

export default async function OrgManagePage(props: { params?: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params?.id;
  if (!id) return notFound();

  const user = await requireUser();

  const org = await prisma.organization.findUnique({
    where: { id },
    include: {
      members: {
        include: { user: true },
        orderBy: { createdAt: "asc" }
      },
      spaces: true,
      challenges: true,
      sponsorshipRequests: {
        include: {
          requester: true,
          meet: true,
          challenge: true
        },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!org) return notFound();

  const myMembership = org.members.find(m => m.userId === user.id);
  const isAdmin = myMembership?.role === "FOUNDER" || myMembership?.role === "ADMIN" || myMembership?.role === "LEAD";

  if (!isAdmin) {
    redirect(`/organizations/${id}`);
  }

  return (
    <Shell wide>
      <div className="pt-[100px] px-5 sm:px-8 max-w-[1440px] mx-auto pb-10">
        <OrgManageClient org={org} currentUserId={user.id} />
      </div>
    </Shell>
  );
}
