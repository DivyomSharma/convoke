"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { getActiveIdentity } from "@/lib/identity";
import { auth } from "@clerk/nextjs/server";
import { isChallengeType } from "@/lib/challenge-types";

export async function rsvpToEvent(meetId: string, status: "GOING" | "INTERESTED") {
  const user = await requireUser();

  const meet = await prisma.meet.findUnique({
    where: { id: meetId },
    select: { capacity: true }
  });

  if (!meet) {
    throw new Error("Meet not found.");
  }

  const existingAttendance = await prisma.meetAttendance.findUnique({
    where: {
      meetId_userId: {
        meetId,
        userId: user.id,
      },
    },
  });

  let finalStatus: string = status;
  if (status === "GOING" && existingAttendance?.status !== "GOING") {
    // Check current GOING count
    const goingCount = await prisma.meetAttendance.count({
      where: {
        meetId,
        status: "GOING",
      },
    });

    if (meet.capacity && goingCount >= meet.capacity) {
      finalStatus = "WAITLISTED";
    }
  }

  await prisma.meetAttendance.upsert({
    where: {
      meetId_userId: {
        meetId,
        userId: user.id,
      },
    },
    update: {
      status: finalStatus,
    },
    create: {
      meetId,
      userId: user.id,
      status: finalStatus,
    },
  });

  // Re-calculate waitlist count for the meet
  const waitlistCount = await prisma.meetAttendance.count({
    where: {
      meetId,
      status: "WAITLISTED",
    },
  });

  await prisma.meet.update({
    where: { id: meetId },
    data: { waitlistCount },
  });

  revalidatePath("/workspace");
  revalidatePath("/workspace/tickets");
  revalidatePath("/meets");
  revalidatePath(`/meets/${meetId}`);
  return { success: true, status: finalStatus };
}

export async function applyToOpportunity(data: { opportunityId: string; pitch?: string; resumeUrl?: string }) {
  try {
    const user = await requireUser();
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: data.opportunityId },
      select: { type: true },
    });

    if (!opportunity) {
      return { success: false, error: "Opportunity not found." };
    }

    const existing = await prisma.application.findFirst({
      where: { opportunityId: data.opportunityId, userId: user.id },
    });

    if (existing) {
      return { success: false, error: "Already applied to this opportunity." };
    }

    await prisma.application.create({
      data: {
        opportunityId: data.opportunityId,
        userId: user.id,
        status: "PENDING",
        pitch: data.pitch,
        resumeUrl: data.resumeUrl,
      },
    });

    revalidatePath("/workspace");
    revalidatePath("/workspace/tickets");
    revalidatePath("/opportunities");
    revalidatePath(`/opportunities/${data.opportunityId}`);
    if (isChallengeType(opportunity.type)) {
      revalidatePath("/challenges");
      revalidatePath(`/challenges/${data.opportunityId}`);
    }
    return { success: true };
  } catch (error: unknown) {
    console.error("Error in applyToOpportunity:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to apply.",
    };
  }
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
  discord?: string;
  instagram?: string;
  whatsapp?: string;
  twitter?: string;
  linkedin?: string;
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
      logoUrl: data.logoUrl,
      bannerUrl: data.bannerUrl,
      discord: data.discord,
      instagram: data.instagram,
      whatsapp: data.whatsapp,
      twitter: data.twitter,
      linkedin: data.linkedin,
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
  discord?: string;
  instagram?: string;
  whatsapp?: string;
  twitter?: string;
  linkedin?: string;
}) {
  await requireUser();

  if (!data.name || !data.organizationId) {
    throw new Error("Space name and organization are required.");
  }

  const space = await prisma.space.create({
    data: {
      name: data.name,
      description: data.description,
      bannerUrl: data.bannerUrl,
      rules: data.rules,
      organizationId: data.organizationId,
      discord: data.discord,
      instagram: data.instagram,
      whatsapp: data.whatsapp,
      twitter: data.twitter,
      linkedin: data.linkedin,
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
  mode?: string;
  discord?: string;
  instagram?: string;
  whatsapp?: string;
  twitter?: string;
  linkedin?: string;
  category?: string;
  region?: string;
}) {
  await requireUser();

  if (!data.title || !data.spaceId || !data.startTime || !data.endTime) {
    throw new Error("Meet title, space, start time, and end time are required.");
  }

  const categoryArray = data.category ? data.category.split(",").map(s => s.trim()).filter(Boolean) : [];

  const meet = await prisma.meet.create({
    data: {
      title: data.title,
      description: data.description,
      bannerUrl: data.bannerUrl,
      spaceId: data.spaceId,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      location: data.location || "ONLINE",
      venue: data.venue,
      capacity: data.capacity ? Number(data.capacity) : undefined,
      requirements: data.requirements,
      mode: data.mode,
      discord: data.discord,
      instagram: data.instagram,
      whatsapp: data.whatsapp,
      twitter: data.twitter,
      linkedin: data.linkedin,
      category: categoryArray,
      region: data.region || null,
    },
  });

  revalidatePath("/meets");
  revalidatePath("/workspace");
  return { success: true, meet };
}

export async function createOpportunity(data: {
  title: string;
  type: string;
  participation?: string;
  minTeamSize?: number;
  maxTeamSize?: number;
  crossCollegeTeams?: boolean;
  teamFormationEnabled?: boolean;
  description?: string;
  department?: string;
  employmentType?: string;
  openings?: number;
  experience?: string;
  location?: string;
  compensation?: string;
  benefits?: string;
  stipend?: string;
  bannerUrl?: string;
  brochureUrl?: string;
  mode?: string;
  discord?: string;
  instagram?: string;
  whatsapp?: string;
  twitter?: string;
  linkedin?: string;
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
      participation: data.participation,
      minTeamSize: data.minTeamSize ? Number(data.minTeamSize) : undefined,
      maxTeamSize: data.maxTeamSize ? Number(data.maxTeamSize) : undefined,
      crossCollegeTeams: data.crossCollegeTeams ?? false,
      teamFormationEnabled: data.teamFormationEnabled ?? false,
      description: data.description,
      department: data.department,
      employmentType: data.employmentType,
      openings: data.openings ? Number(data.openings) : undefined,
      experience: data.experience,
      location: data.location || "REMOTE",
      compensation: data.compensation,
      benefits: data.benefits,
      stipend: data.stipend,
      bannerUrl: data.bannerUrl,
      brochureUrl: data.brochureUrl,
      mode: data.mode,
      discord: data.discord,
      instagram: data.instagram,
      whatsapp: data.whatsapp,
      twitter: data.twitter,
      linkedin: data.linkedin,
      deadline: data.deadline ? new Date(data.deadline) : undefined,
      organizationId: data.organizationId,
    },
  });

  revalidatePath("/opportunities");
  if (isChallengeType(data.type)) {
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
  category?: string;
  region?: string;
}) {
  const user = await requireUser();

  if (!data.title) {
    throw new Error("Project title is required.");
  }

  const categoryArray = data.category ? data.category.split(",").map(s => s.trim()).filter(Boolean) : [];

  const project = await prisma.project.create({
    data: {
      title: data.title,
      description: data.description,
      bannerUrl: data.bannerUrl,
      url: data.url,
      demoUrl: data.demoUrl,
      githubUrl: data.githubUrl,
      figmaUrl: data.figmaUrl,
      stack: data.stack,
      category: categoryArray,
      region: data.region,
      userId: user.id,
    },
  });

  revalidatePath("/projects");
  revalidatePath("/workspace");
  return { success: true, project };
}

