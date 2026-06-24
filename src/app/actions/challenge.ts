"use server";

import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

function generateSlug(text: string) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '') + '-' + Math.random().toString(36).substring(2, 6);
}

export async function createChallenge(formData: FormData) {
  const user = await requireUser();
  
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const type = formData.get("type") as string;
  const orgId = formData.get("organizationId") as string;
  
  if (!name || !orgId) return { error: "Name and Organization are required." };

  const slug = generateSlug(name);

  let challenge;
  try {
    challenge = await prisma.challenge.create({
      data: {
        name,
        slug,
        description,
        type,
        organizationId: orgId
      }
    });
  } catch (error) {
    return { error: "Failed to create challenge." };
  }

  redirect(`/organizations/${orgId}/manage`);
}