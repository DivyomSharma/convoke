import { z } from "zod";

export const userRoleSchema = z.enum([
  "PARTICIPANT",
  "ORGANIZER",
  "COMMUNITY_ADMIN",
  "VOLUNTEER",
  "SPONSOR",
  "STARTUP",
  "CREATOR",
  "PLATFORM_ADMIN",
]);

export const registrationSchema = z.object({
  eventId: z.string().cuid(),
  ticketTypeId: z.string().cuid().optional(),
});

export const merchInquirySchema = z.object({
  apparelType: z.string().min(2),
  quantity: z.coerce.number().int().positive(),
  budget: z.string().min(2),
  timeline: z.string().min(2),
  city: z.string().min(2),
  references: z.array(z.string()).default([]),
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
  ]),
});

export const createCommunitySchema = z.object({
  organizationName: z.string().min(2).max(80),
  organizationType: z.enum([
    "STARTUP",
    "COMMUNITY",
    "COLLEGE_SOCIETY",
    "CREATOR_COLLECTIVE",
    "NGO",
    "BRAND",
    "SPONSOR",
    "PLATFORM",
    "AGENCY",
  ]),
  communityName: z.string().min(2).max(80),
  category: z.enum([
    "STARTUP",
    "COLLEGE",
    "CREATOR",
    "AI",
    "DESIGN",
    "OPEN_SOURCE",
    "GAMING",
    "SOCIAL_IMPACT",
    "NGO",
  ]),
  city: z.string().min(2).max(80),
  tagline: z.string().min(10).max(180),
  description: z.string().min(30).max(3000),
  website: z.string().url().optional().or(z.literal("")),
});

export const createEventSchema = z.object({
  organizationId: z.string().cuid(),
  communityId: z.string().cuid().optional().or(z.literal("")),
  title: z.string().min(4).max(120),
  category: z.string().min(2).max(60),
  city: z.string().min(2).max(80),
  venue: z.string().min(2).max(120).optional().or(z.literal("")),
  mode: z.enum(["ONLINE", "OFFLINE", "HYBRID"]),
  shortDescription: z.string().min(20).max(220),
  description: z.string().min(40).max(5000),
  startsAt: z.string().min(1),
  endsAt: z.string().min(1),
  isPaid: z.coerce.boolean().default(false),
  approvalBased: z.coerce.boolean().default(false),
  featured: z.coerce.boolean().default(false),
  priceInr: z.coerce.number().int().min(0).default(0),
  ticketName: z.string().min(2).max(60).default("General Pass"),
  ticketCapacity: z.coerce.number().int().positive().default(100),
});

export const createOpportunitySchema = z.object({
  organizationId: z.string().cuid(),
  communityId: z.string().cuid().optional().or(z.literal("")),
  title: z.string().min(4).max(120),
  type: z.enum([
    "INTERNSHIP",
    "AMBASSADOR",
    "STARTUP_HIRING",
    "VOLUNTEER_ROLE",
    "CREATOR_COLLABORATION",
    "FREELANCE_GIG",
  ]),
  location: z.string().min(2).max(80),
  isRemote: z.coerce.boolean().default(false),
  shortDescription: z.string().min(20).max(220),
  description: z.string().min(40).max(5000),
  requirements: z.string().min(2),
  skills: z.string().min(2),
  perks: z.string().optional().default(""),
  stipend: z.string().optional().or(z.literal("")),
  duration: z.string().optional().or(z.literal("")),
  applicationDeadline: z.string().min(1),
  positionsAvailable: z.coerce.number().int().positive().default(1),
  featured: z.coerce.boolean().default(false),
});

export const applicationStatusSchema = z.object({
  applicationId: z.string().cuid(),
  status: z.enum([
    "APPLIED",
    "REVIEWING",
    "SHORTLISTED",
    "INTERVIEW",
    "ACCEPTED",
    "REJECTED",
  ]),
});
