"use server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleBookmark(itemId: string, itemType: string, pathToRevalidate?: string) {
  const user = await requireUser();

  const existing = await prisma.bookmark.findFirst({
    where: {
      userId: user.id,
      itemId,
      itemType
    }
  });

  if (existing) {
    await prisma.bookmark.delete({
      where: { id: existing.id }
    });
  } else {
    await prisma.bookmark.create({
      data: {
        userId: user.id,
        itemId,
        itemType
      }
    });
  }

  if (pathToRevalidate) {
    revalidatePath(pathToRevalidate);
  }

  return { success: true, bookmarked: !existing };
}
