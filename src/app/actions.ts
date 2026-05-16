"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import {
  merchInquirySchema,
  registrationSchema,
  sponsorLeadSchema,
} from "@/lib/schemas";

export async function registerForEvent(input: unknown) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Authentication is required.");
  }

  const data = registrationSchema.parse(input);
  revalidatePath(`/events/${data.eventId}`);
  return { ok: true, registrationId: `reg_${Date.now()}` };
}

export async function createMerchInquiry(input: unknown) {
  const data = merchInquirySchema.parse(input);
  revalidatePath("/merch");
  return {
    ok: true,
    status: "INQUIRY_RECEIVED",
    whatsappMessage: `Convoke merch inquiry: ${data.apparelType}, ${data.quantity}, ${data.city}`,
  };
}

export async function upsertSponsorLead(input: unknown) {
  const data = sponsorLeadSchema.parse(input);
  revalidatePath("/workspace");
  return { ok: true, lead: data.companyName };
}
