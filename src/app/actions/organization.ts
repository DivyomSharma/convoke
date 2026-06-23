"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createOrganization(formData: FormData) {
  const user = await requireUser();

  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const description = formData.get("description") as string;
  const website = formData.get("website") as string;

  if (!name) return { error: "Organization name is required" };

  const org = await prisma.organization.create({
    data: {
      name,
      type: type || "Community",
      description,
      website,
      ownerId: user.id,
      members: {
        create: {
          userId: user.id,
          role: "FOUNDER",
        }
      }
    }
  });

  revalidatePath("/workspace");
  revalidatePath("/organizations");
  return { success: true, organizationId: org.id };
}

export async function updateOrganization(organizationId: string, formData: FormData) {
  const user = await requireUser();
  const org = await prisma.organization.findUnique({ where: { id: organizationId } });
  
  if (!org || org.ownerId !== user.id) {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  await prisma.organization.update({
    where: { id: organizationId },
    data: { name, description }
  });

  revalidatePath(`/organizations/${organizationId}`);
  revalidatePath(`/organizations/${organizationId}/manage`);
  return { success: true };
}
