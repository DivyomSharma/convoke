"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createSpace(formData: FormData) {
  const user = await requireUser();

  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const description = formData.get("description") as string;
  const organizationId = formData.get("organizationId") as string;
  const categoryRaw = formData.get("category") as string;
  const region = formData.get("region") as string;

  if (!name || !organizationId) {
    return { error: "Name and Organization are required" };
  }

  // Validate that user is admin or founder of the org
  const membership = await prisma.membership.findUnique({
    where: { userId_organizationId: { userId: user.id, organizationId } }
  });

  if (!membership || !["ADMIN", "FOUNDER"].includes(membership.role)) {
    return { error: "Not authorized to create spaces for this organization" };
  }

  const categoryArray = categoryRaw ? categoryRaw.split(",").map(s => s.trim()).filter(Boolean) : [];

  const space = await prisma.space.create({
    data: {
      name,
      type,
      description,
      organizationId,
      category: categoryArray,
      region: region || null,
      members: {
        create: {
          userId: user.id,
          role: "FOUNDER"
        }
      }
    }
  });

  revalidatePath("/workspace");
  return { success: true, spaceId: space.id };
}
