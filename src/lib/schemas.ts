import { z } from "zod";

export const userRoleSchema = z.enum([
  "ATTENDEE",
  "ORGANIZER",
  "VOLUNTEER",
  "SPONSOR",
  "NGO",
  "CREATOR",
  "STARTUP_COMMUNITY",
  "ADMIN",
]);

export const registrationSchema = z.object({
  eventId: z.string().cuid(),
  ticketTypeId: z.string().cuid().optional(),
  referralCode: z.string().max(64).optional(),
});

export const merchInquirySchema = z.object({
  apparelType: z.string().min(2),
  quantity: z.coerce.number().int().positive(),
  budget: z.string().min(2),
  timeline: z.string().min(2),
  city: z.string().min(2),
  references: z.array(z.string().url()).default([]),
  stylePreferences: z.string().max(2000).optional(),
});

export const sponsorLeadSchema = z.object({
  organizationId: z.string().cuid(),
  eventId: z.string().cuid().optional(),
  companyName: z.string().min(2),
  contactEmail: z.string().email(),
  pipelineStage: z.enum([
    "PROSPECTING",
    "CONTACTED",
    "REPLIED",
    "NEGOTIATING",
    "CONFIRMED",
    "COMPLETED",
  ]),
});
