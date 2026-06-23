"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

export async function toggleFollow(targetId: string, targetType: "USER" | "SPACE" | "ORGANIZATION" | "PROJECT" | "RESEARCH", currentPath: string) {
  const user = await requireUser();

  if (user.id === targetId && targetType === "USER") {
    return { success: false, error: "You cannot follow yourself." };
  }

  const existingFollow = await prisma.follow.findUnique({
    where: {
      followerId_targetId_targetType: {
        followerId: user.id,
        targetId,
        targetType,
      }
    }
  });

  if (existingFollow) {
    await prisma.follow.delete({
      where: { id: existingFollow.id }
    });
  } else {
    await prisma.follow.create({
      data: {
        followerId: user.id,
        targetId,
        targetType,
      }
    });
  }

  revalidatePath(currentPath);
  return { success: true, isFollowing: !existingFollow };
}
