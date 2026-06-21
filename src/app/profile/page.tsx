import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/auth");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, handle: true, username: true },
  }).catch(() => null);

  if (!user) {
    redirect("/workspace");
  }

  redirect(`/profile/${user.handle || user.username || "builder"}`);
}
