import { notFound, redirect } from "next/navigation";
import { Shell } from "@/components/Shell";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { SpaceManageClient } from "./SpaceManageClient";

export const metadata = {
  title: "Manage Space | Convoke",
};

export default async function SpaceManagePage(props: { params?: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params?.id;
  if (!id) return notFound();

  const user = await requireUser();

  const space = await prisma.space.findUnique({
    where: { id },
    include: {
      organization: true,
      members: {
        include: { user: true },
        orderBy: { createdAt: "asc" }
      }
    }
  });

  if (!space) return notFound();

  const myMembership = space.members.find(m => m.userId === user.id);
  const isAdmin = myMembership?.role === "FOUNDER" || myMembership?.role === "LEAD" || myMembership?.role === "ORGANIZER";

  if (!isAdmin) {
    redirect(`/spaces/${id}`);
  }

  return (
    <Shell wide>
      <div className="pt-[100px] px-5 sm:px-8 max-w-[1440px] mx-auto pb-10">
        <SpaceManageClient space={space} currentUserId={user.id} />
      </div>
    </Shell>
  );
}