export async function getWorkspaceContexts() {
  const { userId } = await auth();

  if (!userId) {
    return {
      personal: { label: "Personal", id: undefined },
      organizations: [],
      spaces: [],
      activeContext: { type: "personal" as const, label: "Personal", id: undefined }
    };
  }

  const [memberships, spaceMemberships, activeIdentity, dbUser] = await Promise.all([
    prisma.membership.findMany({
      where: {
        userId,
        role: { in: ["ADMIN", "FOUNDER"] },
      },
      include: {
        organization: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: { createdAt: "asc" },
    }),
    prisma.spaceMembership.findMany({
      where: {
        userId,
        role: { in: ["Founder", "Lead", "Organizer", "Core Team", "ADMIN", "FOUNDER", "LEAD", "ORGANIZER"] },
      },
      include: {
        space: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "asc" },
    }),
    getActiveIdentity(),
    prisma.user.findUnique({
      where: { id: userId },
      select: { onboardingCompleted: true }
    })
  ]);

  let activeLabel = "Personal";
  let activeId: string | undefined = undefined;
  if (activeIdentity.type === "org") {
    activeLabel = activeIdentity.org.name;
    activeId = activeIdentity.org.id;
  } else if (activeIdentity.type === "space") {
    activeLabel = activeIdentity.space.name;
    activeId = activeIdentity.space.id;
  }

  return {
    personal: { label: "Personal", id: undefined, href: "/workspace" },
    organizations: memberships.map((m) => ({
      id: m.organization.id,
      label: m.organization.name,
      slug: m.organization.slug,
      href: `/workspace/org/${m.organization.slug}`
    })),
    spaces: spaceMemberships.map((m) => ({
      id: m.space.id,
      label: m.space.name,
      href: `/workspace/space/${m.space.id}`
    })),
    activeContext: {
      type: activeIdentity.type,
      label: activeLabel,
      id: activeId
    },
    onboardingCompleted: dbUser?.onboardingCompleted ?? false,
  };
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

export async function promoteAttendee(meetId: string, userId: string, status: string) {
  const viewer = await requireUser();

  const meet = await prisma.meet.findUnique({
    where: { id: meetId },
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

  if (!meet) throw new Error("Meet not found.");

  const isOrganizer = meet.space.organization?.members.some(
    (m) => m.userId === viewer.id && (m.role === "ADMIN" || m.role === "FOUNDER")
  ) || false;

  if (!isOrganizer) throw new Error("Unauthorized.");

  if (status === "REJECTED") {
    await prisma.meetAttendance.delete({
      where: {
        meetId_userId: { meetId, userId },
      },
    }).catch(() => {});
  } else {
    await prisma.meetAttendance.update({
      where: {
        meetId_userId: { meetId, userId },
      },
      data: {
        status,
      },
    });
  }

  const waitlistCount = await prisma.meetAttendance.count({
    where: {
      meetId,
      status: "WAITLISTED",
    },
  });

  await prisma.meet.update({
    where: { id: meetId },
    data: { waitlistCount },
  });

  revalidatePath(`/meets/${meetId}`);
  revalidatePath("/workspace");
  return { success: true };
}

export async function checkInAttendee(meetId: string, userId: string) {
  const viewer = await requireUser();

  const meet = await prisma.meet.findUnique({
    where: { id: meetId },
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

  if (!meet) throw new Error("Meet not found.");

  const isOrganizer = meet.space.organization?.members.some(
    (m) => m.userId === viewer.id && (m.role === "ADMIN" || m.role === "FOUNDER")
  ) || false;

  if (!isOrganizer) throw new Error("Unauthorized.");

  await prisma.meetAttendance.upsert({
    where: {
      meetId_userId: { meetId, userId },
    },
    update: {
      status: "CHECKED_IN",
    },
    create: {
      meetId,
      userId,
      status: "CHECKED_IN",
    },
  });

  revalidatePath(`/meets/${meetId}`);
  revalidatePath("/workspace");
  return { success: true };
}
