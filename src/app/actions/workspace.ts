"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";

export async function rsvpToEvent(eventId: string, status: "GOING" | "INTERESTED") {
  const user = await requireUser();

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    select: { capacity: true }
  });

  if (!event) {
    throw new Error("Event not found.");
  }

  const existingAttendance = await prisma.eventAttendance.findUnique({
    where: {
      eventId_userId: {
        eventId,
        userId: user.id,
      },
    },
  });

  let finalStatus: string = status;
  if (status === "GOING" && existingAttendance?.status !== "GOING") {
    // Check current GOING count
    const goingCount = await prisma.eventAttendance.count({
      where: {
        eventId,
        status: "GOING",
      },
    });

    if (event.capacity && goingCount >= event.capacity) {
      finalStatus = "WAITLISTED";
    }
  }

  await prisma.eventAttendance.upsert({
    where: {
      eventId_userId: {
        eventId,
        userId: user.id,
      },
    },
    update: {
      status: finalStatus,
    },
    create: {
      eventId,
      userId: user.id,
      status: finalStatus,
    },
  });

  // Re-calculate waitlist count for the event
  const waitlistCount = await prisma.eventAttendance.count({
    where: {
      eventId,
      status: "WAITLISTED",
    },
  });

  await prisma.event.update({
    where: { id: eventId },
    data: { waitlistCount },
  });

  revalidatePath("/workspace");
  revalidatePath("/workspace/tickets");
  revalidatePath("/events");
  revalidatePath(`/events/${eventId}`);
  return { success: true, status: finalStatus };
}

export async function applyToOpportunity(opportunityId: string) {
  const user = await requireUser();
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: opportunityId },
    select: { type: true },
  });

  if (!opportunity) {
    throw new Error("Opportunity not found.");
  }

  const existing = await prisma.application.findFirst({
    where: { opportunityId, userId: user.id },
  });

  if (existing) {
    throw new Error("Already applied to this opportunity.");
  }

  await prisma.application.create({
    data: {
      opportunityId,
      userId: user.id,
      status: "PENDING",
    },
  });

  revalidatePath("/workspace");
  revalidatePath("/workspace/tickets");
  revalidatePath("/opportunities");
  revalidatePath(`/opportunities/${opportunityId}`);
  if (opportunity.type === "HACKATHON" || opportunity.type === "CHALLENGE") {
    revalidatePath("/challenges");
    revalidatePath(`/challenges/${opportunityId}`);
  }
  return { success: true };
}

export async function joinSpace(organizationId: string) {
  const user = await requireUser();

  const existing = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId: user.id,
        organizationId,
      },
    },
  });

  if (existing) {
    throw new Error("Already a member.");
  }

  await prisma.membership.create({
    data: {
      userId: user.id,
      organizationId,
      role: "MEMBER",
    },
  });

  const org = await prisma.organization.findUnique({
    where: { id: organizationId },
    select: { slug: true },
  });

  revalidatePath("/workspace");
  revalidatePath("/spaces");
  if (org) {
    revalidatePath("/org/" + org.slug);
  }
  return { success: true };
}

export async function postMessage(spaceId: string, content: string) {
  const user = await requireUser();
  if (!content || !content.trim()) {
    throw new Error("Message content cannot be empty.");
  }

  await prisma.message.create({
    data: {
      content: content.trim(),
      spaceId,
      userId: user.id,
    },
  });

  revalidatePath(`/spaces/${spaceId}`);
  return { success: true };
}

export async function createOrganization(data: {
  name: string;
  slug: string;
  description?: string;
  mission?: string;
  vision?: string;
  industry?: string;
  location?: string;
  website?: string;
  logoUrl?: string;
  bannerUrl?: string;
}) {
  const user = await requireUser();

  if (!data.name || !data.slug) {
    throw new Error("Organization name and slug are required.");
  }

  // Check if slug is unique
  const existing = await prisma.organization.findUnique({
    where: { slug: data.slug },
  });
  if (existing) {
    throw new Error("An organization with this slug already exists.");
  }

  const organization = await prisma.organization.create({
    data: {
      name: data.name,
      slug: data.slug.toLowerCase().trim(),
      description: data.description,
      mission: data.mission,
      vision: data.vision,
      industry: data.industry,
      location: data.location,
      website: data.website,
      logoUrl: data.logoUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=256&auto=format&fit=crop",
      bannerUrl: data.bannerUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
      members: {
        create: {
          userId: user.id,
          role: "FOUNDER",
        },
      },
    },
  });

  revalidatePath("/organizations");
  revalidatePath("/workspace");
  return { success: true, organization };
}

export async function createSpace(data: {
  name: string;
  description?: string;
  bannerUrl?: string;
  rules?: string;
  organizationId: string;
}) {
  await requireUser();

  if (!data.name || !data.organizationId) {
    throw new Error("Space name and organization are required.");
  }

  const space = await prisma.space.create({
    data: {
      name: data.name,
      description: data.description,
      bannerUrl: data.bannerUrl || "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop",
      rules: data.rules,
      organizationId: data.organizationId,
    },
  });

  revalidatePath("/spaces");
  revalidatePath("/workspace");
  return { success: true, space };
}

