"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createResearch(formData: FormData) {
  const user = await requireUser();

  const title = formData.get("title") as string;
  const abstract = formData.get("abstract") as string;
  const url = formData.get("url") as string;
  const spaceId = formData.get("spaceId") as string; // optional

  if (!title) {
    return { error: "Title is required" };
  }

  const research = await prisma.research.create({
    data: {
      title,
      abstract,
      url,
      userId: user.id,
      spaceId: spaceId || null,
    }
  });

  revalidatePath("/research");
  if (spaceId) {
    revalidatePath(`/spaces/${spaceId}`);
  }
  
  return { success: true, redirectUrl: `/research/${research.id}` };
}