export async function createEvent(data: {
  title: string;
  description?: string;
  bannerUrl?: string;
  spaceId: string;
  startTime: string | Date;
  endTime: string | Date;
  location?: string;
  venue?: string;
  capacity?: number;
  requirements?: string;
}) {
  await requireUser();

  if (!data.title || !data.spaceId || !data.startTime || !data.endTime) {
    throw new Error("Event title, space, start time, and end time are required.");
  }

  const event = await prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      bannerUrl: data.bannerUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop",
      spaceId: data.spaceId,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      location: data.location || "ONLINE",
      venue: data.venue,
      capacity: data.capacity ? Number(data.capacity) : undefined,
      requirements: data.requirements,
    },
  });

  revalidatePath("/events");
  revalidatePath("/workspace");
  return { success: true, event };
}

export async function createOpportunity(data: {
  title: string;
  type: string;
  description?: string;
  department?: string;
  employmentType?: string;
  openings?: number;
  experience?: string;
  location?: string;
  compensation?: string;
  stipend?: string;
  bannerUrl?: string;
  deadline?: string | Date;
  organizationId: string;
}) {
  await requireUser();

  if (!data.title || !data.type || !data.organizationId) {
    throw new Error("Opportunity title, type, and organization are required.");
  }

  const opportunity = await prisma.opportunity.create({
    data: {
      title: data.title,
      type: data.type,
      description: data.description,
      department: data.department,
      employmentType: data.employmentType,
      openings: data.openings ? Number(data.openings) : undefined,
      experience: data.experience,
      location: data.location || "REMOTE",
      compensation: data.compensation,
      stipend: data.stipend,
      bannerUrl: data.bannerUrl || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1200&auto=format&fit=crop",
      deadline: data.deadline ? new Date(data.deadline) : undefined,
      organizationId: data.organizationId,
    },
  });

  revalidatePath("/opportunities");
  if (data.type === "HACKATHON" || data.type === "CHALLENGE") {
    revalidatePath("/challenges");
  }
  revalidatePath("/workspace");
  return { success: true, opportunity };
}

export async function createProject(data: {
  title: string;
  description?: string;
  bannerUrl?: string;
  url?: string;
  demoUrl?: string;
  githubUrl?: string;
  figmaUrl?: string;
  stack?: string;
}) {
  const user = await requireUser();

  if (!data.title) {
    throw new Error("Project title is required.");
  }

  const project = await prisma.project.create({
    data: {
      title: data.title,
      description: data.description,
      bannerUrl: data.bannerUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
      url: data.url,
      demoUrl: data.demoUrl,
      githubUrl: data.githubUrl,
      figmaUrl: data.figmaUrl,
      stack: data.stack,
      userId: user.id,
    },
  });

  revalidatePath("/projects");
  revalidatePath("/workspace");
  return { success: true, project };
}

export async function createResearch(data: {
  title: string;
  abstract?: string;
  url?: string;
}) {
  const user = await requireUser();

  if (!data.title) {
    throw new Error("Research title is required.");
  }

  const research = await prisma.research.create({
    data: {
      title: data.title,
      abstract: data.abstract,
      url: data.url,
      userId: user.id,
    },
  });

  revalidatePath("/research");
  revalidatePath("/workspace");
  return { success: true, research };
}

export async function promoteAttendee(eventId: string, userId: string, status: string) {
  const viewer = await requireUser();

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      space: {
        include: {
          organization: {
            include: {
              members: true,
            },
          },
        },
      },
    },
  });

  if (!event) throw new Error("Event not found.");

  const isOrganizer = event.space.organization.members.some(
    (m) => m.userId === viewer.id && (m.role === "ADMIN" || m.role === "FOUNDER")
  );

  if (!isOrganizer) throw new Error("Unauthorized.");

  if (status === "REJECTED") {
    await prisma.eventAttendance.delete({
      where: {
        eventId_userId: { eventId, userId },
      },
    }).catch(() => {});
  } else {
    await prisma.eventAttendance.update({
      where: {
        eventId_userId: { eventId, userId },
      },
      data: {
        status,
      },
    });
  }

  const waitlistCount = await prisma.eventAttendance.count({
    where: {
      eventId,
      status: "WAITLISTED",
    },
  });

  await prisma.event.update({
    where: { id: eventId },
    data: { waitlistCount },
  });

  revalidatePath(`/events/${eventId}`);
  revalidatePath("/workspace");
  return { success: true };
}

export async function checkInAttendee(eventId: string, userId: string) {
  const viewer = await requireUser();

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      space: {
        include: {
          organization: {
            include: {
              members: true,
            },
          },
        },
      },
    },
  });

  if (!event) throw new Error("Event not found.");

  const isOrganizer = event.space.organization.members.some(
    (m) => m.userId === viewer.id && (m.role === "ADMIN" || m.role === "FOUNDER")
  );

  if (!isOrganizer) throw new Error("Unauthorized.");

  await prisma.eventAttendance.upsert({
    where: {
      eventId_userId: { eventId, userId },
    },
    update: {
      status: "CHECKED_IN",
    },
    create: {
      eventId,
      userId,
      status: "CHECKED_IN",
    },
  });

  revalidatePath(`/events/${eventId}`);
  revalidatePath("/workspace");
  return { success: true };
}

